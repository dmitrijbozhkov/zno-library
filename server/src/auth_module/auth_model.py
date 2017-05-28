""" Logic for auth routes """
from flask_security.utils import encrypt_password, verify_password
from sqlalchemy import func
import re
from app import user_datastore, db
from database.models import User

class CredentialsChecker(object):
    """ Checks user credentials """
    def __init__(self, email_regex="[^@]+@[^@]+\.[^@]+", pass_regex="^([0-9]|[a-z]|[A-Z]){8,16}", initials_regex="^([а-яА-Я]|[a-zA-Z]){2,40}"):
        self.email_regex = re.compile(email_regex)
        self.pass_regex = re.compile(pass_regex)
        self.initials_regex = re.compile(initials_regex)

    def create_check(self, initials):
        """ Checks credentials foruser creation """
        try:
            if self.email_check(initials["email"]) == None:
                return (False, "Email is incorrect")
            if self.pass_check(initials["password"]) == None:
                return (False, "Password is incorrect")
            if self.initials_check(initials["name"]) == None:
                return (False, "Name is incorrect")
            if self.initials_check(initials["surname"]) == None:
                return (False, "Surname is incorrect")
            if self.initials_check(initials["lastName"]) == None:
                return (False, "Last name is incorrect")
        except KeyError as e:
            return (False, "No " + e.args[0] + " field")
        else:
            return (True, "OK")

    def log_in_check(self, credentials):
        """ Checks log in credentials """
        try:
            if self.email_check(credentials["email"]) == None:
                return (False, "Email is incorrect")
            if self.pass_check(credentials["password"]) == None:
                return (False, "Password is incorrect")
        except KeyError as e:
            return (False, "No " + e.args[0] + " field")
        else:
            return (True, "OK")

    def email_check(self, email):
        """ Checks user email """
        return self.email_regex.match(email)

    def pass_check(self, password):
        """ Checks user password """
        return self.pass_regex.match(password)

    def initials_check(self, initial):
        """ Checks user initials """
        return self.initials_regex.match(initial)

def find_email(email):
    """ Finds user by email """
    return user_datastore.find_user(email=email)

def add_user(credentials):
    """ Adds user to the database """
    if find_email(credentials["email"]) == None:
        last_id = db.session.query(func.max(User.id)).first()
        id = 1
        if not (last_id[0] == None):
            id = last_id[0] + 1
        encrypted_pass = encrypt_password(credentials["password"])
        user = user_datastore.create_user(
            id=id,
            email=credentials["email"],
            password=encrypted_pass,
            name=credentials["name"],
            surname=credentials["surname"],
            lastName=credentials["lastName"]),
        student_role = user_datastore.find_role("Student")
        user_datastore.add_role_to_user(user[0], student_role)
        db.session.commit()
        return (True, "OK")
    else:
        return (False, "Email was already used")

def log_in_credentials(credentials):
    """ Finds user and returns json token """
    user = find_email(credentials["email"])
    if user == None:
        return (False, "Password or email is wrong")
    else:
        verification = verify_password(credentials["password"], user.password)
        if verification:
            return (True, user.get_auth_token(), user.dictify())
        else:
            return (False, "Password or email is wrong")
