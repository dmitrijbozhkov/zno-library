"""auth

Revision ID: cd454cecb6e8
Revises: 5cbf5ac4455e
Create Date: 2017-04-26 16:41:11.797947

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'cd454cecb6e8'
down_revision = '5cbf5ac4455e'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('role',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=80), nullable=False),
    sa.Column('description', sa.String(length=255), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('name'),
    schema='public'
    )
    op.create_table('user',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('password', sa.String(length=255), nullable=False),
    sa.Column('email', sa.String(length=255), nullable=False),
    sa.Column('active', sa.Boolean(), nullable=True),
    sa.Column('name', sa.String(length=40), nullable=False),
    sa.Column('surname', sa.String(length=40), nullable=False),
    sa.Column('lastName', sa.String(length=40), nullable=False),
    sa.Column('roleId', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['roleId'], ['public.role.id'], ),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email'),
    schema='public'
    )
    op.create_table('course',
    sa.Column('id', sa.String(length=32), nullable=False),
    sa.Column('name', sa.String(length=200), nullable=False),
    sa.Column('contents', sa.Text(), nullable=False),
    sa.Column('preface', sa.Text(), nullable=False),
    sa.Column('postTime', sa.DateTime(), nullable=False),
    sa.Column('authorId', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['authorId'], ['public.user.id'], ),
    sa.PrimaryKeyConstraint('id'),
    schema='public'
    )
    op.create_table('roles_users',
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('role_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['role_id'], ['public.role.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['public.user.id'], ),
    schema='public'
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('roles_users', schema='public')
    op.drop_table('course', schema='public')
    op.drop_table('user', schema='public')
    op.drop_table('role', schema='public')
    # ### end Alembic commands ###