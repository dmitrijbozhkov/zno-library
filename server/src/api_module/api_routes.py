""" Defines api routes """
from flask import Blueprint, request, make_response
from json import dumps
from app import db
from flask_security import auth_token_required, roles_required

api = Blueprint("api", "api_routes", None, url_prefix="/api")

@api.route("/recent/<int:page>/")
def recent(page: int):
    """ Recent documents """
    return "recent news page " + str(page)

@api.route("/auth/")
@auth_token_required
def stuff():
    """ must be authorized """
    return make_response(dumps({ "error": "OK" }), 200)
