from django.db import models
import secrets
from inventory.models import Product
import uuid
from inventory.models import ProductVariant


class Cart(models.Model):
    cart_id = models.UUIDField(
        default=uuid.uuid4,
        editable=False,
        primary_key=True,
    )

    created_at = models.DateTimeField(auto_now_add=True)

    is_checked_out = models.BooleanField(default=False)

    checked_out_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    def __str__(self):
        return str(self.cart_id)


class CartItem(models.Model):
    cart = models.ForeignKey(
        Cart,
        on_delete=models.CASCADE,
        related_name="items",
    )

    variant = models.ForeignKey(
        ProductVariant,
        on_delete=models.PROTECT,
        related_name="cart_items",
    )

    quantity = models.PositiveIntegerField()

    # Snapshot of price at the time it entered the cart
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["cart", "variant"],
                name="unique_variant_per_cart",
            )
        ]

    @property
    def total_price(self):
        return self.price * self.quantity

    def __str__(self):
        return (
            f"{self.variant.product.name} "
            f"- {self.variant.color}/{self.variant.size} "
            f"x {self.quantity}"
        )

class Order(models.Model):

    class Status(models.TextChoices):
        PENDING_PAYMENT = "pending_payment", "Pending Payment"
        PAID = "paid", "Paid"
        PROCESSING = "processing", "Processing"
        SHIPPED = "shipped", "Shipped"
        DELIVERED = "delivered", "Delivered"
        CANCELLED = "cancelled", "Cancelled"
        PAYMENT_FAILED = "payment_failed", "Payment Failed"

    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)

    phone_number = models.CharField(max_length=20)

    email = models.EmailField(
        blank=True,
        null=True,
    )

    county = models.CharField(max_length=100)
    town = models.CharField(max_length=100)
    address = models.CharField(max_length=255)

    additional_information = models.CharField(
        max_length=500,
        blank=True,
        null=True,
    )

    order_number = models.CharField(
        unique=True,
        max_length=20,
        editable=False,
        db_index=True,
    )

    status = models.CharField(
        max_length=30,
        choices=Status.choices,
        default=Status.PENDING_PAYMENT,
        db_index=True,
    )

    total_amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
        db_index=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    # Used for safe guest order lookup
    public_token = models.UUIDField(
        default=uuid.uuid4,
        unique=True,
        editable=False,
    )

    def save(self, *args, **kwargs):
        if not self.order_number:
            self.order_number = (
                f"ORD-{secrets.token_hex(5).upper()}"
            )

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.order_number} - {self.first_name}"

class OrderItem(models.Model):
    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name="items",
    )

    variant = models.ForeignKey(
        ProductVariant,
        on_delete=models.PROTECT,
        related_name="order_items",
    )

    quantity = models.PositiveIntegerField()

    # Price at time of purchase
    price = models.DecimalField(
        max_digits=12,
        decimal_places=2,
    )

    # Historical snapshots
    product_name = models.CharField(
        max_length=150,
    )

    color = models.CharField(
        max_length=100,
    )

    size = models.CharField(
        max_length=50,
    )

    @property
    def total_price(self):
        return self.price * self.quantity

    def __str__(self):
        return (
            f"{self.product_name} "
            f"{self.color}/{self.size} "
            f"x {self.quantity}"
        )