""" Defines file routes """
from flask import Blueprint, request, make_response, send_from_directory
from json import dumps
from flask_security import auth_token_required
from auth_module.auth_routes import check_account
from .file_model import check_upload_file, check_upload_image
from .route_utils import respond_form

COURSE_ICON_FOLDER = "../../static/icons/"
CHAPTER_IMAGE_FOLDER = "../../static/images/"
CHAPTER_FILE_FOLDER = "../../static/files/"

file_blueprint = Blueprint("file", "file_routes", None, url_prefix="/api/file")

@file_blueprint.route("/icon/<name>", methods=["GET"])
def get_course_icon(name):
    return send_from_directory(COURSE_ICON_FOLDER, name)

@file_blueprint.route("/image/<name>", methods=["GET"])
def get_chapter_image(name):
    return send_from_directory(CHAPTER_IMAGE_FOLDER, name)

@file_blueprint.route("/file/<name>", methods=["GET"])
@auth_token_required
def get_chapter_file(name):
    return send_from_directory(CHAPTER_FILE_FOLDER, name)

@file_blueprint.route("/icon/", methods=["POST"])
@auth_token_required
def course_post_icon():
    auth = check_account(request.form, "Teacher")
    if auth[0]:
        return respond_form(request.form, request.files, check_upload_image, )
    else:
        return auth[1]

@file_blueprint.route("/image/", methods=["POST"])
@auth_token_required
def chapter_post_image():
    image = request.get_json()
    auth = check_account(image, "Teacher")
    if auth[0]:
        pass
    else:
        return auth[1]

@file_blueprint.route("/file/", methods=["POST"])
@auth_token_required
def chapter_post_file():
    file = request.get_json()
    auth = check_account(file, "Teacher")
    if auth[0]:
        pass
    else:
        return auth[1]

def course_delete_icon():
    icon = request.get_json()
    auth = check_account(icon, "Teacher")
    if auth[0]:
        pass
    else:
        return auth[1]