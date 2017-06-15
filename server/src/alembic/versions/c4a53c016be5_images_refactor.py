"""Images refactor

Revision ID: c4a53c016be5
Revises: 7994ed91877b
Create Date: 2017-06-13 21:21:21.122855

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'c4a53c016be5'
down_revision = '7994ed91877b'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('image',
    sa.Column('id', sa.String(length=32), nullable=False),
    sa.Column('path', sa.String(length=200), nullable=False),
    sa.Column('courseId', sa.String(length=32), nullable=True),
    sa.Column('chapterId', sa.String(length=16), nullable=True),
    sa.ForeignKeyConstraint(['chapterId'], ['public.chapter.id'], ),
    sa.ForeignKeyConstraint(['courseId'], ['public.course.id'], ),
    sa.PrimaryKeyConstraint('id'),
    schema='public'
    )
    op.drop_table('preface_image')
    op.drop_table('chapter_image')
    op.drop_constraint('chapter_courseId_fkey', 'chapter', type_='foreignkey')
    op.create_foreign_key(None, 'chapter', 'course', ['courseId'], ['id'], source_schema='public', referent_schema='public', ondelete='CASCADE')
    op.drop_constraint('chapter_file_chapterId_fkey', 'chapter_file', type_='foreignkey')
    op.create_foreign_key(None, 'chapter_file', 'chapter', ['chapterId'], ['id'], source_schema='public', referent_schema='public')
    op.drop_constraint('course_authorId_fkey', 'course', type_='foreignkey')
    op.create_foreign_key(None, 'course', 'user', ['authorId'], ['id'], source_schema='public', referent_schema='public')
    op.drop_constraint('roles_users_role_id_fkey', 'roles_users', type_='foreignkey')
    op.drop_constraint('roles_users_user_id_fkey', 'roles_users', type_='foreignkey')
    op.create_foreign_key(None, 'roles_users', 'role', ['role_id'], ['id'], source_schema='public', referent_schema='public', ondelete='CASCADE')
    op.create_foreign_key(None, 'roles_users', 'user', ['user_id'], ['id'], source_schema='public', referent_schema='public', ondelete='CASCADE')
    op.drop_constraint('tags_courses_tag_id_fkey', 'tags_courses', type_='foreignkey')
    op.drop_constraint('tags_courses_course_id_fkey', 'tags_courses', type_='foreignkey')
    op.create_foreign_key(None, 'tags_courses', 'course', ['course_id'], ['id'], source_schema='public', referent_schema='public', ondelete='CASCADE')
    op.create_foreign_key(None, 'tags_courses', 'tag', ['tag_id'], ['id'], source_schema='public', referent_schema='public', ondelete='CASCADE')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'tags_courses', schema='public', type_='foreignkey')
    op.drop_constraint(None, 'tags_courses', schema='public', type_='foreignkey')
    op.create_foreign_key('tags_courses_course_id_fkey', 'tags_courses', 'course', ['course_id'], ['id'], ondelete='CASCADE')
    op.create_foreign_key('tags_courses_tag_id_fkey', 'tags_courses', 'tag', ['tag_id'], ['id'], ondelete='CASCADE')
    op.drop_constraint(None, 'roles_users', schema='public', type_='foreignkey')
    op.drop_constraint(None, 'roles_users', schema='public', type_='foreignkey')
    op.create_foreign_key('roles_users_user_id_fkey', 'roles_users', 'user', ['user_id'], ['id'], ondelete='CASCADE')
    op.create_foreign_key('roles_users_role_id_fkey', 'roles_users', 'role', ['role_id'], ['id'], ondelete='CASCADE')
    op.drop_constraint(None, 'course', schema='public', type_='foreignkey')
    op.create_foreign_key('course_authorId_fkey', 'course', 'user', ['authorId'], ['id'])
    op.drop_constraint(None, 'chapter_file', schema='public', type_='foreignkey')
    op.create_foreign_key('chapter_file_chapterId_fkey', 'chapter_file', 'chapter', ['chapterId'], ['id'])
    op.drop_constraint(None, 'chapter', schema='public', type_='foreignkey')
    op.create_foreign_key('chapter_courseId_fkey', 'chapter', 'course', ['courseId'], ['id'], ondelete='CASCADE')
    op.create_table('chapter_image',
    sa.Column('id', sa.VARCHAR(length=32), autoincrement=False, nullable=False),
    sa.Column('path', sa.VARCHAR(length=100), autoincrement=False, nullable=False),
    sa.Column('chapterId', sa.VARCHAR(length=16), autoincrement=False, nullable=False),
    sa.ForeignKeyConstraint(['chapterId'], ['chapter.id'], name='chapter_image_chapterId_fkey'),
    sa.PrimaryKeyConstraint('id', name='chapter_image_pkey'),
    sa.UniqueConstraint('path', name='chapter_image_path_key')
    )
    op.create_table('preface_image',
    sa.Column('id', sa.VARCHAR(length=32), autoincrement=False, nullable=False),
    sa.Column('path', sa.VARCHAR(length=200), autoincrement=False, nullable=False),
    sa.Column('courseId', sa.VARCHAR(length=32), autoincrement=False, nullable=False),
    sa.ForeignKeyConstraint(['courseId'], ['course.id'], name='preface_image_courseId_fkey'),
    sa.PrimaryKeyConstraint('id', name='preface_image_pkey')
    )
    op.drop_table('image', schema='public')
    # ### end Alembic commands ###
