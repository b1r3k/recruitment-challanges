'''
 * Author: Lukasz Jachym
 * Date: 9/14/13
 * Time: 1:43 PM
 *
 * This work is licensed under the Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
 * To view a copy of this license, visit http://creativecommons.org/licenses/by-nc-sa/3.0/.
'''
import sys
import operator
import lastfm_api

API_KEY = '1472217b8dde21f29b4f157af0745a79'
API_SECRET = 'd5b671501a44609d3f08765a21f03047'

client = lastfm_api.Client(API_KEY, API_SECRET)

def get_artist_genere(artist_name):
    try:
        artist_info = client.invoke_api_method('artist.getinfo', artist=artist_name)

    except Exception as e:
        print('Cannot fetch data from last.fm')
        sys.exit(1)


    try:
        tags = artist_info['artist']['tags']

        generes = []

        for tag in tags['tag']:
            generes.append(tag['name'])

    except Exception as e:
        generes = ['Unknown']

    return generes

def get_artist_albums(artist_name):
    total_albums = []

    current_result_page = 1
    total_pages = 1

    while (current_result_page <= total_pages):
        try:
            artist_albums = client.invoke_api_method('artist.gettopalbums', artist=artist_name, page = current_result_page)
        except Exception as e:
            print('Cannot fetch data from last.fm')
            sys.exit(1)

        total_pages = int(artist_albums['topalbums']['@attr']['totalPages'])

        try:
            total_albums += artist_albums['topalbums']['album']

        except Exception as e:
            print('Cannot parse album list?!')
            print('JSON object: %s' % artist_albums)

        current_result_page += 1

    assert len(total_albums) > (total_pages - 1) * 50

    return total_albums

try:
    artist_name = sys.argv[1]

except IndexError:
    print('Please supply artist name.')
    sys.exit(-1)

generes = get_artist_genere(artist_name)
albums = get_artist_albums(artist_name)
albums_names = map(operator.itemgetter('name'), albums)

print(artist_name)
print('Genere: %s\n' % ', '.join(generes))
print('Albums:\n')

for album_name in albums_names:
    print(' * %s' % album_name)