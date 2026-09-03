from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
import secrets
from datetime import timedelta
from django.utils import timezone
from django.core.mail import EmailMultiAlternatives
import environ
env=environ.Env()

class CustomUserManager(BaseUserManager):
    def create_user(self, first_name, last_name, email, password=None):
        if not email:
            raise ValueError("Email is required")
        user=self.model(
            first_name=first_name,
            last_name=last_name,
            email=self.normalize_email(email)
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None):
        if not email:
            raise ValueError ("Email is required for admin!")
        user=self.model(
            email=self.normalize_email(email)
        )
        user.set_password(password)
        user.is_staff=True
        user.is_superuser=True
        user.is_active=True
        user.save(using=self._db)
        return user

class CustomUser(AbstractBaseUser, PermissionsMixin):
    first_name=models.CharField(max_length=100, blank=False, null=False)
    last_name=models.CharField(max_length=100)
    email=models.EmailField(unique=True, blank=False, null=False)
    date_registered=models.DateTimeField(auto_now_add=True)
    date_updated=models.DateTimeField(auto_now=True)

    token=models.CharField(blank=True, null=True)
    token_time=models.DateTimeField(null=True, blank=True)
    expiry=models.DateTimeField(null=True, blank=True)

    is_superuser=models.BooleanField(default=False)
    is_staff=models.BooleanField(default=False)

    objects=CustomUserManager()

    USERNAME_FIELD="email"

    def reset_code(self):
        code=str(secrets.randbelow(900000)+(100000))
        self.token=code
        self.token_time=timezone.now()
        self.expiry=self.token_time + timedelta(minutes=5)
        self.save(update_fields=["token","token_time","expiry"])

        msg=EmailMultiAlternatives(
            subject="Password reset code",
            body=f"Your reset code is: {self.token} \n \n It expires in 5 min. \n \n Ensure you change your password, The code expires soon.",
            from_email=env("EMAIL_HOST_USER"),
            to=[self.email],
        )
        msg.send()
        return True
    
    def __str__(self):
        return(f"User {self.first_name} @ {self.email}")



    