import os
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

print("=== CHECKING PRODUCTION CREDENTIALS ===")

# 1. R2
import boto3
r2 = boto3.client(
    "s3",
    endpoint_url=os.getenv("R2_ENDPOINT"),
    aws_access_key_id=os.getenv("R2_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("R2_SECRET_ACCESS_KEY"),
    region_name="auto"
)
bucket = os.getenv("R2_BUCKET_NAME", "personas-vietnam")
try:
    resp = r2.list_objects_v2(Bucket=bucket, MaxKeys=5)
    keys = [o["Key"] for o in resp.get("Contents", [])]
    print(f"[SUCCESS] R2 bucket '{bucket}' accessible! Existing files: {keys}")
except Exception as e:
    print(f"[FAIL] R2 error: {e}")

# 2. OpenAI
import openai
client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
try:
    m = client.models.list()
    print("[SUCCESS] OpenAI connected successfully!")
except Exception as e:
    print(f"[FAIL] OpenAI error: {e}")

# 3. Resend
import httpx
resend_key = os.getenv("RESEND_API_KEY")
try:
    r = httpx.get("https://api.resend.com/api-keys", headers={"Authorization": f"Bearer {resend_key}"})
    print(f"[SUCCESS] Resend API connected! Status code: {r.status_code}")
except Exception as e:
    print(f"[FAIL] Resend error: {e}")

# 4. SePay Token check
sepay_token = os.getenv("SEPAY_API_TOKEN")
try:
    r_sepay = httpx.get("https://my.sepay.vn/userapi/transactions/list", headers={"Authorization": f"Apikey {sepay_token}"})
    print(f"[SUCCESS] SePay API connected! Status code: {r_sepay.status_code}")
except Exception as e:
    print(f"[FAIL] SePay error: {e}")

print("=== END CREDENTIAL CHECK ===")
