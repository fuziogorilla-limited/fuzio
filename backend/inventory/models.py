from django.db import models

class Category(models.Model):
    name=models.CharField(max_length=100)
    description=models.TextField()
    image=models.ImageField(upload_to="images/", null=True, blank=True)
    is_active=models.BooleanField(default=True)
    date_added=models.DateTimeField(auto_now_add=True)

class Product(models.Model):
    category=models.ForeignKey(Category, on_delete=models.CASCADE, related_name="products")
    name=models.CharField(max_length=100)
    description=models.TextField()
    buying_price=models.DecimalField(max_digits=10, decimal_places=2)
    selling_price=models.DecimalField(max_digits=10, decimal_places=2)
    color=models.CharField(max_length=100)
    size=models.CharField(max_length=20)
    quantity=models.PositiveIntegerField()
    is_active=models.BooleanField(default=True)
    date_added=models.DateTimeField(auto_now_add=True)
    feature=models.BooleanField(default=False)

    def __str__(self):
        return f"{self.name} description: {self.description}"

    def total_value(self):
        return self.buying_price * self.quantity    