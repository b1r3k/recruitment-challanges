'''
 * Author: Lukasz Jachym
 * Date: 9/15/13
 * Time: 5:20 PM
 *
 * This work is licensed under the Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
 * To view a copy of this license, visit http://creativecommons.org/licenses/by-nc-sa/3.0/.
'''
import requests

BASE_URL = 'http://openexchangerates.org/api/'
HISTORICAL_ENDPOINT = BASE_URL + 'historical/%s.json'

class Client(object):
    def __init__(self, api_key):
        self.api_key = api_key


    def get_historical_rates(self, date):
        # date format YYYY-MM-DD

        response = requests.get(HISTORICAL_ENDPOINT % date, params={'app_id': self.api_key})

        return response.json()['rates']
