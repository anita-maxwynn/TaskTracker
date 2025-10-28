from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.conf import settings
from django.contrib.auth import get_user_model
from .serializers import RegisterSerializer, LoginSerializer, UserSerializer
import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

User = get_user_model()


def get_requests_session():
    """Create a requests session with retry logic and proper SSL handling"""
    session = requests.Session()
    
    # Configure retry strategy
    retry = Retry(
        total=3,
        backoff_factor=0.3,
        status_forcelist=[500, 502, 503, 504],
    )
    
    adapter = HTTPAdapter(max_retries=retry)
    session.mount('http://', adapter)
    session.mount('https://', adapter)
    
    return session


class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response({"data": serializer.data})


class SignUpView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                "refresh": str(refresh),
                "access": str(refresh.access_token),
                "user": UserSerializer(user).data,
            })
        return Response(serializer.errors, status=400)


class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data["user"]
            refresh = RefreshToken.for_user(user)
            return Response({
                "refresh": str(refresh),
                "access": str(refresh.access_token),
                "user": UserSerializer(user).data,
            })
        return Response(serializer.errors, status=400)


class SocialLoginView(APIView):
    def post(self, request):
        provider = request.data.get("provider")
        token = request.data.get("token")
        code = request.data.get("code")

        if provider not in settings.SOCIAL_PROVIDERS:
            return Response({"error": "Unsupported provider"}, status=400)

        conf = settings.SOCIAL_PROVIDERS[provider]
        access_token = token
        
        # Create a session with retry logic
        session = get_requests_session()

        # GitHub: exchange code for access_token
        if provider == "github" and code:
            try:
                token_resp = session.post(
                    conf["token_url"],
                    headers={"Accept": "application/json"},
                    data={
                        "client_id": conf["client_id"],
                        "client_secret": conf["client_secret"],
                        "code": code,
                    },
                    timeout=10,  # Add timeout
                )
                token_data = token_resp.json()
                access_token = token_data.get("access_token")
                
                if not access_token:
                    return Response({"error": f"Failed to get access token: {token_data}"}, status=400)
            except Exception as e:
                return Response({"error": f"GitHub token exchange failed: {str(e)}"}, status=500)

        if not access_token:
            return Response({"error": "No access token provided"}, status=400)

        # Fetch user info with correct authorization header for each provider
        try:
            if provider == "github":
                # GitHub uses "token" prefix instead of "Bearer"
                headers = {"Authorization": f"token {access_token}"}
            else:
                # Google and others use "Bearer"
                headers = {"Authorization": f"Bearer {access_token}"}
                
            userinfo_resp = session.get(conf["userinfo_url"], headers=headers, timeout=10)
            
            if userinfo_resp.status_code != 200:
                return Response({"error": "Invalid access token"}, status=400)
                
            data = userinfo_resp.json()
        except Exception as e:
            return Response({"error": f"Failed to fetch user info: {str(e)}"}, status=500)

        # Parse user info
        if provider == "google":
            email = data.get("email")
            username = data.get("sub")
        elif provider == "github":
            email = data.get("email")
            if not email:
                try:
                    # GitHub uses "token" prefix
                    email_headers = {"Authorization": f"token {access_token}"}
                    emails_resp = session.get(conf["email_url"], headers=email_headers, timeout=10)
                    emails = emails_resp.json()
                    email = next((e["email"] for e in emails if e.get("primary")), None)
                except Exception as e:
                    return Response({"error": f"Failed to fetch email: {str(e)}"}, status=500)
            username = str(data.get("login"))  # GitHub uses "login" not "id" for username

        if not email:
            return Response({"error": "Email not available"}, status=400)

        # Create or get user
        user, created = User.objects.get_or_create(
            email=email, defaults={"username": username}
        )

        # Issue JWT
        refresh = RefreshToken.for_user(user)
        
        return Response({
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "user": UserSerializer(user).data,
            "created": created,
            "provider": provider,
        })
