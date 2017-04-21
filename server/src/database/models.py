""" Database model """
import random
import string
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Column, Integer, String, BigInteger, ForeignKey, Text, Boolean
from sqlalchemy.orm import relationship

db = SQLAlchemy()

def generate_string(letter_number):
    """ Generates random string """
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=letter_number))

# Users

class Users(db.Model):
    """ Describes table of users """
    __tablename__ = "Users"
    UserId = Column(String(32), primary_key=True)
    Name = Column(String(40), nullable=False)
    Surname = Column(String(40), nullable=False)
    LastName = Column(String(40), nullable=False)
    RoleId = Column(Integer, ForeignKey("Roles.RoleId"), nullable=False)
    Role = relationship("Roles", back_populates="Users")
    Courses = relationship("Courses", back_populates="Users")
    ReadChapters = relationship("UserChapterRead", back_populates="Users")
    Marks = relationship("UsersCourseTests", back_populates="Users")
    ChapterComments = relationship("CourseChapterComments", back_populates="Users")

class Roles(db.Model):
    """ Describes table of roles """
    __tablename__ = "Roles"
    RoleId = Column(Integer, primary_key=True)
    Name = Column(String(40), unique=True, nullable=False)
    Users = relationship("Users", back_populates="Roles")

# Courses

class Courses(db.Model):
    """ Describes table of courses """
    __tablename__ = "Courses"
    CourseId = Column(String(32), primary_key=True)
    Name = Column(String(200), nullable=False)
    Contents = Column(Text, nullable=False)
    Preface = Column(Text, nullable=False)
    AuthorId = Column(String(32), ForeignKey("Users.UserId"), nullable=False)
    Author = relationship("Users", back_populates="Courses")
    Tags = relationship("CoursesTagsXRef", back_populates="Courses")
    ReadUsers = relationship("UserChapterRead", back_populates="Courses")
    Chapters = relationship("CourseChapters", back_populates="Courses")
    Tests = relationship("CourseTests", back_populates="Courses")

class UsersCoursesStatus(db.Model):
    """ Describes table of courses that user have taken """
    __tablename__ = "UsersCoursesStatus"
    UserId = Column(String(32), ForeignKey("Users.UserId"), primary_key=True)
    CourseId = Column(String(32), ForeignKey("Courses.CourseId"), primary_key=True)
    StatusId = Column(Integer, ForeignKey("CourseStatuses.CourseStatusId"), nullable=False)
    Status = relationship("CourseStatuses", back_populates="UsersCoursesStatus")

class CourseStatuses(db.Model):
    """ Describes table of user course progression """
    __tablename__ = "CourseStatuses"
    CourseStatusId = Column(Integer, primary_key=True)
    Name = Column(String(40), nullable=False)
    Courses = relationship("UsersCoursesStatus", back_populates="CourseStatuses")

class Tags(db.Model):
    """ Describes table of course tags """
    __tablename__ = "Tags"
    TagId = Column(Integer, primary_key=True)
    Name = Column(String(40), nullable=False)
    Courses = relationship("CoursesTagsXRef", back_populates="Tags")

class CoursesTagsXRef(db.Model):
    """ Describes table of relations between courses and tags """
    __tablename__ = "CoursesTagsXRef"
    CourseId = Column(String(32), ForeignKey("Courses.CourseId"), primary_key=True)
    TagId = Column(Integer, ForeignKey("Tags.TagId"), primary_key=True)
    Courses = relationship("Courses", back_populates="CoursesTagsXRef")
    Tags = relationship("Tags", back_populates="CoursesTagsXRef")

# Chapters

class CourseChapters(db.Model):
    """ Describes table of chapters in course """
    __tablename__ = "CourseChapters"
    CourseChapterId = Column(String(32), primary_key=True)
    Content = Column(Text, nullable=False)
    Images = Column(Boolean, nullable=False)
    Files = Column(Boolean, nullable=False),
    CourseId = Column(String(32), ForeignKey("Courses.CourseId"), nullable=False)
    CourseFiles = relationship("CourseChapterFiles", back_populates="CourseChapters")
    CourseImages = relationship("CourseChapterImages", back_populates="CourseChapters")
    Chapters = relationship("Chapters", back_populates="CourseChapters"),
    Comments = relationship("CourseChapterComments", back_populates="CourseChapters")

class UserChapterRead(db.Model):
    """ Describes table of chapter that user read """
    __tablename__ = "UserChapterRead"
    UserId = Column(String(32), ForeignKey("Users.UserId"), primary_key=True)
    CourseChapterId = Column(
        String(32),
        ForeignKey("CourseChapters.CourseChapterId"),
        primary_key=True)
    Users = relationship("Users", back_populates="UserChapterRead")
    Courses = relationship("Courses", back_populates="UserChapterRead")

