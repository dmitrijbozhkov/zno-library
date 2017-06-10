""" Manages users """
from flask import Blueprint, request, make_response, Response
from json import dumps
from .auth_model import CredentialsChecker, add_user, log_in_credentials, user_has_role
import datetime

def check_account(req, role):
    """ Checks if user has appropriate role """
    try:
        email = user_has_role(req["email"], role)
    except KeyError as err:
        return (False, make_response(dumps({ "error": "No email field" }), 401))
    else:
        valid = user_has_role(req["email"], role)
        if valid[0]:
            return valid
        else:
            return (False, make_response(dumps({ "error": valid[1] }), 401))

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
        user = log_in_credentials(credentials)
        if user[0]:
            response = make_response(dumps({ "token": user[1], "email": user[2]["email"], "roles": user[2]["roles"], "name": user[2]["name"], "surname": user[2]["surname"], "lastName": user[2]["lastName"] }), 200)
        else:
            response = make_response(dumps({ "error": user[1] }), 401)
    else:
        response = make_response(dumps({ "error": check[1] }), 400)
    response.headers["Content-Type"] = "application/json"
    return response
