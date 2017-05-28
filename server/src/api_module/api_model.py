""" Logic for api routes """
from app import user_datastore, db
from database.models import Tag, Course
from sqlalchemy import desc

def get_tags():
    """ Returns list of all tags """
    return [ tag.dictify() for tag in Tag.query.all() ]

def set_tag():
    """ Adds new tag """

def get_courses(page_no=0, page_size=5):
    """ Returns list of most recent courses """
    query = Course.query.order_by(desc(Course.postTime)).offset(page_no * page_size).limit(page_size)
    return [ course.dictify() for course in query ]