from rest_framework import serializers
from .models import CustomUser

class UserSerializer(serializers.Serializer):
    first_name=serializers.CharField()
    last_name=serializers.CharField()
    email=serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def create(self, validated_data):
        return CustomUser.objects.create_user(**validated_data)

    def update(self, instance, validated_data):
        password=validated_data.get("password")

        instance.first_name=validated_data.get("first_name", instance.first_name)
        instance.last_name=validated_data.get("last_name", instance.last_name)
        instance.email=validated_data.get("email", instance.email)

        if password:
            instance.set_password(password)
        instance.save()
        return instance

class LoginSerializer(serializers.Serializer):
    email=serializers.CharField()
    password=serializers.CharField()
