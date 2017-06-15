"""Chapter added

Revision ID: 4a9fb109045b
Revises: 3240529865c7
Create Date: 2017-06-11 09:17:50.525457

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '4a9fb109045b'
down_revision = '3240529865c7'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('chapter',
    sa.Column('id', sa.String(length=16), nullable=False),
    sa.Column('name', sa.String(length=200), nullable=False),
    sa.Column('contents', sa.Text(), nullable=False),
    sa.Column('previous', sa.String(length=32), nullable=True),
    sa.Column('next', sa.String(length=32), nullable=True),
    sa.Column('courseId', sa.String(length=32), nullable=False),
    sa.ForeignKeyConstraint(['courseId'], ['public.course.id'], ),
    sa.PrimaryKeyConstraint('id'),
    schema='public'
    )
    op.create_table('chapter_file',
    sa.Column('id', sa.String(length=32), nullable=False),
    sa.Column('path', sa.String(length=100), nullable=False),
    sa.Column('chapterId', sa.String(length=16), nullable=False),
    sa.ForeignKeyConstraint(['chapterId'], ['public.chapter.id'], ),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('path'),
    schema='public'
    )
    op.create_table('chapter_image',
    sa.Column('id', sa.String(length=32), nullable=False),
    sa.Column('path', sa.String(length=100), nullable=False),
    sa.Column('chapterId', sa.String(length=16), nullable=False),
    sa.ForeignKeyConstraint(['chapterId'], ['public.chapter.id'], ),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('path'),
    schema='public'
    )
    op.drop_constraint('course_authorId_fkey', 'course', type_='foreignkey')
    op.create_foreign_key(None, 'course', 'user', ['authorId'], ['id'], source_schema='public', referent_schema='public')
    op.drop_constraint('preface_image_courseId_fkey', 'preface_image', type_='foreignkey')
    op.create_foreign_key(None, 'preface_image', 'course', ['courseId'], ['id'], source_schema='public', referent_schema='public')
    op.drop_constraint('roles_users_role_id_fkey', 'roles_users', type_='foreignkey')
    op.drop_constraint('roles_users_user_id_fkey', 'roles_users', type_='foreignkey')
    op.create_foreign_key(None, 'roles_users', 'role', ['role_id'], ['id'], source_schema='public', referent_schema='public', ondelete='CASCADE')
    op.create_foreign_key(None, 'roles_users', 'user', ['user_id'], ['id'], source_schema='public', referent_schema='public', ondelete='CASCADE')
    op.drop_constraint('tags_courses_tag_id_fkey', 'tags_courses', type_='foreignkey')
    op.drop_constraint('tags_courses_course_id_fkey', 'tags_courses', type_='foreignkey')
    op.create_foreign_key(None, 'tags_courses', 'tag', ['tag_id'], ['id'], source_schema='public', referent_schema='public', ondelete='CASCADE')
    op.create_foreign_key(None, 'tags_courses', 'course', ['course_id'], ['id'], source_schema='public', referent_schema='public', ondelete='CASCADE')
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
    op.drop_constraint(None, 'preface_image', schema='public', type_='foreignkey')
    op.create_foreign_key('preface_image_courseId_fkey', 'preface_image', 'course', ['courseId'], ['id'])
    op.drop_constraint(None, 'course', schema='public', type_='foreignkey')
    op.create_foreign_key('course_authorId_fkey', 'course', 'user', ['authorId'], ['id'])
    op.drop_table('chapter_image', schema='public')
    op.drop_table('chapter_file', schema='public')
    op.drop_table('chapter', schema='public')
    # ### end Alembic commands ###
