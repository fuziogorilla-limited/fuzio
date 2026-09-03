from rest_framework.response  import Response
from rest_framework.views import APIView
from .serializers import UserSerializer, LoginSerializer, ChangePasswordSerializer, VerifyCodeSerializer
from rest_framework import status
from .models import CustomUser
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from rest_framework import permissions
from django.utils import timezone

class UserView(APIView):

    def get_permissions(self):
        if self.request.method == "PATCH":
            return [permissions.IsAuthenticated()]
        
        return [permissions.AllowAny()]
    
            
    def post(self, request):
        serializer=UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            {
                "New User": serializer.data
            },
            status=status.HTTP_201_CREATED
        )

    def patch(self, request):
        user=request.user
        serializer=UserSerializer(user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            {
                "Updates successfully":serializer.data
            },
            status=status.HTTP_200_OK
        )


class LoginUser(APIView):
    def post(self, request):
        serializer=LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email=serializer.validated_data["email"]
        password=serializer.validated_data["password"]

        user=CustomUser.objects.filter(email=email).first()

        if not user or not user.check_password(password):
            return Response({
                "message": "Invalid credentials"
            }, status=status.HTTP_401_UNAUTHORIZED)

        refresh=RefreshToken.for_user(user)

        return Response(
            {
                "refresh":str(refresh),
                "access": str(refresh.access_token)
            },
            status=status.HTTP_200_OK
        )

class ForgotPassword(APIView):
    permission_classes=[permissions.AllowAny]

    def post(self, request):
        serializer=ChangePasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email=serializer.validated_data["email"]

        user=CustomUser.objects.filter(email=email).first()

        if user:
            user.reset_code()

        return Response({"message":"If an account exists with that email, a reset code has been sent"}, status=status.HTTP_200_OK)

class VerifyCode(APIView):
    permission_classes=[permissions.AllowAny]
    def post(self, request):
        serializer=VerifyCodeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email=serializer.validated_data["email"]
        code=serializer.validated_data["code"]

        user=CustomUser.objects.filter(email=email).first()

        if not user or user.token != code:
            return Response(
                {
                    "message":"invalid credentials"
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        if not user.expiry or timezone.now() >= user.expiry:
            return Response({
                "message":"Code already expired"
            }, status=status.HTTP_400_BAD_REQUEST)
        

        access=AccessToken.for_user(user)
        user.token=None
        user.token_time=None
        user.expiry=None
        user.save(update_fields=["token", "token_time", "expiry"])

        return Response({
            "access":str(access)
        }, status=status.HTTP_200_OK)

    