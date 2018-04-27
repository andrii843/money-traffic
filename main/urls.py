from . import views
from django.urls import include, path

from categories.views import get_list

urlpatterns = [
    path('', views.main_page, name='main_page'),
    # path('register/', views.RegisterFormView.as_view(), name='register_in'),
    # path('login/', views.LoginFormView.as_view(), name='login_in'),

    path('user/', views.user_detail, name='user_detail'),
    path('profile/', views.update_profile, name='update_profile'),

    
    path('api/login/', views.login_user, name='login_in'),
    path('api/logout/', views.logout_user, name='logout_user'),
    path('api/user/', views.json_user_info, name='json_user_detail'),
    path('api/register/', views.register_user, name='register_user'),
    

    path('api/category/add/', get_list, name='add_category'),
    # path('api/category/add/', views.add_category, name='add_category'),
    # path('api/categories/', views.show_categories, name='show_categories'),
    path('api/categories/', get_list, name='show_categories'),

    path('api/source/add/', views.add_source, name='add_source'),
    path('api/sources/', views.show_sources, name='show_sources'),

    path('api/save/add/', views.add_save, name='add_save'),
    path('api/saves/', views.show_saves, name='show_saves'),




]