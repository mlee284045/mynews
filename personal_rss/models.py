from django.contrib.auth.models import AbstractUser
from django.db import models

# Create your models here.
class Reader(AbstractUser):
    profile = models.ImageField(upload_to='profile_pics', null=True)


class Feed(models.Model):
    feed_url = models.URLField()
    reader = models.ForeignKey(Reader, related_name='feeds')