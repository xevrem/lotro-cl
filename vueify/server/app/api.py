from aiohttp import web
from aiohttp_session import get_session

async def deeds_get(request):
  session = await get_session(request)
  
  return web.json_response([{'name':'c'},{'name':'d'}])

async def characters_get(request):
  session = await get_session(request)
  
  return web.json_response([{'name':'a'},{'name':'b'}])
