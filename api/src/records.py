from workers import Response
import json
from facility.cors import response_header_cors
from facility.http_param import get_query_params
from facility.kv_client import get_value

async def post_records(request):
  query_params = get_query_params(request)
  print(f"post_records] param: {query_params}")

  body = await request.json()
  print(f"post_records] body: {body}")

async def get_records(request):
  query_params = get_query_params(request)
  print(f"get_records] param: {query_params}")

  dummy_response = [
    { "workoutName": "workoutTest", "workoutSets": 1, "workoutReps": 5 },
    { "workoutName": "workoutTest", "workoutSets": 2, "workoutReps": 6 },
    { "workoutName": "workoutTest", "workoutSets": 2, "workoutReps": 7 },
  ]

  response = get_value(["name"])
  print(f"get_records] response: {response}")

  return Response(json.dumps(dummy_response), headers={
    "content-type": "application/json"
  })

record_routes = {
  'GET': get_records,
  'POST': post_records
}