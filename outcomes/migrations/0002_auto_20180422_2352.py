# Generated by Django 2.0.4 on 2018-04-22 20:52

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('outcomes', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='outcome',
            name='save',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='Ssave', to='saves.Save'),
        ),
    ]