""" Defines course routes """
from flask import Blueprint, request, make_response
from json import dumps
from flask_security import auth_token_required
from .course_model import get_courses, check_name, check_add_data, add_course, check_add_contents, add_contents, check_add_description, add_description, check_preface, add_preface
from auth_module.auth_routes import check_account
from .course_model import generate_course_id
from .route_utils import respond

course_blueprint = Blueprint("course", "course_routes", None, url_prefix="/api/course")

@course_blueprint.route("/")
@course_blueprint.route("/<int:page>/", methods=["GET"])
@auth_token_required
def get_courses(page=0):
    """ Returns most recent courses """
    courses = get_courses(page)
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

@course_blueprint.route("/add/contents/", methods=["POST"])
@auth_token_required
def course_contents():
    """ Adds content to course """
    content = request.get_json()
    auth = check_account(content, "Teacher")
    if auth[0]:
        return respond(content, check_add_contents, add_contents)
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
