from workers import Response

async def handle_cors(request):
  if "Origin" in request.headers and "Access-Control-Request-Method" in request.headers and "Access-Control-Request-Headers" in request.headers:
    return Response("", headers={
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
      "Access-Control-Max-Age": "86400",
      "Access-Control-Allow-Headers": request.headers["Access-Control-Request-Headers"]
    })

  return Response("", headers={"Allow": "GET, HEAD, POST, OPTIONS"})

response_header_cors = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "http://localhost:5173"
}