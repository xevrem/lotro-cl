from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('deeds', views.deeds_get, name='deeds'),
    path('characters', views.characters_get, name='characters')
]
