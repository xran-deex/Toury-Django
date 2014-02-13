from django.shortcuts import render

def index(request):
    return render(request, 'Toury/index.html', None)
