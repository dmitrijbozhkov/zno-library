from flask import Blueprint, request, make_response
from json import dumps
from flask_security import auth_token_required
from auth_module.auth_routes import check_account
from .course_model import generate_course_id
from .route_utils import respond

chapter_blueprint = Blueprint("chapter", "chapter_routes", None, url_prefix="/api/chapter")

