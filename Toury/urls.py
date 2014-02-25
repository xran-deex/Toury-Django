from django.conf.urls import patterns, url

from Toury import views


urlpatterns = patterns('',
    url(r'^$', views.index, name='index'),
    url(r'^tours$', views.tours, name='tours'),
    url(r'^marker/(?P<marker_id>\d+)/$', views.marker, name='marker'),
    url(r'^tour/(?P<tour_id>\d+)/delete/', views.delete, name='delete_tour'),
    url(r'^tour/create', views.create, name='create'),
    url(r'^tour/new/', views.new_tour, name='new_tour'),
    url(r'^tour/(?P<tour_id>\d+)/$', views.tour, name='tour'),
    url(r'^add', views.add_marker, name='add_marker'),
    url(r'^success', views.success),
)