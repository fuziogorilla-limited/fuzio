from rest_framework import serializers
from .models import CustomUser, Suppliers

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

class DetailsSerializer(serializers.ModelSerializer):
    class Meta:
        mode=CustomUser
        fields="__all__"

class LoginSerializer(serializers.Serializer):
    email=serializers.EmailField()
    password=serializers.CharField()

class ChangePasswordSerializer(serializers.Serializer):
    email=serializers.EmailField()

class VerifyCodeSerializer(serializers.Serializer):
    email=serializers.EmailField()
    code=serializers.CharField(min_length=6, max_length=6)

class SupplierSerializers(serializers.ModelSerializer):
    class Meta:
        model=Suppliers
        fields="__all__"

class SupplierEditSerializers(serializers.ModelSerializer):
    class Meta:
        model=Suppliers
        fields=["first_name", "last_name", "email", "phone_number", "product"]