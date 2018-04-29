from django.shortcuts import render
from django.views.generic.edit import FormView
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.forms import AuthenticationForm
from .models import Profile
from .forms import ProfileForm
from .forms import UserForm
from .forms import CustomUserCreationForm
from django.contrib.auth.decorators import login_required
from django.db import transaction, connection
from django.db.models import Sum
from django.contrib import messages
from django.utils.translation import ugettext as _
from django.shortcuts import redirect
from django.http import JsonResponse
from django.contrib.auth import authenticate, login, logout
from users.models import User
from categories.models import Category
from sources.models import Source
from saves.models import Save
from incomes.models import Income
from outcomes.models import Outcome
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

def total_saves(request):
    if request.user.is_authenticated:
        user = request.user
        total_budget = Save.objects.filter(user=user).aggregate(Sum("summa"))
        #.values_list('summa_')
        print(total_budget)
        return JsonResponse({"sum":total_budget['summa__sum']},safe=False)
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

def add_income(request):
    if request.method == 'POST':
        body = request.body.decode("utf-8")
        request.POST = json.loads(body)

        user_id = request.POST['user_id']
        save_id = request.POST['save_id']
        source_id = request.POST['source_id']
        summa = request.POST['summa']
        notes = request.POST['notes']

        user = User.objects.get(id=user_id)
        source = Source.objects.get(id=source_id)
        fsave = Save.objects.get(id=save_id)

        Income.objects.create(user=user, notes=notes, source=source, fsave=fsave, summa=summa)
    return JsonResponse({},safe=False)    


def show_incomes(request):
    if request.user.is_authenticated:
        user = request.user

        incomes = list(Income.objects.filter(user=user).values())
        return JsonResponse(incomes, safe=False)

    return JsonResponse({},safe=False)


def dictfetchall(cursor):
    "Returns all rows from a cursor as a dict"
    desc = cursor.description
    return [
        dict(zip([col[0] for col in desc], row))
        for row in cursor.fetchall()
    ]    

def show_history(request):
    if request.user.is_authenticated:
        user = request.user

        cursor = connection.cursor()
        sql1='select incomes.id, DATE_FORMAT(created_at,"%d-%m-%Y %H:%i") as opdate,summa,"incomes" as type, ' \
        'CONVERT(sources.name USING utf8) as source, incomes.source_id , "" as category,0 as category_id, notes, ' \
        'u.username, incomes.user_id from incomes ' \
        'inner join sources on sources.id = incomes.source_id ' \
        'inner join users_user as u on u.id = incomes.user_id ' \
        'where incomes.user_id = {} '.format(user.id)


        cursor.execute(sql1)

        res=dictfetchall(cursor)
        
        sql2 ='select outcomes.id, DATE_FORMAT(outcomes.created_at, "%d-%m-%Y %H:%i") as opdate, outcomes.summa, "expenses" as type, ' \
        ' "" as source, 0 as source_id, c.name as category, outcomes.category_id,outcomes.notes, u.username, outcomes.user_id  from outcomes ' \
        'inner join categories as c on outcomes.category_id = c.id ' \
        'inner join users_user as u on u.id = outcomes.user_id ' \
        'where outcomes.user_id = {} '.format(user.id)

        cursor.execute(sql2)

        res2=dictfetchall(cursor)
        return JsonResponse(res+res2, safe=False)
    

    return JsonResponse({},safe=False)

def show_outcomes(request):
    if request.user.is_authenticated:
        user = request.user

        outcomes = list(Outcome.objects.filter(user=user).values())
        return JsonResponse(outcomes, safe=False)

    return JsonResponse({},safe=False)


def add_outcome(request):
    if request.method == 'POST':
        body = request.body.decode("utf-8")
        request.POST = json.loads(body)

        user_id = request.POST['user_id']
        save_id = request.POST['save_id']
        category_id = request.POST['category_id']
        summa = request.POST['summa']
        notes = request.POST['notes']

        user = User.objects.get(id=user_id)
        category = Category.objects.get(id=category_id)
        fsave = Save.objects.get(id=save_id)

        Outcome.objects.create(user=user, notes=notes, category=category, fsave=fsave, summa=summa)
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