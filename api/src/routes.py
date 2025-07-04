from users import user_routes
from products import product_routes

routes = {
  '/users': user_routes,
  '/products': product_routes,
}

def get_handler(method, path):
  return routes.get(path, {}).get(method)