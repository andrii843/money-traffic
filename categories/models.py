from django.db import models
from users.models import User


class Category(models.Model):
    name = models.CharField(max_length=255,)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Category'
        verbose_name_plural = 'Categories'

        ordering = ['name']
