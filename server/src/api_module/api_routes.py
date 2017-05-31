""" Defines api routes """
from flask import Blueprint, request, make_response
from json import dumps
from app import db
from flask_security import auth_token_required, roles_required
from .api_model import get_tags, get_courses, set_tag, remove_tag

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

@api.route("/tags/add/", methods=["POST"])
def add_tag():
    """ Adds tag """
    tag = request.get_json()
    try:
        insert = set_tag(tag["tagname"])
    except KeyError as err:
        return make_response(dumps({ "error": "No tagname field" }), 400)
    else:
        if insert:
            return make_response(dumps({ "OK": True }), 200)
        else:
            return make_response(dumps({ "error": "Error occured" }), 500)

@api.route("/tags/delete/", methods=["DELETE"])
def delete_tag():
    """ Deletes tag """
    tag = request.get_json()
    try:
        delete = remove_tag(tag["tagid"])
    except KeyError as err:
        return make_response(dumps({ "error": "No tagid field" }), 400)
    else:
        if delete:
            return make_response(dumps({ "OK": True }), 200)
        else:
            return make_response(dumps({ "error": "Error occured" }), 500)

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
