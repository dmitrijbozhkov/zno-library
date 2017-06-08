""" Database model """
import datetime
import hashlib
from flask_security import UserMixin
from sqlalchemy.ext.declarative import declarative_base
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Integer, String, BigInteger, ForeignKey, Text, Boolean, DateTime, Column, MetaData, Table
from sqlalchemy.orm import relationship

Base = declarative_base(metadata=MetaData(schema="public"))

db = SQLAlchemy()     

roles_users = Table("roles_users", Base.metadata,
    Column("user_id", Integer, ForeignKey("user.id", ondelete="CASCADE")),
    Column("role_id", Integer, ForeignKey("role.id", ondelete="CASCADE"))
)

tags_courses = Table("tags_courses", Base.metadata,
    Column("tag_id", Integer, ForeignKey("tag.id", ondelete="CASCADE")),
    Column("course_id", String(32), ForeignKey("course.id", ondelete="CASCADE"))
)

class User(Base, UserMixin):
    """ Describes table of users """
    __tablename__ = "user"
    query = db.session.query_property()
    def dictify(self):
        """ Turns model to dictionary """
        dictionary = {
            "userId": self.id,
            "name": self.name,
            "surname": self.surname,
            "lastName": self.lastName,
            "email": self.email,
            "roles": [role.name for role in self.roles]
        }
        return dictionary
    def dictify_author(self):
        """ Turns model as author into dictionary """
        dictionary = {
            "name": self.name,
            "surname": self.surname,
            "lastName": self.lastName,
            "email": self.email
        }
        return dictionary
    id = Column(Integer, primary_key=True)
    password = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False, unique=True)
    active = Column(Boolean)
    name = Column(String(40), nullable=False)
    surname = Column(String(40), nullable=False)
    lastName = Column(String(40), nullable=False)
    roles = relationship("Role", back_populates="users", secondary=roles_users)
    courses = relationship("Course", back_populates="author")
    # ReadChapters = relationship("UserChapterRead", back_populates="Users")
    # Marks = relationship("UsersCourseTests", back_populates="Users")
    # ChapterComments = relationship("CourseChapterComments", back_populates="Users")

class Role(Base):
    """ Describes table of roles """
    __tablename__ = "role"
    query = db.session.query_property()
    def dictify(self):
        """ Turns model to dictionary """
        dictionary = {
            "roleId": self.id,
            "name": self.name
        }
        return dictionary
    id = Column(Integer, primary_key=True)
    name = Column(String(80), unique=True, nullable=False)
    description = Column(String(255))
    users = relationship("User", back_populates="roles", secondary=roles_users)

# Courses

class Course(Base):
    """ Describes table of courses """
    __tablename__ = "course"
    query = db.session.query_property()
    def dictify(self):
        """ Turns model into dictionary """
        dictionary = {
            "courseId": self.id,
            "name": self.name,
            "contents": self.contents,
            "postTime": self.postTime,
            "autor": self.author.dictify_author(),
            "description": self.description,
            "icon": self.icon,
            "rev": self.rev,
            "tags": [ tag.dictify() for tag in self.tags ]
        }
        return dictionary
    def dictify_preface(self):
        """ Turns preface into dictionary """
        dictionary = {
            "preface": self.preface,
            "preface_images": [ image.dictify() for image in self.preface_images ]
        }
        return dictionary
    id = Column(String(32), primary_key=True)
    name = Column(String(200), nullable=False)
    contents = Column(Text, nullable=False)
    postTime = Column(DateTime, nullable=False)
    description = Column(Text, nullable=False)
    preface = Column(Text, nullable=False)
    icon = Column(String(200))
    rev = Column(Integer, nullable=False)
    authorId = Column(Integer, ForeignKey("user.id"), nullable=False)
    author = relationship("User", back_populates="courses")
    preface_images = relationship("PrefaceImage", back_populates="course")
    tags = relationship("Tag", back_populates="courses", secondary=tags_courses)
    # ReadUsers = relationship("UserChapterRead", back_populates="Courses")
    # Chapters = relationship("CourseChapters", back_populates="Courses")
    # Tests = relationship("CourseTests", back_populates="Courses")

class PrefaceImage(Base):
    """ Describes table of preface images """
    __tablename__ = "preface_image"
    query = db.session.query_property()
    def dictify(self):
        """ Turns model into dictionary """
        dictionary = {
            "id": self.id,
            "path": self.path
        }
        return dictionary
    id = Column(String(32), primary_key=True)
    path = Column(String(200), nullable=False)
    courseId = Column(String(32), ForeignKey("course.id"), nullable=False)
    course = relationship("Course", back_populates="preface_images")

class Tag(Base):
    """ Describes table of course tags """
    __tablename__ = "tag"
    query = db.session.query_property()
    def dictify(self):
        """ Turns model into dictionary """
        dictionary = {
            "id": self.id,
            "name": self.name
        }
        return dictionary
    id = Column(Integer, primary_key=True)
    name = Column(String(40), nullable=False, unique=True)
    courses = relationship("Course", back_populates="tags", secondary=tags_courses)