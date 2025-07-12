import os
from cloudflare import Cloudflare

api_token=os.environ.get("CLOUDFLARE_API_TOKEN")
namespace_id=os.environ.get("CF_KV_NAMESPACE")
account_id=os.environ.get("CF_ACCOUNT_ID")

client = Cloudflare(api_token)

def get_value(keys):
  response = client.kv.namespaces.bulk_get(
    namespace_id,
    account_id,
    keys
  )

  return response
