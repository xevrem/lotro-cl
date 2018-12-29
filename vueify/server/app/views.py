from aiohttp import web


# in the name of brevity we return stripped down html, this works fine on chrome but shouldn't be used in production
# the <body> tag is required to activate aiohttp-debugtoolbar.
BASE_PAGE = """\
<title>{title}</title>
<head>
<link href="{styles_css_url}" rel="stylesheet">
</head>
<body>
<main>
  <h1>{title}</h1>
  {content}
</main>
</body>"""


async def index(request):
    """
    This is the view handler for the "/" url.

    **Note: returning html without a template engine like jinja2 is ugly, no way around that.**

    :param request: the request object see http://aiohttp.readthedocs.io/en/stable/web_reference.html#request
    :return: aiohttp.web.Response object
    """
    ctx = dict(
        title=request.app['name'],
        styles_css_url=request.app['static_root_url'] + '/styles.css',
        content="<p>Success! you've setup a basic aiohttp app.</p>",
    )
    # with the base web.Response type we have to manually set the content type, otherwise text/plain will be used.
    return web.Response(text=BASE_PAGE.format(**ctx), content_type='text/html')

