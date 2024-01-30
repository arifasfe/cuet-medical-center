from django.db import models
from cloudinary.models import CloudinaryField
from django.core.validators import RegexValidator
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser

class UserManager(BaseUserManager):
    def create_user(self, id, password, **extra_fields):
        if not id:
            raise ValueError("The id is not given.")
        #email = self.normalize_email(email)
        user = self.model(id=id, **extra_fields)
        user.is_active = True
        user.verified = False
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, id, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        extra_fields.setdefault('verified', True)

        if not extra_fields.get('is_staff'):
            raise ValueError("Superuser must have is_staff = True")

        if not extra_fields.get('is_superuser'):
            raise ValueError("Superuser must have is_superuser = True")
        return self.create_user(id, password, **extra_fields)


class User(AbstractBaseUser): #Settings.py te change kora lagbe in AUTH_USER_MODEL
    GENDER_CHOICES = (
        ('Male', 'Male'),
        ('Female', 'Female'),
        ('Others', 'Others'),
    )
    id = models.CharField(max_length=7, primary_key=True)
    email = models.EmailField(max_length=254, unique=True)
    password = models.CharField(max_length=128, null=True)
    first_name = models.CharField(max_length=255, null=True, blank=True)
    last_name = models.CharField(max_length=255, null=True, blank=True)
    gender = models.CharField(max_length=15,choices=GENDER_CHOICES)
    department = models.CharField(max_length=50)
    phone = models.CharField(max_length=15,unique = True, validators=[RegexValidator(r'^01\d{9}$')])
    permanent_address = models.TextField()
    hall_name = models.CharField(max_length=100)
    room_no = models.CharField(max_length=10)
    image = CloudinaryField('image')
    blood_group = models.CharField(max_length=3)
    transaction_id = models.CharField(max_length=10, unique = True)
    verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    USERNAME_FIELD = 'id'
    REQUIRED_FIELDS = ['password']

    objects = UserManager()

    def __str__(self):
        return self.id

    def has_module_perms(self, app_label):
        return True

    def has_perm(self, perm, obj=None):
        return True

# Create your models here.

class Doctor(models.Model):
    doctor_id = models.AutoField(primary_key=True)
    doctor_name = models.CharField(max_length=100)
    specialization = models.TextField()
    address = models.TextField()
    phone = models.CharField(max_length=15,unique = True, validators=[RegexValidator(r'^01\d{9}$')])

class EBooklet(models.Model):
    booklet_id = models.CharField(max_length=8,validators=[RegexValidator(r'^B\d{7}$')], primary_key=True)  # Assuming B1804075 format
    student = models.OneToOneField(User, on_delete=models.CASCADE) #Student hobe

class DaySlot(models.Model):
    DAY_CHOICES = (
        ('Sunday', 'Sunday'),
        ('Monday', 'Monday'),
        ('Tuesday', 'Tuesday'),
        ('Wednesday', 'Wednesday'),
        ('Thursday', 'Thursday'),
        ('Friday', 'Friday'),
        ('Saturday', 'Saturday'),
    )
    SLOT_CHOICES = (
        ('Morning', 'Morning'),
        ('Noon', 'Noon'),
        ('Evening', 'Evening'),
    )

    day = models.CharField(max_length=15,choices=DAY_CHOICES)
    slot = models.CharField(max_length=15,choices=SLOT_CHOICES)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['day', 'slot'], name='unique_day_slot')
        ]

class Roster(models.Model):
    roster_id = models.AutoField(primary_key=True)
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE)
    dayslot = models.ForeignKey(DaySlot, on_delete=models.CASCADE)
    month = models.IntegerField()
    year = models.IntegerField()

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['dayslot', 'month', 'year'],
                                     name='unique_roster_slot_month_year')]

class Prescription(models.Model):
    prescription_id = models.AutoField(primary_key=True)
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE)
    booklet = models.ForeignKey(EBooklet, on_delete=models.CASCADE)
    date_time = models.DateTimeField(auto_now= True)
    complaints = models.TextField()
    diagnosis = models.TextField()
    rx = models.TextField()
    investigation = models.TextField()
    lifestyle = models.TextField()
    last_checkup_id = models.IntegerField(default=0,blank=True)  # Can be None
    pulse_rate = models.IntegerField()
    bp = models.CharField(max_length=6)
    temp = models.FloatField()
    weight = models.FloatField()
    age = models.IntegerField()
    confirmation = models.BooleanField(default=False)