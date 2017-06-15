""" Defines course routes """
from flask import Blueprint, request, make_response
from json import dumps
from flask_security import auth_token_required
from .course_model import page_courses, check_name, check_add_data, add_course, check_add_description, add_description, check_preface, add_preface, check_delete, delete_course, check_set_tags, set_tags, get_chapters
from auth_module.auth_routes import check_account
from .course_model import generate_course_id
from .route_utils import respond

course_blueprint = Blueprint("course", "course_routes", None, url_prefix="/api/course")

@course_blueprint.route("/")
@course_blueprint.route("/<int:page>/", methods=["GET"])
def get_courses(page=0):
    """ Returns most recent courses """
    courses = page_courses(page)
    return make_response(dumps({ "courses": courses }), 200)

@course_blueprint.route("/add/", methods=["POST"])
@auth_token_required
def add_courses():
    """ Adds new course """
    course = request.get_json()
    auth = check_account(course, "Teacher")
    if auth[0]:
        return respond(course, check_add_data, add_course)
    else:
        return auth[1]

@course_blueprint.route("/delete/", methods=["DELETE"])
@auth_token_required
def course_delete():
    """ Deletes course by id """
    course = request.get_json()
    auth = check_account(course, "Teacher")
    if auth[0]:
        return respond(course, check_delete, delete_course)
    else:
        return auth[1]

@course_blueprint.route("/add/description/", methods=["POST"])
@auth_token_required
def course_description():
    """ Adds description to course """
    description = request.get_json()
    auth = check_account(description, "Teacher")
    if auth[0]:
        return respond(description, check_add_description, add_description)
    else:
        return auth[1]

@course_blueprint.route("/add/preface/", methods=["POST"])
@auth_token_required
def course_preface():
    """ Adds preface to course """
    preface = request.get_json()
    auth = check_account(preface, "Teacher")
    if auth[0]:
        return respond(preface, check_preface, add_preface)
    else:
        return auth[1]

@course_blueprint.route("/tags/", methods=["POST"])
@auth_token_required
def course_set_tags():
    """ Sets tags to course """
    tags = request.get_json()
    auth = check_account(tags, "Teacher")
    if auth[0]:
        return respond(tags, check_set_tags, set_tags)
    else:
        return auth[1]

@course_blueprint.route("/check/", methods=["POST"])
@auth_token_required
def check_course():
    """ Checks if course name is valid """
    name = request.get_json()
    auth = check_account(name, "Teacher")
    if auth[0]:
        return respond(name, check_name, generate_course_id)
    else:
        return auth[1]

@course_blueprint.route("/chapters/<id>/")
@auth_token_required
def get_course_chapters(id):
    """ Returns course chapters """
    chapters = get_chapters(id)
    if chapters == False:
        return make_response(dumps({ "error": "No course found" }), 200)
    return make_response(dumps(chapters), 200)