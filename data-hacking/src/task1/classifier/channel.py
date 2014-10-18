'''
 * Author: Lukasz Jachym
 * Date: 9/14/13
 * Time: 5:40 PM
 *
 * This work is licensed under the Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
 * To view a copy of this license, visit http://creativecommons.org/licenses/by-nc-sa/3.0/.
'''

from collections import namedtuple
from branding import is_branded

DIRECT = 1
PPC = 2
SEO = 3

Channel = namedtuple('Channel', ['type', 'keywords', 'branded'])

def get_ppc_keywords(ppc_str):
    """
    :param ppc_str:
    :return: keywords
    """

    try:
        keywords = ppc_str.split('_')[2]

    except KeyError:
        raise ValueError

    return keywords

def get_seo_keywords(seo_query):
    """
    :param ppc_str:
    :return: keywords
    """

    try:
        keywords = seo_query.split(' :: ')[2]

    except KeyError:
        raise ValueError

    return keywords

def parse_source(source_str):

    if (source_str[0:3] == 'ppc'):
        channel_type = PPC
        keywords = get_ppc_keywords(source_str)
        channel_keywords = keywords
        channel_branded = is_branded(keywords)
        channel = Channel(channel_type, channel_keywords, channel_branded)
    else:
        if source_str[0:3] == 'seo':
            channel_type = SEO
            keywords = get_seo_keywords(source_str)
            channel_keywords = keywords
            channel_branded = is_branded(keywords)
            channel = Channel(channel_type, channel_keywords, channel_branded)
        else:
            channel_type = DIRECT
            channel_keywords = None
            channel_branded = False
            channel = Channel(channel_type, channel_keywords, channel_branded)

    return channel