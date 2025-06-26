from workers import Response
from urllib.parse import urlparse, urlsplit, parse_qsl

def get_users(request, path, method):
  query = urlsplit(request.url).query
  query_params = dict(parse_qsl(query))

  return Response(f"{method} {path}: {query_params}")

def post_users(request, path, method):
  return Response(f"{method} {path}")

def get_products(request, path, method):
  return Response(f"{method} {path}")

def patch_products(request, path, method):
  return Response(f"{method} {path}")

routes = {
  '/users': {
    'GET': get_users,
    'POST': post_users,
  },
  '/products': {
    'GET': get_products,
    'PATCH': patch_products,
  },
}

async def on_fetch(request, env):
  method = request.method
  url = urlparse(request.url)
  path = url.path

  handler = routes.get(path, {}).get(method)
  if handler:
    return handler(request, path, method)
  else:
    return Response("not found", status=404)

  # name = await env.spinach_kv.get("name")
  # if name is None:
  #   return Response("key not found")

  # return Response(name)
