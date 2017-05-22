""" Test runner """
import unittest
import os

if __name__ == "__main__":
    dir = os.path.dirname(__file__)
    loader = unittest.TestLoader()
    suite = loader.discover(dir, pattern='*_test.py')
    runner = unittest.TextTestRunner()
    runner.run(suite)
