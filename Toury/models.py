from django.db import models

class Tour(models.Model):
    name = models.CharField(max_length=50)

    def __unicode__(self):
        return self.name

    def natural_key(self):
        return (self.name)

class Marker(models.Model):
    latitude = models.DecimalField(decimal_places=17, max_digits=20)
    longitude = models.DecimalField(decimal_places=17, max_digits=20)
    radius = models.DecimalField(decimal_places=15, max_digits=20)
    title = models.CharField(max_length=50)
    direction = models.DecimalField(decimal_places=10, max_digits=15, null=True)
    description = models.TextField()
    tour = models.ForeignKey(Tour, related_name='markers')

    def __unicode__(self):
        return "Lat: " + str(self.latitude) + "\n" + "Long: " + str(self.longitude) + "\n" + self.description

    def natural_key(self):
        return (self.title,self.description)
