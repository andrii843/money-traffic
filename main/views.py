from django.shortcuts import render
from django.views.generic.edit import FormView
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth import login
from django.contrib.auth import logout
from .forms import CustomUserCreationForm

# Create your views here.
def main_page(request):
    user = request.user
    return render(request, 'money/main_page.html', {'user': user})



class RegisterFormView(FormView):
    form_class = CustomUserCreationForm

    success_url = "/login/"

    template_name = "money/register.html"

    def form_valid(self, form):
        form.save()

        return super(RegisterFormView, self).form_valid(form)
    
class LoginFormView(FormView):
    form_class = AuthenticationForm

    template_name = "money/login.html"

    success_url = "/"

    def form_valid(self, form):
        self.user = form.get_user()

        login(self.request, self.user)
        return super(LoginFormView, self).form_valid(form)