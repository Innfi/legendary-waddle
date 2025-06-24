from workers import Response
from urllib.parse import urlparse
 
async def on_fetch(request, env):
  method = request.method

  url = urlparse(request.url)
  path = url.path

  if path == "/api/users":
    return Response(method + "/api/users")
  elif path == "/api/products":
    return Response(method + "/api/products")
  else:
    return Response(method + "not found", status=404)

  # name = await env.spinach_kv.get("name")
  # if name is None:
  #   return Response("key not found")

  # return Response(name)
