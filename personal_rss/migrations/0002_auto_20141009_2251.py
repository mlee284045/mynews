# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('personal_rss', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='reader',
            name='profile',
            field=models.ImageField(null=True, upload_to=b'profile_pics'),
        ),
    ]
