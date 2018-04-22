from django.db import models
from users.models import User


class Save(models.Model):
    name = models.CharField(max_length=255)
    sum = models.FloatField()
    date = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Save'
        verbose_name_plural = 'Saves'
        ordering = ['name']
