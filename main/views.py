from django.shortcuts import render
from django.views.generic.edit import FormView
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.forms import AuthenticationForm
from .models import Profile
from .forms import ProfileForm
from .forms import UserForm
from .forms import CustomUserCreationForm
from django.contrib.auth.decorators import login_required
from django.db import transaction
from django.contrib import messages
from django.utils.translation import ugettext as _
from django.shortcuts import redirect
from django.http import JsonResponse
from django.contrib.auth import authenticate, login, logout
from users.models import User
from categories.models import Category
from sources.models import Source
from saves.models import Save
from django.core import serializers
import json


# Create your views here.
def main_page(request):
    user = request.user
    return render(request, 'main/index-page.html', {'user': user})

def user_detail(request):
    user = request.user
    return render(request, 'users/user_detail.html', {'user': user})

def json_user_info(request):
    return JsonResponse({'is_auth':request.user.is_authenticated, 'username':request.user.username, 'id':request.user.id}, safe=False)


def login_user(request):
    ''' Проводимо авторизацію користувача на сайті '''
    if request.method == 'POST':
        body = request.body.decode("utf-8")
        request.POST = json.loads(body)

        username = request.POST['login']
        passwd = request.POST['password']

        user = authenticate(request, username=username, password=passwd)
        if user is not None:
            login(request, user)
            return JsonResponse({"user":request.user.id},safe=False)
    return JsonResponse({},safe=False)

def add_category(request):
    if request.method == 'POST':
        body = request.body.decode("utf-8")
        request.POST = json.loads(body)

        category_name = request.POST['name']
        user_id = request.POST['user_id']

        user = User.objects.get(id=user_id)

        category = Category.objects.filter(user=user, name=category_name)

        if category.count() == 0: # Категорія не знайдена
            Category.objects.create(user=user, name=category_name)

    return JsonResponse({},safe=False)

def show_categories(request):
    if request.user.is_authenticated:
        user = request.user
        categories = list(Category.objects.filter(user=user).values())
        return JsonResponse(categories,safe=False)
    return JsonResponse({},safe=False)


def add_source(request):
    if request.method == 'POST':
        body = request.body.decode("utf-8")
        request.POST = json.loads(body)

        source_name = request.POST['name']
        user_id = request.POST['user_id']

        user = User.objects.get(id=user_id)
        source = Source.objects.filter(user=user, name=source_name)

        if source.count() == 0:
            Source.objects.create(user=user, name=source_name)

    return JsonResponse({},safe=False)   


def show_sources(request):
    if request.user.is_authenticated:
        user = request.user
        sources = list(Source.objects.filter(user=user).values())
        return JsonResponse(sources,safe=False)
    return JsonResponse({},safe=False)


def add_save(request):
    if request.method == 'POST':
        body = request.body.decode("utf-8")
        request.POST = json.loads(body)

        save_name = request.POST['name']
        summa = request.POST['summa']
        user_id = request.POST['user_id']

        user = User.objects.get(id=user_id)
        save = Save.objects.filter(user=user, name=save_name)

        if save.count() == 0:
            Save.objects.create(user=user, name=save_name, summa=summa)

    return JsonResponse({},safe=False)

def show_saves(request):
    if request.user.is_authenticated:
        user = request.user
        saves = list(Save.objects.filter(user=user).values())
        return JsonResponse(saves,safe=False)
    return JsonResponse({},safe=False)


def logout_user(request):
    ''' Вихід з профілю корисувача '''
    logout(request)
    return JsonResponse({},safe=False)

def register_user(request):
    if request.method == 'POST':
        body = request.body.decode("utf-8")
        request.POST = json.loads(body)

        username = request.POST['login']
        passwd = request.POST['password']
        email = request.POST['email']

        user = User.objects.create_user(username=username, email=email, password=passwd)
        user.save()

        ''' Після реєстрації проводимо авторизацію користувача '''
        # user = authenticate(request, username=username, password=passwd)
        if user is not None:
            login(request, user)
            return JsonResponse({"user":request.user.id},safe=False)        


    return JsonResponse({},safe=False)


class RegisterFormView(FormView):
    form_class = CustomUserCreationForm

    success_url = "/login/"

    template_name = "money/register.html"

    def form_valid(self, form):
        form.save()

        return super(RegisterFormView, self).form_valid(form)
    
class LoginFormView(FormView):
    form_class = AuthenticationForm

    # template_name = "money/login.html"
    template_name = "main/login-page.html"

    success_url = "/"

    def form_valid(self, form):
        self.user = form.get_user()

        login(self.request, self.user)
        return super(LoginFormView, self).form_valid(form)
    
    
@login_required
@transaction.atomic
def update_profile(request):
    if request.method == 'POST':
        user_form = UserForm(request.POST, instance=request.user)
        profile_form = ProfileForm(request.POST, instance=request.user.profile)
        if user_form.is_valid() and profile_form.is_valid():
            user_form.save()
            profile_form.save()
            messages.success(request, _('Your profile was successfully updated!'))
            return redirect('user_detail')
        else:
            messages.error(request, _('Please correct the error below.'))
    else:
        user_form = UserForm(instance=request.user)
        profile_form = ProfileForm(instance=request.user.profile)
    return render(request, 'users/profile.html', {
        'user_form': user_form,
        'profile_form': profile_form
    })     