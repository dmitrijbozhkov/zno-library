""" Logic for api routes """
from app import user_datastore, db
from database.models import Tag, Course
from sqlalchemy import desc, func

def get_tags():
    """ Returns list of all tags """
    return [ tag.dictify() for tag in Tag.query.all() ]

def set_tag(tag_name):
    """ Adds new tag """
    try:
        last_id = db.session.query(func.max(Tag.id)).first()
        id = 1
        if not (last_id[0] == None):
            id = last_id[0] + 1
        addTag = Tag(id=id, name=tag_name)
        db.session.add(addTag)
        db.session.commit()
    except:
        return False
    else:
        return True

def remove_tag(tag_id):
    """ Deletes tag by id """
    try:
        Tag.query.filter(Tag.id == tag_id).delete()
        db.session.commit()
    except:
        return False
    else:
        return True

def get_courses(page_no=0, page_size=5):
    """ Returns list of most recent courses """
    query = Course.query.order_by(desc(Course.postTime)).offset(page_no * page_size).limit(page_size)
    return [ course.dictify() for course in query ]