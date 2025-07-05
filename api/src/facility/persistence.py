
# TODO: dependency injection?
async def get_value(env, key):
  name = await env.spinach_kv.get(key)

  return name