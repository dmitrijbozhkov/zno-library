""" Logic for course routes """
from app import user_datastore, db
from database.models import Course
import os

IMAGE_FORMATS = [ ".jpg", ".jpeg", ".png", ".gif", ".svg" ]

def find_course(id):
    """ Finds course by id """
    return Course.query.get(str(id))

def allowed_file(filename, extensions):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in extensions

def check_upload_file(data, files):
    """ Checks if file uploaded """
    if not files:
        return (False, "No files uploaded")
    else:
        return (True, "OK")

def check_upload_image(data, files):
    """ Checks uploaded image before saving """
    upload = check_upload_file(data, files)
    if upload[0]:
        try:
            if not allowed_file(files[0][0], IMAGE_FORMATS):
                return (False, "File is not an image")
            if data["id"] == None:
                return (False, "id is empty")
        except KeyError as error:
            return (False, "No " + error.args[0] + " field")
    else:
        return upload

def generate_file_id(data):
    """ Generates unique id with 16 symbols """
    try:
        while True:
            id = generate_id(16)
            record = find_course(id)
            if record == None:
                return ({ "id": id }, 200)
    except Exception as error:
        return ({ "error": "Error occured" }, 500)

def generate_image_id(data):
    """ Generates unique id with 16 symbols """
    try:
        while True:
            id = generate_id(16)
            record = find_course(id)
            if record == None:
                return ({ "id": id }, 200)
    except Exception as error:
        return ({ "error": "Error occured" }, 500)

def upload_icon(data, files):
    """ Uploads image and adds it to course """
    try:
        course = find_course(data["id"])
        if course == None:
            return ({ "error": "No course found" }, 200)
        
    except Exception as error:
        return ({ "error": "Error occured" }, 500)
    else:
        return ({ "OK": True }, 200)