from django.urls import  path
from .views import LoginUser, UserView

urlpatterns=[
    path("sign-up/", UserView.as_view(), name="register"),
    path("user/", UserView.as_view(), name="update"),
    path("login/", LoginUser.as_view(), name="login"),

]