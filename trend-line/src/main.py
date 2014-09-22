# -*- coding: UTF-8 -*-
'''
 * Author: Lukasz Jachym
 * Date: 9/18/14
 * Time: 1:44 PM
 *
 * This work is licensed under the Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
 * To view a copy of this license, visit http://creativecommons.org/licenses/by-nc-sa/3.0/.
'''

import argparse
from collections import namedtuple
import sys
import csv

import numpy as np
from matplotlib.dates import date2num
import matplotlib.pyplot as plt

from numpy.linalg import lstsq
from pandas import read_csv

TrendLine = namedtuple('TrendLine', ['start_point_date',    # data początku linii trendu (punkt startowy)
                                     'start_point_value',   # wartość linii trendu w punkcie startowym
                                     'sigma_high_start_point_value',  # wartość linii przesuniętej o jedno odchylenie standardowe w górę w punkcie startowym
                                     'sigma_low_start_point_value',   # wartość linii przesuniętej o jedno odchylenie standardowe w dół w punkcie startowym
                                     'end_point_date',       # data końca linii trendu (punkt końcowy)
                                     'end_point_value', # wartość linii trendu w punkcie końcowym
                                     'sigma_high_end_point_value', # wartość linii przesuniętej o jedno odchylenie standardowe w górę w punkcie końcowym
                                     'sigma_low_end_point_value', # wartość linii przesuniętej o jedno odchylenie standardowe w dół w punkcie końcowym
                                     ])

def get_trend_line(A, y, start_idx, width):

    solution = lstsq(A[start_idx:start_idx + width], y[start_idx:start_idx + width])
    m, c = solution[0]

    # print('Residuals: {0}'.format(solution[1][0]))
    # print('Singular values: {0}'.format(solution[3]))
    # print('m = {0}, c = {1}'.format(m, c))

    return m, c

def get_all_trend_lines(A, y, dates, width):
    trend_lines = []
    samples_amount = len(y)
    trend_lines_amount = samples_amount / width

    std = np.std(y, axis = 0)

    trendline = lambda date_idx: m * date_idx + c
    trendline_sigma = lambda date_idx, sigma: m * date_idx + c + sigma*std


    for trend_line_idx in range(trend_lines_amount):
        trend_line_idx_start = trend_line_idx * width
        m, c = get_trend_line(A, y, trend_line_idx_start, width)
        new_trendline = TrendLine(dates[trend_line_idx_start],
                                  trendline(trend_line_idx_start),
                                  trendline_sigma(trend_line_idx_start, 1),
                                  trendline_sigma(trend_line_idx_start, -1),
                                  dates[trend_line_idx_start + width],
                                  trendline(trend_line_idx_start + width),
                                  trendline_sigma(trend_line_idx_start + width, 1),
                                  trendline_sigma(trend_line_idx_start + width, -1),
                                  )
        trend_lines.append(new_trendline)

    return trend_lines

def get_matrices(csv_file_handle):
    names = ['date', 'hour']
    pricing_names = ['open', 'high', 'low', 'close']
    additional_names = ['something']
    df = read_csv(csv_file_handle, sep=',', names=names + pricing_names + additional_names, parse_dates=['date'], engine='python')

    data = df.close
    timestamps = np.arange(len(data))
    # x = timestamps
    A_mtx = np.vstack([timestamps, np.ones(len(timestamps))]).T

    return A_mtx, np.array(data), df.date

def plot_trendlines(trend_lines):
    plt.plot(dates.map(date2num), y, 'o', label='Original data', markersize=4)

    for trend_line in trend_lines:
        plt.plot([trend_line.start_point_date, trend_line.end_point_date],
                 [trend_line.start_point_value, trend_line.end_point_value],
                 color='red', linestyle='-', linewidth=1)

        #sigma +1
        plt.plot([trend_line.start_point_date, trend_line.end_point_date],
                 [trend_line.sigma_high_start_point_value, trend_line.sigma_high_end_point_value],
                 color='green', linestyle='-', linewidth=1)
        #sigma -1
        plt.plot([trend_line.start_point_date, trend_line.end_point_date],
                 [trend_line.sigma_low_start_point_value, trend_line.sigma_low_end_point_value],
                 color='green', linestyle='-', linewidth=1)

    plt.legend()
    plt.show()

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--plot', action='store_true')
    parser.add_argument('--trend-lines', action='store_true')
    parser.add_argument('--width', action='store', dest='width')
    parser.add_argument('csv_path', nargs=1, help='a path to the csv file with prices in OHLC format')
    args = parser.parse_args()

    data_output = csv.DictWriter(sys.stdout, TrendLine._fields, delimiter=';')

    trend_lines = None

    if args.trend_lines:
        with open(args.csv_path[0], 'r') as fp:
            A, y, dates = get_matrices(fp)
            width = int(args.width) or 40
            trend_lines = get_all_trend_lines(A, y, dates, width)

            data_output.writerows(map(lambda item: item._asdict(), trend_lines))

    if args.plot:
        plot_trendlines(trend_lines)