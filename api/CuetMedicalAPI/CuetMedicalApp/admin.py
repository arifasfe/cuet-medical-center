from django.contrib import admin
from .models import *

admin.site.register(User)
# Register your models here.
admin.site.register(Doctor)
admin.site.register(EBooklet)
admin.site.register(Prescription)
admin.site.register(Roster)
admin.site.register(DaySlot)
