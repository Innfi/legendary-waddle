from workers import Response
import json
from facility.cors import response_header_cors
from facility.http_param import get_query_params

async def post_records(request):
  body = await request.json()

async def get_records(request):
  return Response("get_records response")

record_routes = {
  'GET': get_records,
  'POST': post_records
}