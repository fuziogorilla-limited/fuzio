from django.urls import  path
from .views import LoginUser, UserView, ForgotPassword, VerifyCode
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns=[
    path("sign-up/", UserView.as_view(), name="register"),
    path("user/", UserView.as_view(), name="update"),
    path("login/", LoginUser.as_view(), name="login"),

    path("forgot-password/", ForgotPassword.as_view(), name="forgot"),
    path("verify-code/", VerifyCode.as_view(), name="verify"),

    path("refresh/", TokenRefreshView.as_view(), name="refresh"),
]