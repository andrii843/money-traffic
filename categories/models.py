from django.db import models
from users.models import User


class Category(models.Model):
    name = models.CharField(max_length=150)
    user = models.ForeignKey(User, on_delete=models.PROTECT)

    def __str__(self):
        return self.name

    class Meta:
        db_table = 'categories'
        ordering = ['name']
