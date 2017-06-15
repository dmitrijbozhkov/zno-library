from flask import Blueprint, request, make_response
from json import dumps
from flask_security import auth_token_required
from auth_module.auth_routes import check_account
from .chapter_model import check_add_chapter, create_chapter, find_chapter, check_patch_chapter, patch_chapter, check_delete_chapter, delete_chapter
from .route_utils import respond

chapter_blueprint = Blueprint("chapter", "chapter_routes", None, url_prefix="/api/chapter")

@chapter_blueprint.route("/<id>/", methods=["GET"])
@auth_token_required
def get_chapter(id):
    """ Returns chapter by passed id """
    chapter = find_chapter(id)
    if chapter == None:
        return make_response(dumps({ "error": "No such chapter" }), 200)
    else:
        return make_response(dumps(chapter.dictify()), 200)

@chapter_blueprint.route("/add/", methods=["POST"])
@auth_token_required
def add_chapter():
    """ Adds new chapter """
    chapter = request.get_json()
    auth = check_account(chapter, "Teacher")
    if auth[0]:
        return respond(chapter, check_add_chapter, create_chapter)
    else:
        return auth[1]

@chapter_blueprint.route("/patch/", methods=["POST"])
@auth_token_required
def insert_chapter():
    """ Patches existing list of chapters """
    chapter = request.get_json()
    auth = check_account(chapter, "Teacher")
    if auth[0]:
        return respond(chapter, check_patch_chapter, patch_chapter)
    else:
        return auth[1]

@chapter_blueprint.route("/delete/", methods=["DELETE"])
@auth_token_required
def remove_chapter():
    """ Deletes chapter from course """
    chapter = request.get_json()
    auth = check_account(chapter, "Teacher")
    if auth[0]:
        return respond(chapter, check_delete_chapter, delete_chapter)
    else:
        return auth[1]