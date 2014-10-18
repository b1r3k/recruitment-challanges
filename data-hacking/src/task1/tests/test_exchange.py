import unittest
from exchange import convert, str_to_int

class ExchangeConverter(unittest.TestCase):
    def test_conversion_one_way(self):

        rates = { 'USD': 1,
                  'PLN': 3.16,
                  'EUR': 0.75}

        expected = 7.5

        result = convert(10, 'EUR', 'USD', rates)

        self.assertEqual(result, expected)

    def test_conversion_two_way(self):

        rates = { 'USD': 1,
                  'PLN': 3.16,
                  'EUR': 0.75}

        expected = 42

        result = convert(10, 'EUR', 'PLN', rates)

        self.assertEqual(round(result), expected)

    def test_currency_value_conversion_float2(self):
        input_str = '10,00'
        result = str_to_int(input_str)

        expected = 10

        self.assertEqual(result, expected)

    def test_currency_value_conversion_float1(self):
        input_str = '10,0'
        result = str_to_int(input_str)

        expected = 10

        self.assertEqual(result, expected)

    def test_currency_value_conversion_thousand(self):
        input_arg = '1.000,00'
        expected = 1000

        result = str_to_int(input_arg)

        self.assertEqual(result, expected)


if __name__ == '__main__':
    unittest.main()
