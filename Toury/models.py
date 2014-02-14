from django.db import models

class Marker(models.Model):
    latitude = models.DecimalField(decimal_places=17, max_digits=20)
    longitude = models.DecimalField(decimal_places=17, max_digits=20)
    radius = models.DecimalField(decimal_places=15, max_digits=20)
    title = models.CharField(max_length=50)
    description = models.TextField()

    def __unicode__(self):
        return "Lat: " + str(self.latitude) + "\n" + "Long: " + str(self.longitude) + "\n" + self.description