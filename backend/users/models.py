from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

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
    

    is_superuser=models.BooleanField(default=False)
    is_staff=models.BooleanField(default=False)

    objects=CustomUserManager()

    USERNAME_FIELD="email"


    def __str__(self):
        return(f"User {self.first_name} @ {self.email}")



    