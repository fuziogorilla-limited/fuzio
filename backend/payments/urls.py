from .views import PaymentStatusApiView, StkPushApiView
from django.urls import path

urlpatterns=[
    path("stk-push/", StkPushApiView.as_view(), name="pay"),
    path("callback/", PaymentStatusApiView.as_view(), name="callback-url")
]