from django.shortcuts import render, redirect
from personal_rss.forms import ReaderCreationForm


def home(request):
    return render(request, 'home.html')


def register(request):
    if request.method == 'POST':
        form = ReaderCreationForm(request.POST)
        if form.is_valid():
            form.save()
        return redirect('home')
    else:
        form = ReaderCreationForm()
    return render(request, 'registration/register.html', {'form': form})


def profile(request):
    return render(request, 'profile.html')