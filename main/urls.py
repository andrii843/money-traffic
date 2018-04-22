from . import views
from django.urls import include, path

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
]