from django.conf.urls import patterns, include, url
from django.contrib import admin
from django.contrib.auth.models import User, Group
from rest_framework import viewsets, routers
from Toury.models import Marker, Tour

# ViewSets define the view behavior.
class UserViewSet(viewsets.ModelViewSet):
    model = User

class GroupViewSet(viewsets.ModelViewSet):
    model = Group

class TourViewSet(viewsets.ModelViewSet):
    model = Tour

class MarkerViewSet(viewsets.ModelViewSet):
    model = Marker


# Routers provide an easy way of automatically determining the URL conf.
router = routers.DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'groups', GroupViewSet)
router.register(r'tours', TourViewSet)
router.register(r'markers', MarkerViewSet)

admin.autodiscover()

urlpatterns = patterns('',
    url(r'^', include('Toury.urls')),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    url(r'^api/', include(router.urls)),
)
