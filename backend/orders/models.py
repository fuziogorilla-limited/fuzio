from django.db import models
import secrets
from inventory.models import Product
import uuid

class Cart(models.Model):
    cart_id=models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True)
    created_at=models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.cart_id)
    
class CartItem(models.Model):
    cart=models.ForeignKey(Cart, on_delete=models.CASCADE, related_name="items")
    product=models.ForeignKey(Product, on_delete=models.PROTECT)
    quantity=models.PositiveIntegerField(default=1)
    price=models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        constraints=[
            models.UniqueConstraint(
                fields=["cart", "product"],
                name="unique_product_per_cart"
            )
        ]

    def total_price(self):
        return self.price * self.quantity

    def __str__(self):
        return f"{self.product.name} x {self.quantity}"

class Order(models.Model):
    first_name=models.CharField(max_length=100)
    last_name=models.CharField(max_length=100)
    phone_number=models.CharField(max_length=20)
    email=models.EmailField(null=True, blank=True)
    county=models.CharField(max_length=100)
    town=models.CharField(max_length=100)
    address=models.CharField(max_length=100)
    additional_information=models.CharField(max_length=250, null=True, blank=True)

    order_number=models.CharField(unique=True, max_length=12, editable=False)
    created_at=models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.order_number:
            self.order_number = f"ORD-{secrets.token_hex(4).upper()}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Name:{self.first_name} Order:{self.order_number}"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey(Product, on_delete=models.PROTECT)
    quantity = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def total_price(self):
        return self.price * self.quantity

    def __str__(self):
        return f"{self.product.name} x {self.quantity}"