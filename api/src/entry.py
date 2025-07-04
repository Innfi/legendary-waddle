from workers import Response
from urllib.parse import urlparse

from facility.cors import handle_cors
from routes import get_handler

async def on_fetch(request, env):
  method = request.method
  if method == "OPTIONS":
    return handle_cors(request)

  path = urlparse(request.url).path

  handler = get_handler(method, path)
  if handler:
    return handler(request, method, path)
  else:
    return Response("not found", status=404)

  # name = await env.spinach_kv.get("name")
  # if name is None:
  #   return Response("key not found")

  # return Response(name)
