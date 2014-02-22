from django.contrib.auth.models import User, Group
from rest_framework import serializers
from Toury import models

class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ('url', 'username', 'email', 'groups')
        lookup_field = 'permissions'


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ('url', 'name')

class ToursSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = models.Marker
        fields = ('id', 'title', 'latitude', 'longitude', 'description', 'direction')