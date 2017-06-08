""" Defines api routes """
from flask import Blueprint, request, make_response
from json import dumps
from app import db
from flask_security import auth_token_required, roles_required
from .api_model import get_tags, get_courses, set_tag, remove_tag
from auth_module.auth_model import user_has_role

api = Blueprint("api", "api_routes", None, url_prefix="/api")

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

@api.route("/recent/<int:page>/")
def recent(page: int):
    """ Recent documents """
    return "recent news page " + str(page)

@api.route("/tags/", methods=["GET"])
def tags():
    """ Course tags """
    tags = get_tags()
    if tags[0]:
        return make_response(dumps({ "tags": tags[1] }), 200)
    else:
        return make_response(dumps({ "error": tags[1] }), 400)

@api.route("/tags/add/", methods=["POST"])
@auth_token_required
def add_tag():
    """ Adds tag """
    tag = request.get_json()
    auth = check_account(tag, "Teacher")
    if auth[0]:
        try:
            insert = set_tag(tag["tagname"])
        except KeyError as err:
            return make_response(dumps({ "error": "No tagname field" }), 400)
        else:
            if insert[0]:
                return make_response(dumps({ "OK": True }), 200)
            else:
                return make_response(dumps({ "error": insert[1] }), 500)
    else:
        return auth[1]

@api.route("/tags/delete/", methods=["DELETE"])
@auth_token_required
def delete_tag():
    """ Deletes tag """
    tag = request.get_json()
    auth = check_account(tag, "Teacher")
    if auth[0]:
        try:
            delete = remove_tag(tag["tagid"])
        except KeyError as err:
            return make_response(dumps({ "error": "No tagid field" }), 400)
        else:
            if delete[0]:
                return make_response(dumps({ "OK": True }), 200)
            else:
                return make_response(dumps({ "error": delete[1] }), 500)
    else:
        return auth[1]

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
