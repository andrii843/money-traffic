from django.db import models
from users.models import User
<<<<<<< HEAD

class Source(models.Model):
    name = models.CharField(max_length=150)
    user = models.ForeignKey(User, on_delete=models.PROTECT)
    class Meta:
        db_table = 'sources'


=======


class Source(models.Model):
    name = models.CharField(max_length=255,)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['name']
>>>>>>> rest_api
