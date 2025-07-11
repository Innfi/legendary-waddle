from products import product_routes
from records import record_routes
from urllib.parse import urlparse

routes = {
  'records': record_routes,
  'products': product_routes,
}

def get_handler(request, method):
  path = urlparse(request.url).path
  prefix = path.strip('/').split('/')
  
  print(f"get_handler] prefix: {prefix}")

  return routes.get(prefix[0], {}).get(method)