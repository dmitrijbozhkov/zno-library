""" Defines api routes """
from flask import Blueprint, request, make_response
from json import dumps
from app import db
from flask_security import auth_token_required
from auth_module.auth_routes import refresh_cookie, cookie_expires

api = Blueprint("api", "api_routes", None, url_prefix="/api")

@api.route("/recent/<int:page>/")
def recent(page: int):
    """ Recent documents """
    return "recent news page " + str(page)

@api.route("/auth/")
@auth_token_required
def stuff():
    """ must be authorized """
    refresh = refresh_cookie(request.cookies)
    if not refresh[0]:
        if refresh[1] == "Token expired":
            return make_response(dumps({ "error": refresh[1] }), 401)
    else:
        return make_response(dumps({ "error": "OK" }), 200)
