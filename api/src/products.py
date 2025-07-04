from workers import Response

def get_products(request, method, path):
  return Response(f"{method} {path}")

def patch_products(request, method, path):
  return Response(f"{method} {path}")

product_routes= {
  'GET': get_products,
  'PATCH': patch_products,
}