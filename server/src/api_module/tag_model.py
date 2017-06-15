""" Logic for tag routes """
from app import user_datastore, db
from database.models import Tag, Course
from sqlalchemy import desc, func

def get_tags():
    """ Returns list of all tags """
    try:
        return (True, [ tag.dictify() for tag in Tag.query.all() ])
    except:
        return (False, "Error occured")

def find_tag_id(id):
    """ Finds tag by id """
    return Tag.query.filter(Tag.id == id)

def find_tag_name(name):
    """ Finds tag by name """
    return Tag.query.filter(Tag.name == name)

def set_tag(tag_name):
    """ Adds new tag """
    tag = find_tag_name(tag_name).first()
    id = 1
    if tag == None:
        try:
            last_id = db.session.query(func.max(Tag.id)).first()
            if not (last_id[0] == None):
                id = last_id[0] + 1
            addTag = Tag(id=id, name=tag_name)
            db.session.add(addTag)
            db.session.commit()
        except:
            return (False, "Error occured")
        else:
            return (True, id)
    else:
        return (False, "Tag already exists")

def remove_tag(tag_id):
    """ Deletes tag by id """
    tag = find_tag_id(tag_id)
    if tag.first() == None:
        return (False, "No such tag")
    else:
        try:
            tag.delete()
            db.session.commit()
        except:
            return (False, "Error occured")
        else:
            return (True, "OK")
