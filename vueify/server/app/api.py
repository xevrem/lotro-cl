from aiohttp import web
from aiohttp_session import get_session
import aiofiles
from .deeds import deeds
# import json

async def deeds_get(request):
  session = await get_session(request)

  return web.json_response(deeds)
  # return web.Response(body=deeds, content_type='application/json')

async def characters_get(request):
  session = await get_session(request)
  async with aiofiles.open('data/characters.json', mode='rb') as f:
    data = await f.read()

  return web.Response(body=data, content_type='application/json')

# async def deeds_subcategory(request):
#   session = await get_session(request)
  
#   return web.json_response()