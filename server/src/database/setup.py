""" Functions to initialize database """
from .models import Role, User, Course, Tag
from flask_security.utils import encrypt_password

def check_add_role(store, id, name):
    """ Checks if role exist and then adds record if it doesn't """
    role = store.find_role(name)
    if role == None:
        return store.create_role(id=id, name=name)
    else:
        return role

def check_delete_user(store, email):
    """ Checks for specific user and deletes it """
    user = store.find_user(email=email)
    if not (user == None):
        store.delete_user(user)

def add_user(store, id, email, password, name, surname, lastName, roles):
    """ Checks if admin exist and then adds record if it doesn't """
    user = store.create_user(id=id, email=email, password=encrypt_password(password), name=name, surname=surname, lastName=lastName)
    for role in roles:
        store.add_role_to_user(user, role)

def fill_roles(datastore, database):
    """ Prepares database """
    admin_role = check_add_role(datastore, 1, "Admin")
    teacher_role = check_add_role(datastore, 2, "Teacher")
    student_role = check_add_role(datastore, 3, "Student")
    check_delete_user(datastore, "mymail@gmail.com")
    check_delete_user(datastore, "bozhkov_d@mail.ru")
    admin = add_user(datastore, 1, "bozhkov_d@mail.ru", "pass1234", "Ivan", "Ivanov", "Ivanovich", [admin_role, teacher_role, student_role])
    database.session.commit()

def emptydb(database):
    Tag.query.delete()
    User.query.delete()
    Course.query.delete()
    Role.query.delete()
    database.session.commit()

def init_db(user_datastore, database, isTest):
    """ Initializes database """
    if isTest:
        emptydb(database)
    fill_roles(user_datastore, database)
