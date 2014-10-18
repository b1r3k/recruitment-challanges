'''
 * Author: Lukasz Jachym
 * Date: 9/14/13
 * Time: 2:25 PM
 *
 * This work is licensed under the Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
 * To view a copy of this license, visit http://creativecommons.org/licenses/by-nc-sa/3.0/.
'''
import requests

API_ENDPOINT = 'http://ws.audioscrobbler.com/2.0/'

class Client(object):

    def __init__(self, api_key, api_secret, endpoint = API_ENDPOINT, output_format = 'json'):
        self.api_key = api_key
        self.api_secret = api_secret
        self.output_format = output_format
        self.api_endpoint = endpoint

    def invoke_api_method(self, method_name, **kwargs):
        kwargs['method']=method_name
        kwargs['api_key'] = self.api_key
        kwargs['format']=self.output_format

        r = requests.get(self.api_endpoint, params=kwargs)
        json_results = r.json()

        return json_results