class CourseChapterFiles(db.Model):
    """ Describes table of files appended to chapters """
    __tablename__ = "CourseChapterFiles"
    CourseChapterFileId = Column(String(32), primary_key=True)
    Name = Column(String, nullable=False)
    CourseChapterId = Column(String(32), ForeignKey("CourseChapters.CourseChapterId"))
    CourseChapters = relationship("CourseChapters", back_populates="CourseChapterFiles")

class CourseChapterImages(db.Model):
    """ Describes table of images in chapters """
    __tablename__ = "CourseChapterImages"
    CourseChapterImageId = Column(String(32), primary_key=True)
    Name = Column(String, nullable=False)
    CourseChapterId = Column(String(32), ForeignKey("CourseChapters.CourseChapterId"))
    CourseChapters = relationship("CourseChapters", back_populates="CourseChapterImages")

class CourseChapterComments(db.Model):
    """ Describes comment on cchapter """
    __tablename__ = "CourseChapterComments"
    CourseChapterCommentId = Column(BigInteger, primary_key=True)
    Contents = Column(Text, nullable=False)
    Images = Column(Boolean, nullable=False)
    UserId = Column(String(32), ForeignKey("Users.UserId"), nullable=False)
    CourseChapterId = Column(
        String(32),
        ForeignKey("CourseChapters.CourseChapterId"),
        nullable=False)
    Users = relationship("Users", back_populates="CourseChapterComments")
    CourseChapters = relationship(
        "CourseChapters.CourseChapterId",
        back_populates="CourseChapterComments")
    CommentImages = relationship(
        "CourseChapterCommentImages",
        back_populates="CourseChapterComments")

class CourseChapterCommentImages(db.Model):
    """ Describes comment images """
    __tablename__ = "CourseChapterCommentImages"
    CourseChapterCommentImageId = Column(String(32), primary_key=True)
    Name = Column(String, nullable=False)
    CourseChapterCommentId = Column(
        BigInteger,
        ForeignKey("CourseChapterComments.CourseChapterCommentId"),
        nullable=False)
    CourseChapterComments = relationship(
        "CourseChapterComments",
        back_populates="CourseChapterCommentImages")

# Tests

class CourseTests(db.Model):
    """ Describes table of tests in courses """
    __tablename__ = "CourseTests"
    CourseTestId = Column(String(32), primary_key=True)
    Questions = Column(Text, nullable=False)
    Images = Column(Boolean, nullable=False)
    Files = Column(Boolean, nullable=False)
    CourseId = Column(String(32), ForeignKey("Courses.CourseId"), nullable=False)
    Marks = relationship("UsersCourseTests", back_populates="CourseTests")
    Courses = relationship("Courses", back_populates="CourseTests")
    Answers = relationship("CourseAnswers", back_populates="CourseTests")
    TestImages = relationship("CourseTestImages", back_populates="CourseTests")

class UsersCourseTests(db.Model):
    """ Describes table of user marks """
    __tablename__ = "UsersCourseTest"
    UserId = Column(String(32), ForeignKey("Users.UserId"), primary_key=True)
    CourseTestId = Column(String(32), ForeignKey("CourseTests.CourseTestId"), primary_key=True)
    Mark = Column(Integer, nullable=False)
    Users = relationship("Users", back_populates="UsersCourseTests")
    CourseTests = relationship("CourseTests", back_populates="UsersCourseTests")

class CourseAnswers(db.Model):
    """ Describes table of answer keys to tests """
    __tablename__ = "CourseAnswers"
    CourseAnswerId = Column(String(32), ForeignKey("CourseTests.CourseTestId"), primary_key=True)
    AnswerKeys = Column(Text, nullable=False)
    CourseTests = relationship("CourseTests", back_populates="CourseAnswers")

class CourseTestImages(db.Model):
    """ Describes table of images for tests """
    __tablename__ = "CourseTestImages"
    CourseTestImageId = Column(String(32), primary_key=True)
    Name = Column(String, nullable=False)
    CourseTestId = Column(String(32), ForeignKey("CourseTests.CourseTestId"), nullable=False)
    Tests = relationship("CourseTests", back_populates="CourseTestImages")

class CourseTestFiles(db.Model):
    """ Describes table of files for tests """
    __tablename__ = "CourseTestFiles"
    CourseTestFileId = Column(String(32), primary_key=True)
    Name = Column(String, nullable=False)
    CourseTestId = Column(String(32), ForeignKey("CourseTests.CourseTestId"), nullable=False)
    Tests = relationship("CourseTests", back_populates="CourseTestFiles")
