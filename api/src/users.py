from workers import Response
import json
from facility.cors import response_header_cors
from facility.http_param import get_query_params

# method and path are not necessary
def get_users(request, method, path): 
  query_params = get_query_params(request)

  print(f"{method} {path}: {query_params}")
  data = [{"id": 1, "name": "innfi"}, {"id": 2, "name": "ennfi"}]
  return Response(json.dumps(data), headers=response_header_cors)

async def post_users(request, method, path):
  body = await request.json()
  print(f"post_users: {body.id}, {body.name}")

  return Response(f"{method} {path}", headers=response_header_cors)

user_routes = {
  'GET': get_users,
  'POST': post_users,
}
