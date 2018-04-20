from django.shortcuts import render
from django.views.generic.edit import FormView
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.forms import AuthenticationForm
from .models import Profile
from .forms import ProfileForm
from .forms import UserForm
from django.contrib.auth import login
from django.contrib.auth import logout
from .forms import CustomUserCreationForm
from django.contrib.auth.decorators import login_required
from django.db import transaction
from django.contrib import messages
from django.utils.translation import ugettext as _
from django.shortcuts import redirect

# Create your views here.
def main_page(request):
    user = request.user
    return render(request, 'main/index-page.html', {'user': user})

def user_detail(request):
    user = request.user
    return render(request, 'users/user_detail.html', {'user': user})


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