# Generated by Django 3.0.2 on 2020-02-13 13:32

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('tracks', '0003_like'),
    ]

    operations = [
        migrations.AlterField(
            model_name='like',
            name='track',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='likes', to='tracks.Track'),
        ),
    ]