from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Workspace(models.Model):
    name = models.CharField(max_length=100)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    image_url = models.URLField(blank=True, null=True)
    invite_link = models.CharField(max_length=100, blank=True, null=True)  # changed from URLField
    def __str__(self):
        return self.name
    
class WorkspaceMember(models.Model):
    workspace = models.ForeignKey(Workspace, on_delete=models.CASCADE, related_name='memberships')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=50, choices=[('admin', 'Admin'), ('member', 'Member')], default='member')
    def __str__(self):
        return f"{self.user.username} in {self.workspace.name}"
    
class Project(models.Model):
    workspace = models.ForeignKey(Workspace, on_delete=models.CASCADE, related_name='projects')
    name = models.CharField(max_length=100)
    image_url = models.URLField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    def __str__(self):
        return self.name
    
class Task(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='tasks')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    assigned_to = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    status = models.CharField(max_length=50, choices=[
        ('todo', 'To Do'), 
        ('in_progress', 'In Progress'), 
        ('done', 'Done'),
        ('in_review', 'In Review'),
        ('backlog', 'Backlog')
    ], default='todo')
    due_date = models.DateField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    def __str__(self):
        return self.title
