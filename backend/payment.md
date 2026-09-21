from django.db import transaction
from rest_framework.exceptions import ValidationError

@transaction.atomic
def finalize_paid_order(order_id):

    order = Order.objects.select_for_update().get(
        id=order_id
    )

    if order.status == Order.Status.PAID:
        # Idempotency:
        # payment callback may have been sent twice.
        return order

    if order.status != Order.Status.PENDING_PAYMENT:
        raise ValidationError(
            "Order cannot be paid in its current state."
        )

    order_items = (
        order.items
        .select_related("variant")
        .select_for_update()
    )

    for item in order_items:

        variant = item.variant

        if variant.quantity < item.quantity:
            order.status = Order.Status.PAYMENT_FAILED
            order.save(
                update_fields=["status"]
            )

            raise ValidationError(
                f"Insufficient stock for "
                f"{item.product_name} "
                f"{item.color}/{item.size}."
            )

    for item in order_items:

        variant = item.variant

        variant.quantity -= item.quantity

        variant.save(
            update_fields=["quantity"]
        )

    order.status = Order.Status.PAID

    order.save(
        update_fields=["status"]
    )

    return order
