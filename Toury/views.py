from django.shortcuts import render, redirect
from django.core.context_processors import csrf
from rest_framework import viewsets
from serializers import *
from Toury import models

def index(request):
    return render(request, 'Toury/index.html', None)

def tours(request):
    return render(request, 'Toury/tours.html', None)

def add_marker(request):

    if request.method != 'POST':
        return;
    else:
        m = models.Marker()
        m.description = request.POST['description']
        m.direction = 0.0
        m.latitude = request.POST['latitude']
        m.longitude = request.POST['longitude']
        m.radius = 5.0;
        m.title = request.POST['title']
        m.save()
        return redirect('/success')

def success(request):
    return render(request, 'Toury/success.html', None)


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer


class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Group.objects.all()
    serializer_class = GroupSerializer

class ToursViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = models.Marker.objects.all()
    serializer_class = ToursSerializer