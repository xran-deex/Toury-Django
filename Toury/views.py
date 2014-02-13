from django.shortcuts import render

def index(request):
    return render(request, 'Toury/index.html', None)

def tours(request):
    return render(request, 'Toury/tours.html', None)
