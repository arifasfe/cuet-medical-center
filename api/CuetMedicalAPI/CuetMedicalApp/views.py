from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import  MultiPartParser
from rest_framework.response import Response
from rest_framework.generics import ListAPIView
from rest_framework import status, mixins, generics
from django.core.files.storage import default_storage
from .models import User,Doctor, EBooklet, DaySlot, Roster, Prescription
from .serializers import LoginSerializer,UserSerializer,CreateUserSerializer, UpdateUserSerializer, DoctorSerializer, EBookletSerializer,RosterSerializer, PrescriptionSerializer,DaySlotSerializer
from rest_framework import status, serializers
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny,IsAuthenticated
from rest_framework.authtoken.serializers import AuthTokenSerializer
from knox import views as knox_views
from django.contrib.auth import login
from rest_framework.decorators import api_view
from knox.views import LogoutView
from rest_framework.permissions import IsAuthenticated


class CreateUserAPI(generics.CreateAPIView):
    permission_classes = (AllowAny,)
    queryset = User.objects.all()
    serializer_class = CreateUserSerializer
    

class UpdateUserAPI(generics.UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UpdateUserSerializer

class LoginAPIView(knox_views.LoginView):
    permission_classes = (AllowAny, )
    serializer_class = LoginSerializer

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.validated_data['user']
            login(request, user)
            response = super().post(request, format=None)
        else:
            return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        return Response(response.data, status=status.HTTP_200_OK)
    
class LogoutAPIView(LogoutView):
    permission_classes = (IsAuthenticated,)

class UnverifiedUsersView(ListAPIView):
    queryset = User.objects.filter(verified=False)
    serializer_class = UserSerializer

class UserList(mixins.ListModelMixin,
                mixins.CreateModelMixin,
                generics.GenericAPIView):
    queryset= User.objects.all()
    serializer_class = UserSerializer
    parser_classes = [MultiPartParser]
    def get(self, request, *args, **kwargs):
        try:
            response = self.list(request, *args, **kwargs)
            data = {
                "status": response.status_code,
                "status_description": response.status_text,
                "description": "Student List retrieved successfully",
                "data": response.data
            }
            return Response(data)
        except Exception as e:  # Catch any errors
            data = {
                "status_code": status.HTTP_404_NOT_FOUND,
                "status_description": str(e),  # Include error message for debugging
            }
            return Response(data)
class UserDetail(mixins.RetrieveModelMixin,
                  mixins.UpdateModelMixin,
                  mixins.DestroyModelMixin,
                  generics.GenericAPIView):
    queryset= User.objects.all()
    serializer_class = UserSerializer

    def get(self, request, *args, **kwargs):
        try:
            response = self.retrieve(request, *args, *kwargs)
            data = {
                "status": response.status_code,
                "status_description": response.status_text,
                "description": "User details retrieved successfully",
                "data": response.data
            }
            return Response(data)
        except Exception as e:  # Catch any errors
            data = {
                "status_code": status.HTTP_404_NOT_FOUND,
                "status_description": str(e),  # Include error message for debugging
            }
            return Response(data)
    def patch(self, request, *args, **kwargs):
        try:
            response = self.partial_update(request, *args, *kwargs)
            data = {
                "status": response.status_code,
                "status_description": response.status_text,
                "description": "User updated successfully",
                "data": response.data
            }
            return Response(data)
        except Exception as e:  # Catch any errors
            data = {
                "status_code": status.HTTP_404_NOT_FOUND,
                "status_description": str(e),  # Include error message for debugging
            }
            return Response(data)
        
    def post(self, request, *args, **kwargs):
        try:
            response = self.create(request, *args, *kwargs)
            data = {
                "status": response.status_code,
                "status_description": response.status_text,
                "description": "Student updated successfully",
                "data": response.data
            }
            return Response(data)
        except Exception as e:  # Catch any errors
            data = {
                "status_code": status.HTTP_404_NOT_FOUND,
                "status_description": str(e),  # Include error message for debugging
            }
            return Response(data)

   
    def delete(self, request, *args, **kwargs):
        try:
            response = self.destroy(request, *args, *kwargs)
            data = {
                "status": response.status_code,
                "status_description": response.status_text,
                "description": "User deleted successfully",
                "data": response.data
            }
            return Response(data)
        except Exception as e:  # Catch any errors
            data = {
                "status_code": status.HTTP_404_NOT_FOUND,
                "status_description": str(e),  # Include error message for debugging
            }
            return Response(data)

# Create your views here.
class DoctorList(mixins.ListModelMixin,
                mixins.CreateModelMixin,
                generics.GenericAPIView):
    queryset= Doctor.objects.all()
    serializer_class = DoctorSerializer

    def get(self, request, *args, **kwargs):
        try:
            response = self.list(request, *args, *kwargs)
            data = {
                "status": response.status_code,
                "status_description": response.status_text,
                "description": "Doctor List retrieved successfully",
                "data": response.data
            }
            return Response(data)
        except Exception as e:  # Catch any errors
            data = {
                "status_code": status.HTTP_404_NOT_FOUND,
                "status_description": str(e),  # Include error message for debugging
            }
            return Response(data)
    def post(self, request, *args, **kwargs):
        try:
            response = self.create(request, *args, *kwargs)
            data = {
                "status": response.status_code,
                "status_description": response.status_text,
                "description": "Doctor created successfully",
                "data": response.data
            }
            return Response(data)
        except Exception as e:  # Catch any errors
            data = {
                "status_code": status.HTTP_404_NOT_FOUND,
                "status_description": str(e),  # Include error message for debugging
            }
            return Response(data)

class DoctorDetail(mixins.RetrieveModelMixin,
                  mixins.UpdateModelMixin,
                  mixins.DestroyModelMixin,
                  generics.GenericAPIView):
    queryset= Doctor.objects.all()
    serializer_class = DoctorSerializer

    def get(self, request, *args, **kwargs):
        try:
            response = self.retrieve(request, *args, *kwargs)
            data = {
                "status": response.status_code,
                "status_description": response.status_text,
                "description": "Doctor details retrieved successfully",
                "data": response.data
            }
            return Response(data)
        except Exception as e:  # Catch any errors
            data = {
                "status_code": status.HTTP_404_NOT_FOUND,
                "status_description": str(e),  # Include error message for debugging
            }
            return Response(data)
    def put(self, request, *args, **kwargs):
        try:
            response = self.update(request, *args, *kwargs)
            data = {
                "status": response.status_code,
                "status_description": response.status_text,
                "description": "Doctor updated successfully",
                "data": response.data
            }
            return Response(data)
        except Exception as e:  # Catch any errors
            data = {
                "status_code": status.HTTP_404_NOT_FOUND,
                "status_description": str(e),  # Include error message for debugging
            }
            return Response(data)
    def delete(self, request, *args, **kwargs):
        try:
            response = self.destroy(request, *args, *kwargs)
            data = {
                "status": response.status_code,
                "status_description": response.status_text,
                "description": "Doctor deleted successfully",
                "data": response.data
            }
            return Response(data)
        except Exception as e:  # Catch any errors
            data = {
                "status_code": status.HTTP_404_NOT_FOUND,
                "status_description": str(e),  # Include error message for debugging
            }
            return Response(data)


    
class EBookletList(mixins.ListModelMixin,
                mixins.CreateModelMixin,
                generics.GenericAPIView):
    queryset= EBooklet.objects.all()
    serializer_class = EBookletSerializer

    def get(self, request, *args, **kwargs):
        try:
            response = self.list(request, *args, *kwargs)
            data = {
                "status": response.status_code,
                "status_description": response.status_text,
                "description": "E-Booklet List retrieved successfully",
                "data": response.data
            }
            return Response(data)
        except Exception as e:  # Catch any errors
            data = {
                "status_code": status.HTTP_404_NOT_FOUND,
                "status_description": str(e),  # Include error message for debugging
            }
            return Response(data)
    def post(self, request, *args, **kwargs):
        try:
            response = self.create(request, *args, *kwargs)
            data = {
                "status": response.status_code,
                "status_description": response.status_text,
                "description": "E-booklet created successfully",
                "data": response.data
            }
            return Response(data)
        except Exception as e:  # Catch any errors
            data = {
                "status_code": status.HTTP_404_NOT_FOUND,
                "status_description": str(e),  # Include error message for debugging
            }
            return Response(data)

class EBookletDetail(mixins.RetrieveModelMixin,
                  mixins.UpdateModelMixin,
                  mixins.DestroyModelMixin,
                  generics.GenericAPIView):
    queryset= EBooklet.objects.all()
    serializer_class = EBookletSerializer

    def get(self, request, *args, **kwargs):
        try:
            response = self.retrieve(request, *args, *kwargs)
            data = {
                "status": response.status_code,
                "status_description": response.status_text,
                "description": "E-booklet retrieved successfully",
                "data": response.data
            }
            return Response(data)
        except Exception as e:  # Catch any errors
            data = {
                "status_code": status.HTTP_404_NOT_FOUND,
                "status_description": str(e),  # Include error message for debugging
            }
            return Response(data)
    def delete(self, request, *args, **kwargs):
        try:
            response = self.destroy(request, *args, *kwargs)
            data = {
                "status": response.status_code,
                "status_description": response.status_text,
                "description": "E-booklet deleted successfully",
                "data": response.data
            }
            return Response(data)
        except Exception as e:  # Catch any errors
            data = {
                "status_code": status.HTTP_404_NOT_FOUND,
                "status_description": str(e),  # Include error message for debugging
            }
            return Response(data)
    
class DaySlotList(mixins.ListModelMixin,
                mixins.CreateModelMixin,
                generics.GenericAPIView):
    queryset= DaySlot.objects.all()
    serializer_class = DaySlotSerializer

    def get(self, request, *args, **kwargs):
        try:
            response = self.list(request, *args, *kwargs)
            data = {
                "status": response.status_code,
                "status_description": response.status_text,
                "description": "Dayslot list retrieved successfully",
                "data": response.data
            }
            return Response(data)
        except Exception as e:  # Catch any errors
            data = {
                "status_code": status.HTTP_404_NOT_FOUND,
                "status_description": str(e),  # Include error message for debugging
            }
            return Response(data)
    def post(self, request, *args, **kwargs):
        try:
            response = self.create(request, *args, *kwargs)
            data = {
                "status": response.status_code,
                "status_description": response.status_text,
                "description": "Dayslot List created successfully",
                "data": response.data
            }
            return Response(data)
        except Exception as e:  # Catch any errors
            data = {
                "status_code": status.HTTP_404_NOT_FOUND,
                "status_description": str(e),  # Include error message for debugging
            }
            return Response(data)

class DaySlotDetail(mixins.RetrieveModelMixin,
                  mixins.UpdateModelMixin,
                  mixins.DestroyModelMixin,
                  generics.GenericAPIView):
    queryset= DaySlot.objects.all()
    serializer_class = DaySlotSerializer

    def get(self, request, *args, **kwargs):
        try:
            response = self.retrieve(request, *args, *kwargs)
            data = {
                "status": response.status_code,
                "status_description": response.status_text,
                "description": "Dayslot retrieved successfully",
                "data": response.data
            }
            return Response(data)
        except Exception as e:  # Catch any errors
            data = {
                "status_code": status.HTTP_404_NOT_FOUND,
                "status_description": str(e),  # Include error message for debugging
            }
            return Response(data)
    def put(self, request, *args, **kwargs):
        try:
            response = self.update(request, *args, *kwargs)
            data = {
                "status": response.status_code,
                "status_description": response.status_text,
                "description": "Dayslot updated successfully",
                "data": response.data
            }
            return Response(data)
        except Exception as e:  # Catch any errors
            data = {
                "status_code": status.HTTP_404_NOT_FOUND,
                "status_description": str(e),  # Include error message for debugging
            }
            return Response(data)
    def delete(self, request, *args, **kwargs):
        try:
            response = self.destroy(request, *args, *kwargs)
            data = {
                "status": response.status_code,
                "status_description": response.status_text,
                "description": "Dayslot deleted successfully",
                "data": response.data
            }
            return Response(data)
        except Exception as e:  # Catch any errors
            data = {
                "status_code": status.HTTP_404_NOT_FOUND,
                "status_description": str(e),  # Include error message for debugging
            }
            return Response(data)
    
class RosterList(mixins.ListModelMixin,
                mixins.CreateModelMixin,
                generics.GenericAPIView):
    queryset= Roster.objects.all()
    serializer_class = RosterSerializer

    def get(self, request, *args, **kwargs):
        try:
            response = self.list(request, *args, *kwargs)
            data = {
                "status": response.status_code,
                "status_description": response.status_text,
                "description": "Roster List retrieved successfully",
                "data": response.data
            }
            return Response(data)
        except Exception as e:  # Catch any errors
            data = {
                "status_code": status.HTTP_404_NOT_FOUND,
                "status_description": str(e),  # Include error message for debugging
            }
            return Response(data)
    def post(self, request, *args, **kwargs):
        try:
            response = self.create(request, *args, *kwargs)
            data = {
                "status": response.status_code,
                "status_description": response.status_text,
                "description": "Roster List created successfully",
                "data": response.data
            }
            return Response(data)
        except Exception as e:  # Catch any errors
            data = {
                "status_code": status.HTTP_404_NOT_FOUND,
                "status_description": str(e),  # Include error message for debugging
            }
            return Response(data)

class RosterDetail(mixins.RetrieveModelMixin,
                  mixins.UpdateModelMixin,
                  mixins.DestroyModelMixin,
                  generics.GenericAPIView):
    queryset= Roster.objects.all()
    serializer_class = RosterSerializer

    def get(self, request, *args, **kwargs):
        try:
            response = self.retrieve(request, *args, *kwargs)
            data = {
                "status": response.status_code,
                "status_description": response.status_text,
                "description": "Roster retrieved successfully",
                "data": response.data
            }
            return Response(data)
        except Exception as e:  # Catch any errors
            data = {
                "status_code": status.HTTP_404_NOT_FOUND,
                "status_description": str(e),  # Include error message for debugging
            }
            return Response(data)
    def put(self, request, *args, **kwargs):
        try:
            response = self.update(request, *args, *kwargs)
            data = {
                "status": response.status_code,
                "status_description": response.status_text,
                "description": "Roster updated successfully",
                "data": response.data
            }
            return Response(data)
        except Exception as e:  # Catch any errors
            data = {
                "status_code": status.HTTP_404_NOT_FOUND,
                "status_description": str(e),  # Include error message for debugging
            }
            return Response(data)
    def delete(self, request, *args, **kwargs):
        try:
            response = self.destroy(request, *args, *kwargs)
            data = {
                "status": response.status_code,
                "status_description": response.status_text,
                "description": "Roster deleted successfully",
                "data": response.data
            }
            return Response(data)
        except Exception as e:  # Catch any errors
            data = {
                "status_code": status.HTTP_404_NOT_FOUND,
                "status_description": str(e),  # Include error message for debugging
            }
            return Response(data)
    
class PrescriptionList(mixins.ListModelMixin,
                mixins.CreateModelMixin,
                generics.GenericAPIView):
    queryset= Prescription.objects.all()
    serializer_class = PrescriptionSerializer

    def get(self, request, *args, **kwargs):
        try:
            response = self.list(request, *args, *kwargs)
            data = {
                "status": response.status_code,
                "status_description": response.status_text,
                "description": "Prescription List retrieved successfully",
                "data": response.data
            }
            return Response(data)
        except Exception as e:  # Catch any errors
            data = {
                "status_code": status.HTTP_404_NOT_FOUND,
                "status_description": str(e),  # Include error message for debugging
            }
            return Response(data)
    def post(self, request, *args, **kwargs):
        try:
            response = self.create(request, *args, *kwargs)
            data = {
                "status": response.status_code,
                "status_description": response.status_text,
                "description": "Prescription created successfully",
                "data": response.data
            }
            return Response(data)
        except Exception as e:  # Catch any errors
            data = {
                "status_code": status.HTTP_404_NOT_FOUND,
                "status_description": str(e),  # Include error message for debugging
            }
            return Response(data)

class PrescriptionDetail(mixins.RetrieveModelMixin,
                  mixins.UpdateModelMixin,
                  mixins.DestroyModelMixin,
                  generics.GenericAPIView):
    queryset= Prescription.objects.all()
    serializer_class = PrescriptionSerializer

    def get(self, request, *args, **kwargs):
        try:
            response = self.retrieve(request, *args, *kwargs)
            data = {
                "status": response.status_code,
                "status_description": response.status_text,
                "description": "Prescription retrieved successfully",
                "data": response.data
            }
            return Response(data)
        except Exception as e:  # Catch any errors
            data = {
                "status_code": status.HTTP_404_NOT_FOUND,
                "status_description": str(e),  # Include error message for debugging
            }
            return Response(data)
    def patch(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            serializer = self.get_serializer(instance, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            new_confirmation = request.data.get('confirmation')
            if new_confirmation == instance.confirmation:
                raise serializers.ValidationError("New value is the same as the current value.")
            self.perform_update(serializer)
            return Response(serializer.data)
        except Exception as e: # Catch any errors
            data = {
                "status_code": status.HTTP_404_NOT_FOUND,
                "status_description": str(e), # Include error message for debugging
            }
            return Response(data)


        
    def delete(self, request, *args, **kwargs):
        try:
            response = self.destroy(request, *args, *kwargs)
            data = {
                "status": response.status_code,
                "status_description": response.status_text,
                "description": "Prescription deleted successfully",
                "data": response.data
            }
            return Response(data)
        except Exception as e:  # Catch any errors
            data = {
                "status_code": status.HTTP_404_NOT_FOUND,
                "status_description": str(e),  # Include error message for debugging
            }
            return Response(data)
