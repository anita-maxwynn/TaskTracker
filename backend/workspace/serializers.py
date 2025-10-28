from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Workspace, WorkspaceMember, Project, Task

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']
        read_only_fields = ['id', 'username', 'email']

class WorkspaceSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)
    class Meta:
        model = Workspace
        fields = ['id', 'name', 'created_by', 'image_url', 'invite_link']
        read_only_fields = ['created_by', 'invite_link']

class WorkspaceCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Workspace
        fields = ['name', 'image_url']

class WorkspaceMemberSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    class Meta:
        model = WorkspaceMember
        fields = ['id', 'user', 'role']

class ProjectSerializer(serializers.ModelSerializer):
    workspace = serializers.StringRelatedField(read_only=True)
    class Meta:
        model = Project
        fields = ['id', 'workspace', 'name', 'description', 'image_url', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

class ProjectCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['workspace', 'name', 'description', 'image_url']

class TaskSerializer(serializers.ModelSerializer):
    project = serializers.StringRelatedField(read_only=True)
    assigned_to = UserSerializer(read_only=True)
    class Meta:
        model = Task
        fields = ['id', 'project', 'title', 'description', 'assigned_to', 'status', 'due_date', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

class TaskDetailSerializer(serializers.ModelSerializer):
    project = ProjectSerializer(read_only=True)
    assigned_to = UserSerializer(read_only=True)
    class Meta:
        model = Task
        fields = ['id', 'project', 'title', 'description', 'assigned_to', 'status', 'due_date', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

class TaskCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['project', 'title', 'description', 'assigned_to', 'status', 'due_date']
