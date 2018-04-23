from django.db import models

from users.models import User
from categories.models import Category
from saves.models import Save


class Outcome(models.Model):
    sum = models.FloatField()
    note = models.TextField(null=True)
    date = models.DateTimeField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    by_save = models.ForeignKey(Save, on_delete=models.CASCADE, related_name='saves', related_query_name='save',)

    class Meta:
        verbose_name = 'Outcome'
        verbose_name_plural = 'Outcomes'
