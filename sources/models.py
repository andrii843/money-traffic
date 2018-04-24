from django.db import models
from users.models import User

class Source(models.Model):
    name = models.CharField(max_length=150)
    user = models.ForeignKey(User, on_delete=models.PROTECT)
    class Meta:
        db_table = 'sources'


