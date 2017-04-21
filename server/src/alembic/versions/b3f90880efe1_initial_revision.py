"""initial revision

Revision ID: b3f90880efe1
Revises: 
Create Date: 2017-04-21 10:34:21.397926

"""
from alembic import op
import sqlalchemy as sa
from database.models import db


# revision identifiers, used by Alembic.
revision = 'b3f90880efe1'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    pass # db.metadata.create_all()


def downgrade():
    db.metadata.drop_table("Users")
    db.metadata.drop_table("Roles")
