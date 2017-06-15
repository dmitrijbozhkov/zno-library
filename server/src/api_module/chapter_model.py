""" Logic for chapter routes """
from app import user_datastore, db
from database.models import Chapter, Course
from .utils import generate_id

def check_add_chapter(data):
    """ Checks passed data for adding chapter """
    try:
        if data["name"] == None:
            return (False, "name is empty")
        if data["contents"] == None:
            return (False, "contents is empty")
        if data["course"] == None:
            return (False, "course is empty")
        if "previous" not in data.keys():
            return (False, "No previous field")
    except KeyError as error:
        return (False, "No " + error.args[0] + " field")
    else:
        return (True, "OK")

def check_patch_chapter(data):
    """ Checks passed data for patching chapters """
    try:
        if data["name"] == None:
            return (False, "name is empty")
        if data["contents"] == None:
            return (False, "contents is empty")
        if data["course"] == None:
            return (False, "course is empty")
        if "previous" not in data.keys():
            return (False, "No previous field")
        if "next" not in data.keys():
            return (False, "No next field")
    except KeyError as error:
        return (False, "No " + error.args[0] + " field")
    else:
        return (True, "OK")

def check_delete_chapter(data):
    """ Checks passed data for deleting chapter """
    try:
        if data["id"] == None:
            return (False, "id is empty")
    except KeyError as error:
        return (False, "No " + error.args[0] + " field")
    else:
        return (True, "OK")

def find_first(courseId):
    """ Finds first chapter in course """
    return Chapter.query.filter(Chapter.previous == None, Chapter.courseId == courseId).first()

def find_last(courseId):
    """ Finds last chapter in course """
    return Chapter.query.filter(Chapter.next == None, Chapter.courseId == courseId).first()

def find_course(id):
    """ Finds course by id """
    return Course.query.get(id)

def generate_chapter_id():
    """ Generates unique id with 16 symbols """
    while True:
        id = generate_id(16)
        record = find_chapter(id)
        if record == None:
            return id

def find_chapter(id):
    """ Returns chapter by id """
    return Chapter.query.get(id)

def create_chapter_head(data):
    """ Creates starting chapter """
    course = find_course(data["course"])
    if course == None:
        return ({ "error": "No course found" }, 200)
    chapterId = generate_chapter_id()
    chapter = Chapter(id=chapterId, name=data["name"], contents=data["contents"], previous=None, course=course, next=None)
    db.session.add(chapter)
    db.session.commit()
    return ({ "id": chapterId }, 200)

def create_chapter_tail(data, sibling):
    """ Creates last chapter """
    course = find_course(data["course"])
    if course == None:
        return ({ "error": "No course found" }, 200)
    chapterId = generate_chapter_id()
    chapter = Chapter(id=chapterId, name=data["name"], contents=data["contents"], previous=sibling.id, course=course, next=None)
    db.session.add(chapter)
    sibling.next = chapter.id
    db.session.commit()
    return ({ "id": chapterId }, 200)

def create_chapter(data):
    """ Adds new chapter """
    try:
        if data["previous"] == None:
            start = find_first(data["course"])
            if start != None:
                return ({ "error": "Course already has starting chapter" }, 200)
            else:
                return create_chapter_head(data)
        else:
            sibling = find_chapter(data["previous"])
            if sibling == None:
                return ({ "error": "No previous chapter found" }, 200)
            else:
                return create_chapter_tail(data, sibling)
    except Exception as error:
        return ({ "error": "Error occured" }, 500)

def patch_head_chapter(data, start):
    """ Inserts first chapter """
    course = find_course(data["course"])
    if course == None:
        return ({ "error": "No course found" }, 200)
    chapterId = generate_chapter_id()
    chapter = Chapter(id=chapterId, name=data["name"], contents=data["contents"], previous=None, course=course, next=start.id)
    db.session.add(chapter)
    start.previous = chapter.id
    db.session.commit()
    return ({ "id": chapterId }, 200)

def patch_middle_chapter(data, previous, next):
    """ Inserts middle chapter """
    course = find_course(data["course"])
    if course == None:
        return ({ "error": "No course found" }, 200)
    chapterId = generate_chapter_id()
    chapter = Chapter(id=chapterId, name=data["name"], contents=data["contents"], previous=previous.id, course=course, next=next.id)
    db.session.add(chapter)
    next.previous = chapter.id
    previous.next = chapter.id
    db.session.commit()
    return ({ "id": chapterId }, 200)

def patch_chapter(data):
    """ Inserts chapter into course """
    try:
        if (data["previous"] == None) and (data["next"] == None):
            return ({ "error": "Either previous or next should not be empty" }, 400)
        elif data["previous"] == None:
            start = find_first(data["course"])
            if start == None:
                return ({ "error": "Course is empty" }, 200)
            else:
                return patch_head_chapter(data, start)
        elif data["next"] == None:
            end = find_last(data["course"])
            if end == None:
                return ({ "error": "Course is empty" }, 200)
            else:
                return create_chapter_tail(data, end)
        else:
            previous = find_chapter(data["previous"])
            if previous == None:
                return ({ "error": "No previous chapter found" }, 200)
            next = find_chapter(data["next"])
            if next == None:
                return ({ "error": "No next chapter found" }, 200)
            return patch_middle_chapter(data, previous, next)
    except Exception as error:
        return ({ "error": "Error occured" }, 500)

def patch_delete_chapter(chapter):
    """ Reorders list of chapters before deletion """
    if (chapter.previous != None) and (chapter.next != None): # connect chapters in between
        chapter.previous.next = chapter.next
        chapter.next.previous = chapter.previous
    elif chapter.previous != None: # make previous chapter tail
        chapter.previous.next = None
    elif chapter.next != None: # make next chapter head
        chapter.next.previous = None

def delete_chapter(data):
    """ Deletes chapter from course """
    try:
        chapter = find_chapter(data["id"])
        patch_delete_chapter(chapter)
        db.session.delete(chapter)
        db.session.commit()
        return ({ "OK": True }, 200)
    except Exception as error:
        print(error)
        return ({ "error": "Error occured" }, 500)