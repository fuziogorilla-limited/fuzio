from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import CustomUser


@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    model = CustomUser

    list_display = (
        "email",
        "first_name",
        "last_name",
        "is_staff",
        "is_superuser",
        "date_registered",
    )

    list_filter = (
        "is_staff",
        "is_superuser",
        "date_registered",
    )

    search_fields = (
        "email",
        "first_name",
        "last_name",
    )

    ordering = (
        "-date_registered",
    )

    fieldsets = (
        (
            "Account",
            {
                "fields": (
                    "email",
                    "password",
                )
            },
        ),
        (
            "Personal Information",
            {
                "fields": (
                    "first_name",
                    "last_name",
                )
            },
        ),
        (
            "Permissions",
            {
                "fields": (
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                )
            },
        ),
        (
            "Important Dates",
            {
                "fields": (
                    "date_registered",
                    "date_updated",
                )
            },
        ),
        (
            "Password Reset",
            {
                "fields": (
                    "token",
                    "token_time",
                    "expiry",
                )
            },
        ),
    )

    readonly_fields = (
        "date_registered",
        "date_updated",
        "token_time",
        "expiry",
    )

    add_fieldsets = (
        (
            "Create User",
            {
                "classes": ("wide",),
                "fields": (
                    "email",
                    "first_name",
                    "last_name",
                    "password1",
                    "password2",
                    "is_staff",
                    "is_superuser",
                    "is_active",
                ),
            },
        ),
    )