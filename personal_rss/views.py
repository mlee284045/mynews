import json
from django.core import serializers
from django.http import HttpResponse
from django.shortcuts import render, redirect
from personal_rss.forms import ReaderCreationForm
from personal_rss.models import Reader, Feed, Article


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


@login_required
def profile(request):
    # "request.user" should be a Reader object if you've set Reader to be your AUTH_MODEL
    name = request.user.username
    reader = Reader.objects.get(username=name)
    if not reader.profile:
        reader.profile = 'static/img/test_tube.png'
    data = {
        'user': reader,
        'feeds': Feed.objects.filter(reader=reader)
    }
    return render(request, 'profile.html', data)


# def get_rss_urls(request):
#     feedUrl = request.user.feeds.all()
#
#     return

@login_required
def view_rss(request):
    # No camel case!!
    feedUrl = request.user.feeds.all()
    allUrls = []
    for url in feedUrl:
        allUrls.append({
            'feedUrl': url.feed_url
        })
    return HttpResponse(json.dumps(allUrls), content_type='application/json')


def add_rss(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        newFeed = Feed.objects.create(
            reader=request.user,
            feed_url=data,
        )
        response = serializers.serialize('json', [newFeed])
        print response
    return HttpResponse(response, content_type='application/json')


def save_article(request, vote):
    # Would be good to make 'up' a constant somewhere - UP_VOTE = 'up', DOWN_VOTE = 'down'
    articles = []
    if vote == 'up':
        upVote = True
    else:
        upVote = False

    if request.method == 'POST':
        data = json.loads(request.body)
        # print data
        # use more descriptive variables than x and y
        for x in data:
            articles.append({
                'url': x['link'],
                'vote': upVote
            })
        for y in articles:
            Article.objects.update_or_create(url=y['url'], vote=upVote)

    return HttpResponse(json.dumps(articles), content_type='application/json')
