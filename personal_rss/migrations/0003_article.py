# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('personal_rss', '0002_auto_20141009_2251'),
    ]

    operations = [
        migrations.CreateModel(
            name='Article',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('url', models.URLField()),
                ('content', models.TextField()),
                ('feed', models.ForeignKey(related_name=b'articles', to='personal_rss.Feed')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
    ]
