import base64
from pathlib import Path

from aiohttp import web

import aiohttp_session
from aiohttp_session.cookie_storage import EncryptedCookieStorage

import aiohttp_cors

from .settings import Settings
from .views import index
from .api import deeds_get, characters_get
from .deeds import setup_deeds


THIS_DIR = Path(__file__).parent
BASE_DIR = THIS_DIR.parent


def setup_routes(app):
  app.router.add_get('/', index, name='index')


def setup_cors_routes(cors, app):
  resource = cors.add(app.router.add_resource('/deeds'))
  cors.add(resource.add_route('GET', deeds_get))

  resource = cors.add(app.router.add_resource('/characters'))
  cors.add(resource.add_route('GET', characters_get))


async def create_app():
  app = web.Application()
  settings = Settings()
  app.update(
    name='server',
    settings=settings
  )

  cors = aiohttp_cors.setup(app,defaults={
    "*": aiohttp_cors.ResourceOptions(
      allow_credentials=True,
      expose_headers="*",
      allow_headers="*",
    )
  })

  secret_key = base64.urlsafe_b64decode(settings.COOKIE_SECRET)
  aiohttp_session.setup(app, EncryptedCookieStorage(secret_key))

  setup_routes(app)
  setup_cors_routes(cors, app)
  await setup_deeds()
  return app
