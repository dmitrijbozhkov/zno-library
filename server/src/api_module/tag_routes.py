""" Defines tag routes """
from flask import Blueprint, request, make_response
from json import dumps
from app import db
from flask_security import auth_token_required, roles_required
from .tag_model import get_tags, set_tag, remove_tag
from auth_module.auth_routes import check_account
from .route_utils import respond

tags_blueprint = Blueprint("tags", "tags_routes", None, url_prefix="/api/tags")

@tags_blueprint.route("/", methods=["GET"])
def tags():
    """ Course tags """
    tags = get_tags()
    if tags[0]:
        return make_response(dumps({ "tags": tags[1] }), 200)
    else:
        return make_response(dumps({ "error": tags[1] }), 400)

@tags_blueprint.route("/add/", methods=["POST"])
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

@tags_blueprint.route("/delete/", methods=["DELETE"])
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
