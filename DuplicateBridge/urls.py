from django.conf.urls import patterns, include, url

from django.contrib import admin
admin.autodiscover()

import hello.views
import DuplicateBridge.views

urlpatterns = patterns('',
    url(r'^$', DuplicateBridge.views.index, name='index'),
    #url(r'^hello$', hello.views.index, name='hello'),
    #url(r'^db', hello.views.db, name='db'),
    #url(r'^admin/', include(admin.site.urls)),
)
