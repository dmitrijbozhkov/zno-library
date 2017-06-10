""" Defines file routes """
from flask import Blueprint, request, make_response, send_file
from json import dumps
from flask_security import auth_token_required
from auth_module.auth_routes import check_account
from .course_model import generate_course_id
from .route_utils import respond

file_blueprint = Blueprint("file", "file_routes", None, url_prefix="/api/file")

@file_blueprint.route("/icon/", methods=["POST"])
@auth_token_required
def course_post_icon():
    icon = request.get_json()
    auth = check_account(icon, "Teacher")
    if auth[0]:
        pass
    else:
        return auth[1]
