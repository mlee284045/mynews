import json
from django.core import serializers
from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from personal_rss.forms import ReaderCreationForm
from personal_rss.models import Reader, Feed, Article


def home(request):
    print "At home"
    return render(request, 'home.html')


def register(request):
    if request.method == 'POST':
        form = ReaderCreationForm(request.POST)
        if form.is_valid():
            form.save()
            current_user = authenticate(username=form.cleaned_data['username'], password=form.cleaned_data['password1'])
            login(request, current_user)
        return redirect('home')
    else:
        form = ReaderCreationForm()
    return render(request, 'registration/register.html', {'form': form})

@login_required
def profile(request):
    name = request.user.username
    reader = Reader.objects.get(username=name)
    if not reader.profile:
        reader.profile = 'static/img/test_tube.png'
    data = {
        'user': reader
    }
    return render(request, 'profile.html')


# def get_rss_urls(request):
#     feedUrl = request.user.feeds.all()
#
#     return

@login_required
def view_rss(request):
    feed_url = request.user.feeds.all()
    all_urls = []
    for url in feed_url:
        all_urls.append({
            'feed_url': url.feed_url
        })
    return HttpResponse(json.dumps(all_urls), content_type='application/json')

@login_required
def add_rss(request):
    print "At add_rss"
    if request.method == 'POST':
        data = json.loads(request.body)
        newFeed = Feed.objects.create(
            reader=request.user,
            feed_url=data,
        )
        response = serializers.serialize('json', [newFeed])
        print response
    return HttpResponse(response, content_type='application/json')

@login_required
def save_article(request, vote):
    articles = []
    if vote == 'up':
        upVote = True
    else:
        upVote = False

    if request.method == 'POST':
        data = json.loads(request.body)
        # print data
        for x in data:
            articles.append({
                'url': x['link'],
                'vote': upVote
            })
        for y in articles:
            Article.objects.update_or_create(url=y['url'], vote=upVote)

    return HttpResponse(json.dumps(articles), content_type='application/json')
