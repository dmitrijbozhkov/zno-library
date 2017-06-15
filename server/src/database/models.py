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
    users = relationship("User", back_populates="roles", secondary=roles_users)

# Courses

class Course(Base):
    """ Describes table of courses """
    __tablename__ = "course"
    query = db.session.query_property()
    def dictify(self):
        """ Turns model into dictionary """
        dictionary = {
            "id": self.id,
            "name": self.name,
            "postTime": str(self.postTime),
            "autor": self.author.dictify_author(),
            "description": self.description,
            "icon": self.icon,
            "tags": [ tag.dictify() for tag in self.tags ]
        }
        return dictionary
    def dictify_preface(self):
        """ Turns preface into dictionary """
        dictionary = {
            "preface": self.preface,
            "preface_images": [ image.path for image in self.preface_images ]
        }
        return dictionary
    def dictify_chapters(self):
        """ Truns course chapters """
        dictionary = {
            "chapters": [ chapter.dictify_index() for chapter in self.chapters ]
        }
        return dictionary
    id = Column(String(16), primary_key=True)
    name = Column(String(200), nullable=False)
    postTime = Column(DateTime, nullable=False)
    description = Column(Text, nullable=True)
    preface = Column(Text, nullable=True)
    icon = Column(String(200))
    version = Column(Integer, nullable=False)
    authorId = Column(Integer, ForeignKey("user.id"), nullable=False)
    author = relationship("User", back_populates="courses")
    preface_images = relationship("Image", back_populates="course")
    tags = relationship("Tag", back_populates="courses", secondary=tags_courses)
    chapters = relationship("Chapter", back_populates="course")

class Image(Base):
    """ Describes table of preface images """
    __tablename__ = "image"
    query = db.session.query_property()
    id = Column(String(32), primary_key=True)
    path = Column(String(200), nullable=False)
    courseId = Column(String(32), ForeignKey("course.id"), nullable=True)
    chapterId = Column(String(16), ForeignKey("chapter.id"), nullable=True)
    course = relationship("Course", back_populates="preface_images")
    chapter = relationship("Chapter", back_populates="images")

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

# Chapters

class Chapter(Base):
    """ Describes table of course chapters """
    __tablename__ = "chapter"
    query = db.session.query_property()
    def dictify(self):
        """ Turns model into dictionary """
        dictionary = {
            "id": self.id,
            "name": self.name,
            "contents": self.contents,
            "course": self.course.id,
            "images": [ image.path for image in self.images ],
            "files": [ file.path for file in self.files ],
            "previous": self.previous,
            "next": self.next
        }
        return dictionary
    def dictify_index(self):
        """ Turns model into index """
        dictionary = {
            "id": self.id,
            "name": self.name
        }
        return dictionary
    id = Column(String(16), primary_key=True)
    name = Column(String(200), nullable=False)
    contents = Column(Text, nullable=False)
    previous = Column(String(32), nullable=True)
    next = Column(String(32), nullable=True)
    version = Column(Integer, nullable=False)
    courseId = Column(String(32), ForeignKey("course.id", ondelete="CASCADE"), nullable=False)
    course = relationship("Course", back_populates="chapters")
    images = relationship("Image", back_populates="chapter")
    files = relationship("ChapterFile", back_populates="chapter")

class ChapterFile(Base):
    """ Describes tables of chapter files """
    __tablename__ = "chapter_file"
    query = db.session.query_property()
    id = Column(String(32), primary_key=True)
    path = Column(String(100), nullable=False, unique=True)
    chapterId = Column(String(16), ForeignKey("chapter.id"), nullable=False)
    chapter = relationship("Chapter", back_populates="files")