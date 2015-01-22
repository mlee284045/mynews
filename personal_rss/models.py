from django.contrib.auth.models import AbstractUser
from django.db import models

# Create your models here.
class Reader(AbstractUser):
    profile = models.ImageField(upload_to='profile_pics', null=True)

    def __unicode__(self):
        return u"{}".format(self.username)


class Feed(models.Model):
    feed_url = models.URLField()
    reader = models.ForeignKey(Reader, related_name='feeds')

    def __unicode__(self):
        return u"{}".format(self.feed_url)


# class Word(models.Model):
#     text = models.CharField(max_length=30)

class Article(models.Model):
    url = models.URLField()
    vote = models.BooleanField(default=True)

    def __unicode__(self):
        return u"{}".format(self.url)