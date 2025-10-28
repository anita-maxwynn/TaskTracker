from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Workspace, Project, Task, WorkspaceMember
from .serializers import (
    WorkspaceSerializer, WorkspaceCreateSerializer,
    ProjectSerializer, ProjectCreateSerializer,
    TaskSerializer, TaskCreateSerializer, TaskDetailSerializer,
    WorkspaceMemberSerializer
)
from .utils import generate_invite_token


# ------------------ Workspace ------------------
class WorkspaceViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return WorkspaceCreateSerializer
        return WorkspaceSerializer

    def get_queryset(self):
        return Workspace.objects.filter(
            memberships__user=self.request.user
        ).distinct()

    def perform_create(self, serializer):
        workspace = serializer.save(created_by=self.request.user)
        WorkspaceMember.objects.create(
            workspace=workspace, user=self.request.user, role='admin'
        )
        workspace.invite_link = generate_invite_token()
        workspace.save()

    def destroy(self, request, *args, **kwargs):
        workspace = self.get_object()
        try:
            membership = WorkspaceMember.objects.get(
                workspace=workspace, user=request.user
            )
        except WorkspaceMember.DoesNotExist:
            return Response({'error': 'Not a member of this workspace'}, status=403)

        if membership.role != 'admin' and workspace.created_by != request.user:
            return Response({'error': 'Only admin/creator can delete this workspace'}, status=403)

        return super().destroy(request, *args, **kwargs)

    @action(detail=False, methods=['post'], url_path='join')
    def join_workspace(self, request):
        token = request.data.get('invite_link')
        if not token:
            return Response({'error': 'Invite link required'}, status=400)
        try:
            workspace = Workspace.objects.get(invite_link=token)
        except Workspace.DoesNotExist:
            return Response({'error': 'Invalid invite link'}, status=400)

        member, created = WorkspaceMember.objects.get_or_create(
            workspace=workspace,
            user=request.user,
            defaults={'role': 'member'}
        )
        if not created:
            return Response({'message': 'Already a member'}, status=200)

        return Response({'message': f'Joined {workspace.name} successfully!'}, status=201)

    @action(detail=True, methods=['post'], url_path='regenerate-invite')
    def regenerate_invite(self, request, pk=None):
        workspace = self.get_object()
        if workspace.created_by != request.user:
            return Response({'error': 'Only creator can regenerate invite link'}, status=403)
        workspace.invite_link = generate_invite_token()
        workspace.save()
        return Response({'invite_link': workspace.invite_link})


# ------------------ WorkspaceMember ------------------
class WorkspaceMemberViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = WorkspaceMemberSerializer

    def get_queryset(self):
        return WorkspaceMember.objects.filter(
            workspace__memberships__user=self.request.user
        )

    def create(self, request, *args, **kwargs):
        return Response(
            {"error": "Members cannot be created manually. Join via invite link."},
            status=status.HTTP_403_FORBIDDEN
        )

    def update(self, request, *args, **kwargs):
        member = self.get_object()
        role = request.data.get('role')
        if not role:
            return Response({'error': 'Role is required'}, status=400)

        try:
            current_user_membership = WorkspaceMember.objects.get(
                workspace=member.workspace, user=request.user
            )
            if current_user_membership.role != 'admin' and member.workspace.created_by != request.user:
                return Response({'error': 'Only admin/creator can update member role'}, status=403)
        except WorkspaceMember.DoesNotExist:
            return Response({'error': 'You are not a member of this workspace'}, status=403)

        member.role = role
        member.save()
        serializer = WorkspaceMemberSerializer(member)
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        member = self.get_object()
        try:
            current_user_membership = WorkspaceMember.objects.get(
                workspace=member.workspace, user=request.user
            )
            if current_user_membership.role != 'admin' and member.workspace.created_by != request.user:
                return Response({'error': 'Only admin/creator can remove members'}, status=403)
        except WorkspaceMember.DoesNotExist:
            return Response({'error': 'You are not a member of this workspace'}, status=403)

        member.delete()
        return Response({'message': 'Member removed successfully'}, status=204)


# ------------------ Project ------------------
class ProjectViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return ProjectCreateSerializer
        return ProjectSerializer

    def get_queryset(self):
        queryset = Project.objects.filter(
            workspace__memberships__user=self.request.user
        ).distinct()

        workspace_id = self.request.query_params.get('workspace')
        if workspace_id:
            queryset = queryset.filter(workspace_id=workspace_id)

        return queryset


# ------------------ Task ------------------
class TaskViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return TaskCreateSerializer
        elif self.action == 'retrieve':
            return TaskDetailSerializer
        return TaskSerializer

    def get_queryset(self):
        queryset = Task.objects.filter(
            project__workspace__memberships__user=self.request.user
        ).distinct()

        # Filters
        workspace_id = self.request.query_params.get('workspace')
        if workspace_id:
            queryset = queryset.filter(project__workspace_id=workspace_id)

        project_id = self.request.query_params.get('project')
        if project_id:
            queryset = queryset.filter(project_id=project_id)

        assigned_to = self.request.query_params.get('assigned_to')
        if assigned_to:
            queryset = queryset.filter(assigned_to_id=assigned_to)

        status_param = self.request.query_params.get('status')
        if status_param:
            queryset = queryset.filter(status=status_param)

        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(title__icontains=search)

        due_date = self.request.query_params.get('due_date')
        if due_date:
            queryset = queryset.filter(due_date=due_date)

        return queryset
