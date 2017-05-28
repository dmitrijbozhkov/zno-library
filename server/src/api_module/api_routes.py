""" Defines api routes """
from flask import Blueprint, request, make_response
from json import dumps
from app import db
from flask_security import auth_token_required, roles_required
from .api_model import get_tags, get_courses

api = Blueprint("api", "api_routes", None, url_prefix="/api")

@api.route("/recent/<int:page>/")
def recent(page: int):
    """ Recent documents """
    return "recent news page " + str(page)

@api.route("/tags/", methods=["GET"])
def tags():
    """ Course tags """
    tags = get_tags()
    return make_response(dumps({ "tags": tags }), 200)

@api.route("/courses/")
@api.route("/courses/<int:page>/", methods=["GET"])
def recent_courses(page=0):
    """ Returns most recent courses """
    courses = get_courses(page)
    return make_response(dumps({ "courses": courses }), 200)

@api.route("/auth/")
@auth_token_required
def stuff():
    """ must be authorized """
    return make_response(dumps({ "error": "OK" }), 200)
