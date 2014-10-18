'''
 * Author: Lukasz Jachym
 * Date: 9/15/13
 * Time: 5:40 PM
 *
 * This work is licensed under the Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
 * To view a copy of this license, visit http://creativecommons.org/licenses/by-nc-sa/3.0/.
'''
import string
import itertools
import operator


def convert(value, from_currency, to_currency, rates):

    exchange_rate_from = float(rates[from_currency])
    exchange_rate_to = float(rates[to_currency])

    if (to_currency == 'USD'):
        return exchange_rate_from * float(value)
    else:
        return (exchange_rate_to / exchange_rate_from) * float(value)


def get_digits_only(str):
    return ''.join([c for c in str if c in '1234567890'])

def str_to_int(str):
    rValue = None

    # check if it's float
    if (str[-3] in [ '.', ','] ):
        rValue = int(get_digits_only(str[:-3]))
    else:
        if (str[-2] in [ '.', ','] ):
            rValue = int(get_digits_only(str[:-2]))
        else:
            rValue = int(get_digits_only(str))

    return rValue