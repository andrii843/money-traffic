from categories import views
from django.urls import path

urlpatterns = [
    path('categories/', views.get_list, name='categories_list',),
    path('categories/<int:id>', views.simple_category, name='category_simple',),
]