from django.conf.urls import patterns, url

from Toury import views


urlpatterns = patterns('',
    url(r'^$', views.index, name='index'),
)