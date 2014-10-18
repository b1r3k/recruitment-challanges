import unittest
import classifier

class KeywordsBranding(unittest.TestCase):

    def test_keyword_brand_distance(self):
        input_str = 'lastminute.com'

        expected = 0

        result = classifier.get_brand_distance(input_str)

        self.assertEqual(result, expected)

    def test_keyword_brand_distance2(self):
        input_str = 'lastminute'

        expected = 0

        result = classifier.get_brand_distance(input_str)

        self.assertEqual(result, expected)

    def test_keyword_branded_simple(self):
        input_str = 'lastminute.com'

        expected = True
        result = classifier.is_branded(input_str)

        self.assertEqual(result, expected)

    def test_keyword_branded_simple2(self):
        input_str = 'last minut'

        expected = True
        result = classifier.is_branded(input_str)

        self.assertEqual(result, expected)

    def test_keyword_branded_many_words(self):
        input_str = 'new york city break; last minute'

        expected = True
        result = classifier.is_branded(input_str)

        self.assertEqual(result, expected)


if __name__ == '__main__':
    unittest.main()
