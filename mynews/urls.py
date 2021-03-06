from django.conf.urls import patterns, include, url
from django.conf.urls.static import static
from django.contrib import admin
from mynews import settings

urlpatterns = patterns('',

    url(r'^$', 'personal_rss.views.home', name='home'),

    url(r'^login/$', 'django.contrib.auth.views.login', name='login'),
    url(r'^logout/$', 'django.contrib.auth.views.logout', name='logout'),
    url(r'^password_reset/$', 'django.contrib.auth.views.password_reset', name='password_reset'),
    url(r'^password_reset/done/$', 'django.contrib.auth.views.password_reset_done', name='password_reset_done'),
    url(r'^reset/(?P<uidb64>[0-9A-Za-z_\-]+)/(?P<token>[0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,20})/$',
        'django.contrib.auth.views.password_reset_confirm', name='password_reset_confirm'),
    url(r'^reset/done/$', 'django.contrib.auth.views.password_reset_complete', name='password_reset_complete'),

    url(r'^register/$', 'personal_rss.views.register', name='register'),
    url(r'^profile/$', 'personal_rss.views.profile', name='profile'),

    url(r'^view_rss/$', 'personal_rss.views.view_rss', name='view_rss'),
    url(r'^add_rss/$', 'personal_rss.views.add_rss', name='add_rss'),
    url(r'^save_article/(?P<vote>\w+)$', 'personal_rss.views.save_article', name='save_article'),

    url(r'^admin/', include(admin.site.urls)),
)

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)