""" Defines api routes """

from flask import Blueprint

api = Blueprint("api", "api_routes", None, url_prefix="/api")
@api.route("/recent/<int:page>/")
def recent(page: int):
    """ Recent documents """
    return "recent news page " + str(page)
