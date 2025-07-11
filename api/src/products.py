from workers import Response

def get_products(request):
  return Response("get_products")

def patch_products(request):
  return Response("patch_products")

product_routes= {
  'GET': get_products,
  'PATCH': patch_products,
}