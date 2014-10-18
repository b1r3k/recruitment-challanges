'''
 * Author: Lukasz Jachym
 * Date: 9/14/13
 * Time: 7:22 PM
 *
 * This work is licensed under the Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
 * To view a copy of this license, visit http://creativecommons.org/licenses/by-nc-sa/3.0/.
'''
import string
from nltk import metrics, stem, tokenize
import itertools
import functools

stemmer = stem.PorterStemmer()

def normalize(s):
    words = tokenize.word_tokenize(s.lower().strip())
    return [stemmer.stem(w) for w in words]

def get_brand_distance(keywords_str):

    tokens = normalize(keywords_str)

    if (len(tokens) > 1):
        permutations = itertools.permutations(tokens, 2)
        two_words = map(string.join, permutations)

    else:
        two_words = tokens

    distance1 = functools.partial(metrics.edit_distance, ''.join(normalize('lastminute.com')))
    distance2 = functools.partial(metrics.edit_distance, ''.join(normalize('lastminute')))

    distances = map(distance1, two_words) + map(distance2, two_words)

    return min(distances)

is_branded = lambda query: True if get_brand_distance(query) <= 3 else False
