from workers import Response
from urllib.parse import urlparse, urlsplit, parse_qsl
import json

def get_users(request, path, method):
  query = urlsplit(request.url).query
  query_params = dict(parse_qsl(query))

  print(f"{method} {path}: {query_params}")
  data = [{"id": 1, "name": "innfi"}, {"id": 2, "name": "ennfi"}]
  return Response(json.dumps(data), headers={
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "http://localhost:5173"
  })

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

async def handle_cors(request):
  if "Origin" in request.headers and "Access-Control-Request-Method" in request.headers and "Access-Control-Request-Headers" in request.headers:
    return Response.new(None, headers={
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
      "Access-Control-Max-Age": "86400",
      "Access-Control-Allow-Headers": request.headers["Access-Control-Request-Headers"]
    })

  return Response.new(None, headers={"Allow": "GET, HEAD, POST, OPTIONS"})


async def on_fetch(request, env):
  method = request.method
  if method == "OPTIONS":
    return handle_cors(request)

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
