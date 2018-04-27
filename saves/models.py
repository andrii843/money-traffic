from django.db import models
from users.models import User


class Save(models.Model):
    name = models.CharField(max_length=150)
    summa = models.DecimalField(max_digits=15, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.PROTECT)

    def __str__(self):
        return self.name

    class Meta:
        db_table = 'saves'
        ordering = ['name']
