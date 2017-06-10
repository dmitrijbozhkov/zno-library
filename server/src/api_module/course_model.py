""" Logic for course routes """
from app import user_datastore, db
from database.models import Course
from auth_module.auth_model import find_email
from sqlalchemy import desc, func
from .utils import generate_id

# Course.query.filter(Course.name.ilike("name"))

def find_course(id):
    """ Finds course by id """
    return Course.query.filter(Course.id == id).first()

def check_add_data(data):
    """ Checks passed data for adding course """
    try:
        if data["id"] == None:
            return (False, "id is empty")
        if data["name"] == None:
            return (False, "name is empty")
        if data["postTime"] == None:
            return (False, "postTime is empty")
        if data["email"] == None:
            return (False, "author is empty")
    except KeyError as error:
        return (False, "No " + error.args[0] + " field")
    else:
        return (True, "OK")

def check_add_contents(data):
    """ Checks passed data for adding contents to course """
    try:
        if data["id"] == None:
            return (False, "id is empty")
        if data["contents"] == None:
            return (False, "contents is empty")
    except KeyError as error:
        return (False, "No " + error.args[0] + " field")
    else:
        return (True, "OK")

def check_add_description(data):
    """ Checks passed data for adding description to course """
    try:
        if data["id"] == None:
            return (False, "id is empty")
        if data["description"] == None:
            return (False, "description is empty")
    except KeyError as error:
        return (False, "No " + error.args[0] + " field")
    else:
        return (True, "OK")

def check_name(data):
    """ Checks if course name was already taken """
    try:
        if data["name"] == None:
            return (False, "name is empty")
        record = Course.query.filter(Course.name == data["name"]).first()
        if record == None:
            return (True, "OK")
    except KeyError as error:
        return (False, "No " + error.args[0] + " field")
    except Exception as err:
        return (False, "Error occured")
    else:
        return (False, "Name is already taken")

def check_preface(data):
    """ Checks passed data for adding preface """
    try:
        if data["id"] == None:
            return (False, "id is empty")
        if data["preface"] == None:
            return (False, "preface is empty")
    except KeyError as error:
        return (False, "No " + error.args[0] + " field")
    else:
        return (True, "OK")

def add_preface(data):
    """ Adds preface to course """
    try:
        record = find_course(data["id"])
        if record == None:
            return ({ "error": "No course found" }, 400)
        record.preface = data["preface"]
        db.session.commit()
    except Exception as error:
        return ({ "error": "Error occured" }, 500)
    else:
        return ({ "OK": True }, 200)

def add_description(data):
    """ Adds description to course """
    try:
        record = find_course(data["id"])
        if record == None:
            return ({ "error": "No course found" }, 400)
        record.description = data["description"]
        db.session.commit()
    except Exception as error:
        return ({ "error": "Error occured" }, 500)
    else:
        return ({ "OK": True }, 200)

def add_contents(data):
    """ Adds contents contents to course """
    try:
        course = find_course(data["id"])
        if course == None:
            return ({ "error": "No course found" }, 400)
        course.contents = data["contents"]
        db.session.commit()
    except Exception as err:
        return ({ "error": "Error occured" }, 500)
    else:
        return ({ "OK": True }, 200)

def add_course(data):
    """ Adds new course to database """
    try:
        author = find_email(data["email"])
        if author == None:
            return ({ "error": "No author found" }, 400)
        course = Course(id=data["id"], name=data["name"], postTime=data["postTime"], author=author)
        db.session.add(course)
        db.session.commit()
    except Exception as err:
        print(err)
        return ({ "error": "Error occured" }, 500)
    else:
        return ({ "OK": True }, 200)

def generate_course_id(data):
    """ Generates unique id with 16 symbols """
    try:
        while True:
            id = generate_id(16)
            record = find_course(id)
            if record == None:
                return ({ "id": id }, 200)
    except Exception as error:
        return ({ "error": "Error occured" }, 500)

def get_courses(page_no=0, page_size=5):
    """ Returns list of most recent courses """
    query = Course.query.order_by(desc(Course.postTime)).offset(page_no * page_size).limit(page_size)
    return [ course.dictify() for course in query ]
