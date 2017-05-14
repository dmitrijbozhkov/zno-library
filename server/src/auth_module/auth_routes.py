""" Manages users """
from flask import Blueprint, request, make_response, Response
from json import dumps
from .auth_model import CredentialsChecker, add_user, log_in_credentials
import datetime

credentials_checker = CredentialsChecker()

auth = Blueprint("auth", "auth_routes", url_prefix="/auth")

@auth.route("/create/", methods=["POST"])
def sign_up():
    """ Signs up new user """
    credentials = request.get_json()
    check = credentials_checker.create_check(credentials)
    if check[0]:
        adding = add_user(credentials)
        if adding[0]:
            response = make_response(dumps({ "reponse": adding[1] }), 200)
        else:
            response = make_response(dumps({ "error": adding[1] }), 400)
    else:
        response = make_response(dumps({ "error": check[1] }), 400)
    response.headers["Content-Type"] = "application/json"
    return response

@auth.route("/login/", methods=["POST"])
def log_in():
    """ Logs in exsitiong user """
    credentials = request.get_json()
    check = credentials_checker.log_in_check(credentials)
    if check[0]:
        token = log_in_credentials(credentials)
        if token[0]:
            response = make_response(dumps({ "token": token[1] }), 200)
        else:
            response = make_response(dumps({ "error": token[1] }), 401)
    else:
        response = make_response(dumps({ "error": check[1] }), 400)
    response.headers["Content-Type"] = "application/json"
    return response
