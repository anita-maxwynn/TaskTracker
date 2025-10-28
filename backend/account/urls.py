from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView, TokenVerifyView
from .views import SignUpView, LoginView, SocialLoginView, CurrentUserView

urlpatterns = [
    path("auth/current/", CurrentUserView.as_view(), name="current-user"),
    path("auth/register/", SignUpView.as_view(), name="register"),
    path("auth/login/", LoginView.as_view(), name="login"),
    path("auth/social/", SocialLoginView.as_view(), name="social-login"),
    path("auth/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("auth/verify/", TokenVerifyView.as_view(), name="token_verify"),
]
