""" Utilities for routes """
from flask import make_response
from json import dumps

def respond(data, checker, action):
    """ Checks passed data and makes response """
    check = checker(data)
    if check[0]:
        act = action(data)
        return make_response(dumps(act[0]), act[1])
    else:
        return make_response(dumps({ "error": check[1] }), 400)

def respond_form(data, files, checker, action):
    """ Checks passed form data and makes response """
    check = checker(data, files)
    if check[0]:
        act = action(data, files)
        return make_response(dumps(act[0]), act[1])
    else:
        return make_response(dumps({ "error": check[1] }), 400)