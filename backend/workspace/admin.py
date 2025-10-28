from django.contrib import admin
from .models import Workspace, WorkspaceMember, Project, Task

@admin.register(Workspace)
class WorkspaceAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'created_by', 'invite_link']
    search_fields = ['name', 'created_by__username']

@admin.register(WorkspaceMember)
class WorkspaceMemberAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'workspace', 'role']
    list_filter = ['role']
    search_fields = ['user__username', 'workspace__name']

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'workspace', 'created_at', 'updated_at']
    search_fields = ['name', 'workspace__name']

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ['id', 'title', 'project', 'assigned_to', 'status', 'due_date']
    list_filter = ['status']
    search_fields = ['title', 'project__name', 'assigned_to__username']
