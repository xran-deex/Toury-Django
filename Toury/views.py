from django.shortcuts import render, redirect
from django.core.context_processors import csrf
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
from django.core.urlresolvers import reverse
from rest_framework import viewsets
from django.core import serializers
from serializers import MarkerSerializer, TourSerializer
from django.contrib import messages
from Toury import models

def index(request):
    return render(request, 'Toury/index.html', None)

def tours(request):
    tours = models.Tour.objects.all()
    if request.method == 'GET':
        if 'format' in request.GET:
                return HttpResponse(serializers.serialize('json', tours))
    return render(request, 'Toury/tours.html', {'tours': tours})

def new_tour(request):
    newtour = models.Tour()
    newtour.name = request.POST['name']
    newtour.save()
    return redirect('Toury.views.tour', tour_id=newtour.id)

def delete(request, tour_id):
    #if request.method == 'POST':
    tour = models.Tour.objects.get(pk=tour_id)
    tour.delete()
    #else:
    #    messages.add_message(request, messages.ERROR, "Oops! You can't do that")
    return redirect('Toury.views.tours')

def create(request):
    return render(request, 'Toury/create.html', None)

@csrf_exempt
def tour(request, tour_id):
    tour = models.Tour.objects.get(pk=tour_id)

    if request.method == 'GET':
        if 'format' in request.GET:
                return HttpResponse(serializers.serialize('json', tour.markers.all()))

    if request.method == 'POST':
        m = models.Marker()
        m.tour = tour
        m.description = request.POST['description']
        m.trigger_latitude = request.POST['trigger_latitude']
        m.trigger_longitude = request.POST['trigger_longitude']
        m.marker_latitude = request.POST['marker_latitude']
        m.marker_longitude = request.POST['marker_longitude']
        m.radius = request.POST['radius']
        m.title = request.POST['title']
        m.save()
        return redirect('/tour/' + str(tour.id))

    return render(request, 'Toury/tour.html', {'tour': tour})

@csrf_exempt
def marker(request, marker_id):
    m = models.Marker.objects.get(pk=marker_id)
    # print m
    if request.method == 'POST':
        print request.POST
        if 'cancel' in request.POST:
            return redirect('/tour/' + str(m.tour.id))
        if 'delete' in request.POST:
            m.delete()
            return redirect('/tour/' + str(m.tour.id))
        m.description = request.POST['description']
        # m.direction = request.POST['direction']
        m.trigger_latitude = request.POST['trigger_latitude']
        m.trigger_longitude = request.POST['trigger_longitude']
        # if not request.POST['ajax']:
        m.marker_latitude = request.POST['marker_latitude']
        m.marker_longitude = request.POST['marker_longitude']
        m.radius = request.POST['radius']
        m.title = request.POST['title']
        m.save()
        return redirect('/tour/' + str(m.tour.id))
    return render(request, 'Toury/marker.html', {'marker': m})

# def add_marker(request):
#
#     if request.method != 'POST':
#         return
#     else:
#         m = models.Marker()
#         m.description = request.POST['description']
#         m.direction = 0.0
#         m.latitude = request.POST['latitude']
#         m.longitude = request.POST['longitude']
#         m.radius = 5.0;
#         m.title = request.POST['title']
#         m.save()
#         return redirect('/success')

def success(request):
    return render(request, 'Toury/success.html', None)

class ToursViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = models.Tour.objects.all()
    serializer_class = TourSerializer

class MarkerViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = models.Marker.objects.all()
    serializer_class = MarkerSerializer