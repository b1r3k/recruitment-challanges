'''
 * Author: Lukasz Jachym
 * Date: 9/14/13
 * Time: 3:43 PM
 *
 * This work is licensed under the Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
 * To view a copy of this license, visit http://creativecommons.org/licenses/by-nc-sa/3.0/.
'''
from collections import namedtuple

import csv
from dateutil.parser import *
from itertools import groupby
import operator
import sys
from classifier import parse_source
import exchange
import locale


class VisitRecord(object):
    def __init__(self, visit_date, user_id, visit_id, source, order_id):
        self.visit_date = visit_date
        self.user_id = user_id
        self.visit_id = visit_id
        channel = parse_source(source)
        self.source_type = channel.type
        self.source_branded = channel.branded
        self.order_id = order_id


OrderRecord = namedtuple('OrderRecord', ['order_date', 'country', 'order_id', 'value', 'currency', 'product_category', 'source_type', 'source_branded'])


def get_csv_data(path):
    content = []

    with open(path, 'rb') as csv_in:
        reader = csv.DictReader(csv_in, delimiter=';', quotechar='"')
        for item in reader:
            content.append(item)

    return content


def parse_visitors(path, for_date=None):
    visitors_raw = get_csv_data(path)
    all_visitors = []
    visitors_with_orders = {}

    # "VisitDate";"UserID";"VisitID";"Source";"OrderID"
    for visitor in visitors_raw:
        date_formatted = parse(visitor['VisitDate']).strftime("%Y-%m-%d")

        order_id = visitor['OrderID']
        visit_record = VisitRecord(date_formatted, visitor['UserID'], visitor['VisitID'], visitor['Source'], order_id)
        visitors_with_orders[order_id] = visit_record

        if not for_date:
            all_visitors.append(visit_record)
        else:
            if for_date == date_formatted:
                all_visitors.append(visit_record)

    return all_visitors, visitors_with_orders


def parse_orders(path, visitors_with_orders_dict, for_date=None):
    orders_raw = get_csv_data(path)
    orders = []

    locale_map = { 'UK': 'en_GB',
                   'FR': 'eu_FR',
                   'ES': 'eu_ES',
                   'IT': 'it_IT',
                   'US': 'en_US',
                   'EUR': 'eu_FR',
                   'GBP': 'en_GB',
                   'USD': 'en_US',
                   }

    # "OrderDate";"Country";"OrderId";"Value";"Currency";"ProductCategory"
    for order in orders_raw:
        date_formatted = parse(order['OrderDate']).strftime("%Y-%m-%d")
        country = order['Country']
        order_id = order['OrderId']
        currency = order['Currency']
        prod_category = order['ProductCategory']

        value = 0

        try:
            country_locale = '%s.UTF-8' % locale_map[country]
            locale.setlocale( locale.LC_ALL, country_locale)
            value = locale.atoi(order['Value'])

        except locale.Error:
            print('Install locale %s' % country_locale)

        # fallback, hold tight!
        except ValueError:
            value = exchange.str_to_int(order['Value'])

        assert value > 0, 'Could not convert transaction value of record: %s' % order

        try:
            source_type = visitors_with_orders_dict[order_id].source_type
            source_branded = visitors_with_orders_dict[order_id].source_branded

        except KeyError:
            print('Cannot find order: %s, ignoring, expected inconsistencies.' % order_id)
            source_type = None
            source_branded = None
            pass

        order_record = OrderRecord(date_formatted, country, order_id, value, currency, prod_category, source_type, source_branded)
        if not for_date:
            orders.append(order_record)

        else:
            if for_date == date_formatted:
                orders.append(order_record)

    return orders


def group_collection_by_key(collection, key):
    groups_by_channel_type = {}
    sorted_x = sorted(collection, key=key)
    for k, g in groupby(sorted_x, key):
        groups_by_channel_type[k] = list(g)

    return groups_by_channel_type


labels = {(3, False): 'PPC_NonBrand',
              (2, False): 'SEO_NonBrand',
              (1, False): 'Direct',
              (3, True): 'PPC_Brand',
              (2, True): 'SEO_Brand',
    (None, None): 'Unknown'
    }

def print_visitors_summary(groups_by_channel_type):
    print('Visitors:')
    for channel_type in groups_by_channel_type:
        visitors_by_channel_type = groups_by_channel_type[channel_type]

        by_user_id = lambda obj: obj.user_id
        unique_user_ids = set(map(by_user_id, visitors_by_channel_type))

        print('Channel: %s - %d Users, %d Visits' % (
        labels[channel_type], len(unique_user_ids), len(visitors_by_channel_type)))

        assert len(unique_user_ids) <= len(visitors_by_channel_type)

def print_order_summary(orders_by_key, total_orders_value, currency):
    print('Orders:')
    for order_type in orders_by_key:
        print('%s - %s - %s = %d orders, %d %s' % (order_type[0], order_type[1], labels[order_type[2:4]], len(orders_by_key[order_type]), total_orders_value[order_type], currency))

    print('')

date = sys.argv[1]
currency = sys.argv[2]

# print('Parsing data...')
visitors, visitors_with_orders = parse_visitors('../../data/task1/visitors.txt', date)
orders = parse_orders('../../data/task1/orders.txt', visitors_with_orders, date)

# print('Transforming views...')

by_src_type = lambda container: (container.source_type, container.source_branded)
visitors_by_channel_type = group_collection_by_key(visitors, by_src_type)

by_country_product_channel = lambda container: (container.country, container.product_category, container.source_type, container.source_branded)
orders_by_key = group_collection_by_key(orders, by_country_product_channel)

total_orders_values = {}

exchange_rates_api = exchange.OpenExchangeClient('1aecd98b5fd9489fac736c2345379bcf')
exchange_rates = exchange_rates_api.get_historical_rates(date)

for key in orders_by_key:
    selected_orders = orders_by_key[key]

    total_orders_value = 0

    for order in selected_orders:
        order_value = exchange.convert(order.value, order.currency, currency, exchange_rates)
        total_orders_value += order_value

    total_orders_values[key] = total_orders_value

print_order_summary(orders_by_key, total_orders_values, currency)
print_visitors_summary(visitors_by_channel_type)
