from django.contrib.gis import admin
from django.contrib.gis.geos import Point
from django.conf import settings
from .models import Venue, Event, Organization, CzarApplication
import googlemaps


@admin.register(Venue)
class VenueAdmin(admin.OSMGeoAdmin):
    prepopulated_fields = {"slug": ("title",)}
    list_display = ['title', 'address', 'city', 'state']
    list_filter = ['state']


@admin.register(Organization)
class OrganizationAdmin(admin.OSMGeoAdmin):
    prepopulated_fields = {"slug": ("title",)}
    list_display = ['title', 'organization_type']
    list_filter = ['organization_type']


@admin.register(Event)
class EventAdmin(admin.OSMGeoAdmin):
    prepopulated_fields = {"slug": ("title",)}
    list_display = ['title', 'event_type']
    list_filter = ['event_type']
    save_as = True

@admin.register(CzarApplication)
class CzarApplicationAdmin(admin.OSMGeoAdmin):
    list_display = ['name_first', 'name_last', 'municipality', 'application_reviewed']
    list_filter = ['application_reviewed']
