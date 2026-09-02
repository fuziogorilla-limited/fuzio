from rest_framework.response  import Response
from rest_framework.views import APIView
from .serializers import UserSerializer, LoginSerializer
from rest_framework import status
from .models import CustomUser
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import permissions

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
            return Response("Invalid credentials")

        refresh=RefreshToken.for_user(user)

        return Response(
            {
                "refresh":str(refresh),
                "access": str(refresh.access_token)
            },
            status=status.HTTP_200_OK
        )
    