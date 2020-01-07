FROM python:3.7-alpine
WORKDIR /data
COPY . /data
RUN pip install pipenv\
  pipenv sync
CMD ["pipenv", "run", "python", "manage.py", "runserver", "0:8000"]
