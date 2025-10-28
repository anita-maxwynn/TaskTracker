from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import WorkspaceViewSet, ProjectViewSet, TaskViewSet, WorkspaceMemberViewSet

router = DefaultRouter()
router.register(r'workspaces', WorkspaceViewSet, basename='workspace')
router.register(r'projects', ProjectViewSet, basename='project')
router.register(r'tasks', TaskViewSet, basename='task')
router.register(r'members', WorkspaceMemberViewSet, basename='member')  # new member endpoint

urlpatterns = [
    path('', include(router.urls)),
]
