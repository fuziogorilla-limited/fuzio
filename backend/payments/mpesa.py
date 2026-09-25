import base64
from datetime import datetime

import environ
import requests


env = environ.Env()


class MpesaService:

    def __init__(self):
        self.consumer_key = env("CONSUMER_KEY")
        self.consumer_secret = env("CONSUMER_SECRET")
        self.auth_url = env("SANDBOX_AUTH")
        self.stk_url = env("SANDBOX")
        self.callback_url = env("CALLBACK_URL")
        self.business_short_code = env("BUSINESS_SHORT_CODE",default="174379")
        self.passkey = env("MPESA_PASSKEY")
        self.transaction_type = env("TRANSACTION_TYPE",default="CustomerPayBillOnline")

    def get_access_token(self):
        response = requests.get(
            self.auth_url,
            auth=(
                self.consumer_key,
                self.consumer_secret
            ),
            timeout=30,
        )

        response.raise_for_status()
        return response.json()["access_token"]

    def generate_password(self, timestamp):
        data = (self.business_short_code + self.passkey + timestamp)
        encoded = base64.b64encode(data.encode("utf-8"))
        return encoded.decode("utf-8")

    def stk_push(self,amount,phone_number,account_reference,transaction_description):
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        password = self.generate_password(timestamp)
        access_token = self.get_access_token()
        payload = {
            "BusinessShortCode": int(self.business_short_code),
            "Password": password,
            "Timestamp": timestamp,
            "TransactionType": self.transaction_type,
            "Amount": int(amount),
            "PartyA": phone_number,
            "PartyB": int(self.business_short_code),
            "PhoneNumber": phone_number,
            "CallBackURL": self.callback_url,
            "AccountReference": account_reference,
            "TransactionDesc": transaction_description,
        }

        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json",
        }

        response = requests.post(
            self.stk_url,
            json=payload,
            headers=headers,
            timeout=30,
        )
        print("MPESA STATUS:", response.status_code)
        print("MPESA RESPONSE:", response.text)

        response.raise_for_status()

        return response.json()