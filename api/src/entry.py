from workers import Response
from urllib.parse import urlparse

from facility.cors import handle_cors
from routes import get_handler

async def on_fetch(request, env):
  method = request.method
  if method == "OPTIONS":
    return handle_cors(request)

  handler = get_handler(request, method)
  if handler:
    return handler(request)
  else:
    return Response("not found", status=404)
