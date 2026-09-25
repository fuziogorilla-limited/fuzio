from django.db import models

class CustomerPayment(models.Model):
    mpesa_receipt_number=models.CharField(max_length=100, null=True)
    checkout_request_id=models.CharField(unique=True, max_length=100)
    account_reference=models.CharField()
    amount=models.PositiveIntegerField()
    party_a=models.CharField(max_length=15)

class PaymentStatus(models.Model):
    customer=models.ForeignKey(CustomerPayment, on_delete=models.PROTECT)
    merchant_request_id=models.CharField(max_length=100)
    checkout_request_id=models.CharField(max_length=100)
    response_code=models.CharField()
    response_description=models.CharField( max_length=200)

    def __str__(self):
        return f"{self.checkout_request_id}: {self.response_code}"

