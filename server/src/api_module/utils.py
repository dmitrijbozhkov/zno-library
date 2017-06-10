""" Functions used by other modules """
from random import choices
from string import ascii_letters, digits

def generate_id(number):
    """ Generates random id with given length """
    return ''.join(choices(ascii_letters + digits, k=number))