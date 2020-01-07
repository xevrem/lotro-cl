from django.shortcuts import render
from django.http import HttpResponse, JsonResponse

import json

from .deeds import get_all_deeds


# Create your views here.
def index(request):
    return HttpResponse("Hello world")


def deeds_get(request):
    data = get_all_deeds()
    return JsonResponse(data, safe=False)
    # return web.Response(body=deeds, content_type='application/json')


def characters_get(request):
    with open('data/characters.json', mode='rb') as f:
        data = f.read()
        obj = json.loads(data)

        return JsonResponse(obj, safe=False)
