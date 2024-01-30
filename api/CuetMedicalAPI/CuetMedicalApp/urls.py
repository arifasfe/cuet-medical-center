from django.urls import path
from CuetMedicalApp import views
from django.conf.urls.static import static
from django.conf import settings
from .views import LogoutAPIView

urlpatterns = [
    path('create-user/', views.CreateUserAPI.as_view()),
    path('update-user/<int:pk>', views.UpdateUserAPI.as_view()),
    path('login/', views.LoginAPIView.as_view()),
    path('logout/', LogoutAPIView.as_view()),
    path('unverified/', views.UnverifiedUsersView.as_view()),

    path('user/', views.UserList.as_view(), name='user'),
    path('user/<int:pk>', views.UserDetail.as_view(), name='user_detail'),


    path('doctor/', views.DoctorList.as_view(), name='doctor'),
    path('doctor/<int:pk>/', views.DoctorDetail.as_view(), name='doctor_detail'),

    path('ebooklet/', views.EBookletList.as_view(), name='ebooklet'),
    path('ebooklet/<str:pk>/', views.EBookletDetail.as_view(), name='ebooklet_detail'),

    path('dayslot/', views.DaySlotList.as_view(), name='dayslot'),
    path('dayslot/<int:pk>/', views.DaySlotDetail.as_view(), name='dayslot_detail'),

    path('roster/', views.RosterList.as_view(), name='roster'),
    path('roster/<int:pk>/', views.RosterDetail.as_view(), name='roster_detail'),

    path('prescription/', views.PrescriptionList.as_view(), name='prescription'),
    path('prescription/<int:pk>/', views.PrescriptionDetail.as_view(), name='prescription_detail')

]
#To do
#email unique banate hbe