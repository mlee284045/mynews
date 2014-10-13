from django.contrib import admin

# Register your models here.
from personal_rss.models import Reader, Feed, Article


@admin.register(Reader)
class ReaderAdmin(admin.ModelAdmin):
    pass

@admin.register(Feed)
class FeedAdmin(admin.ModelAdmin):
    pass

@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    pass