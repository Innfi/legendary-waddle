from urllib.parse import urlsplit, parse_qsl

def get_query_params(request):
  query = urlsplit(request.url).query
  return dict(parse_qsl(query))
