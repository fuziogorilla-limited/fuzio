from django.core.validators import MinValueValidator
from django.db import models


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    image = models.ImageField(
        upload_to="categories/",
        null=True,
        blank=True,
    )
    is_active = models.BooleanField(default=True)
    date_added = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


class Product(models.Model):
    category = models.ForeignKey(
        Category,
        on_delete=models.PROTECT,
        related_name="products",
    )
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)

    buying_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)],
    )
    selling_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)],
    )

    image = models.ImageField(
        upload_to="products/",
        null=True,
        blank=True,
    )

    is_active = models.BooleanField(default=True)
    feature = models.BooleanField(default=False)
    date_added = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-date_added"]
        indexes = [
            models.Index(fields=["category", "is_active"]),
            models.Index(fields=["is_active", "feature"]),
            models.Index(fields=["date_added"]),
        ]

    def __str__(self):
        return self.name

    @property
    def total_quantity(self):
        return sum(variant.quantity for variant in self.variants.all())

    @property
    def total_value(self):
        return self.buying_price * self.total_quantity


class ProductVariant(models.Model):
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name="variants",
    )

    color = models.CharField(max_length=100)
    size = models.CharField(max_length=50)

    quantity = models.PositiveIntegerField(default=0)

    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["color", "size"]
        constraints = [
            models.UniqueConstraint(
                fields=["product", "color", "size"],
                name="unique_product_color_size",
            ),
        ]
        indexes = [
            models.Index(fields=["product", "is_active"]),
            models.Index(fields=["color"]),
            models.Index(fields=["size"]),
        ]

    def __str__(self):
        return f"{self.product.name} - {self.color} / {self.size}"