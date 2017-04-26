""" Defines api routes """
from flask import Blueprint
from json import dumps
from app import db

api = Blueprint("api", "api_routes", None, url_prefix="/api")

@api.route("/recent/<int:page>/")
def recent(page: int):
    """ Recent documents """
    return "recent news page " + str(page)
