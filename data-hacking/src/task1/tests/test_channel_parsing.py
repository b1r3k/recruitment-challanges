import unittest
import classifier

class ChannelParsing(unittest.TestCase):
    def test_ppc_keywords_parsing(self):
        input_str = 'ppc_ES_lastminutecom'

        expected = ('lastminutecom')
        result = classifier.get_ppc_keywords(input_str)

        self.assertEqual(result, expected)

    def test_seo_keywords_parsing(self):
        input_str = 'seo :: google :: lastminute.com'

        expected = 'lastminute.com'
        result = classifier.get_seo_keywords(input_str)

        self.assertEqual(result, expected)

    def test_parse_channel_seo_branded(self):
        input_arg = 'seo :: google :: lastminute'
        expected = (classifier.SEO, 'lastminute', True)

        result = classifier.parse_source(input_arg)

        self.assertEqual(result, expected)

    def test_parse_channel_seo_nonbranded(self):
        input_arg = 'seo :: google :: cheap hotel rooms'
        expected = (classifier.SEO, 'cheap hotel rooms', False)

        result = classifier.parse_source(input_arg)

        self.assertEqual(result, expected)

    def test_parse_channel_ppc_nonbranded(self):
        input_arg = 'ppc_UK_cheap hotel rooms'
        expected = (classifier.PPC, 'cheap hotel rooms', False)

        result = classifier.parse_source(input_arg)

        self.assertEqual(result, expected)

    def test_parse_channel_ppc_branded(self):
        input_arg = 'ppc_UK_cheap hotel rooms last minut'
        expected = (classifier.PPC, 'cheap hotel rooms last minut', True)

        result = classifier.parse_source(input_arg)

        self.assertEqual(result, expected)

    def test_parse_channel_direct(self):
        input_arg = ''
        expected = (classifier.DIRECT, None, False)

        result = classifier.parse_source(input_arg)

        self.assertEqual(result, expected)

if __name__ == '__main__':
    unittest.main()
