from django.db import models

from users.models import User
from sources.models import Source
from saves.models import Save


class Income(models.Model):
    sum = models.FloatField()
    note = models.TextField(null=True)
    date = models.DateTimeField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    source = models.ForeignKey(Source, on_delete=models.CASCADE)
    by_save = models.ForeignKey(Save, on_delete=models.CASCADE)

    class Meta:
        verbose_name = 'Income'
        verbose_name_plural = 'Incomes'
