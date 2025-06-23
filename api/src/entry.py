from workers import Response
 
async def on_fetch(request, env):
  name = await env.spinach_kv.get("name")
  if name is None:
    return Response("key not found")

  return Response(name)
