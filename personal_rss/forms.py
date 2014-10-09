from django.contrib.auth.forms import UserCreationForm
from django import forms
from personal_rss.models import Reader


class ReaderCreationForm(UserCreationForm):
    email = forms.EmailField()

    def clean_username(self):
        # Since User.username is unique, this check is redundant,
        # but it sets a nicer error message than the ORM. See #13147.
        username = self.cleaned_data["username"]
        try:
            Reader.objects.get(username=username)
        except Reader.DoesNotExist:
            return username
        raise forms.ValidationError(
            self.error_messages['duplicate_username'],
            code='duplicate_username',
        )

    class Meta:
        model = Reader
        fields = ('username', 'email', 'password1', 'password2')