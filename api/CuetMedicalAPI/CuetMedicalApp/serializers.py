from rest_framework import serializers
from .models import User, Doctor, EBooklet, DaySlot, Roster, Prescription
from django.contrib.auth import authenticate

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'first_name', 'last_name', 'gender','department','phone','permanent_address','hall_name','room_no','image','blood_group','transaction_id','verified')

class CreateUserSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(use_url= True)
    class Meta:
        model = User
        fields = '__all__'
        extra_kwargs = {
            'password': {'required': True}
        }

    def validate(self, attrs):
        id = attrs.get('id', '').strip().lower()
        if User.objects.filter(id=id).exists():
            raise serializers.ValidationError('User with this id already exists.')
        return attrs

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
    
class UpdateUserSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(use_url= True)
    class Meta:
        model = User
        fields = ('email','password', 'first_name', 'last_name','department','phone','permanent_address','hall_name','room_no','image','verified')

    def update(self, instance, validated_data):
        password = validated_data.pop('password')
        if password:
            instance.set_password(password)
        instance = super().update(instance, validated_data)
        return instance
    
class LoginSerializer(serializers.Serializer):
    id = serializers.CharField()
    password = serializers.CharField(style={'input_type': 'password'}, trim_whitespace=False)

    def validate(self, attrs):
        id = attrs.get('id')
        password = attrs.get('password')

        if not id or not password:
            raise serializers.ValidationError("Please give both email and password.")

        if not User.objects.filter(id=id).exists():
            raise serializers.ValidationError('id does not exist.')

        user = authenticate(request=self.context.get('request'), id=id,
                            password=password)
        if not user:
            raise serializers.ValidationError("Wrong Credentials.")

        attrs['user'] = user
        return attrs
    
'''User'''
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'


'''DOCTOR'''
class DoctorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Doctor
        fields = '__all__'

'''EBOOKLET'''
class Sub_StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'first_name', 'last_name', 'department', 'phone', 'permanent_address', 'blood_group', 'hall_name','room_no')

class EBookletSerializer(serializers.ModelSerializer):
    class Meta:
        model = EBooklet
        fields = '__all__'
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['student'] = Sub_StudentSerializer(instance.student).data
        return representation

'''DAYSLOT'''
class DaySlotSerializer(serializers.ModelSerializer):
    class Meta:
        model = DaySlot
        fields = '__all__'

'''ROSTER'''
class Sub_DoctorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Doctor
        fields = ('doctor_id', 'doctor_name')  # Include only necessary fields

class Sub_DaySlotSerializer(serializers.ModelSerializer):
    class Meta:
        model = DaySlot
        fields = ('day', 'slot')

class RosterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Roster
        fields = '__all__'
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['doctor'] = Sub_DoctorSerializer(instance.doctor).data
        representation['dayslot'] = Sub_DaySlotSerializer(instance.dayslot).data
        return representation
    def validate(self, data):
        existing_roster = Roster.objects.filter(
            dayslot=data['dayslot'], month=data['month'], year=data['year']
        ).first()
        if existing_roster:
            raise serializers.ValidationError("This dayslot, month, and year combination already exists.")
        return data

'''PRESCRIPTION'''
class PrescriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prescription
        fields = '__all__'
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['doctor'] = Sub_DoctorSerializer(instance.doctor).data
        representation['booklet'] = EBookletSerializer(instance.booklet).data
        return representation
    

""" 1804066
Abdus salam
ME
salamAbdus@gmail.com
01581234444
23/A, Jame mosjid, Anderkillah, Chattogram
M
Shiekh Russel Hall
310
O+
DC12V9X44
qwerty """