from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import get_user_model, authenticate
User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']
        read_only_fields = ['id']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    username = serializers.CharField(required=False)

    class Meta:
        model = User
        fields = ('username', 'email', 'password')

    def create(self, validated_data):
        # If no username provided, use email as username
        if not validated_data.get('username'):
            validated_data['username'] = validated_data['email']
            
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user
    
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    
    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        if email and password:
            user = authenticate(username=email, password=password)
            if user:
                data['user'] = user
                return data
            else:
                raise serializers.ValidationError("Invalid credentials")
        else:
            raise serializers.ValidationError("Both email and password are required")