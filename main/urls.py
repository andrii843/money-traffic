from . import views
from django.urls import include, path

urlpatterns = [
    path('', views.main_page, name='main_page'),
    path('register/', views.RegisterFormView.as_view(), name='register_in'),
    path('login/', views.LoginFormView.as_view(), name='login_in'),
]