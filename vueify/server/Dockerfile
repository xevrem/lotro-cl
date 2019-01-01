FROM python:3.7
RUN pip3 install pipenv
COPY . /data
WORKDIR /data
RUN pipenv install
# ENV AIO_APP_PATH="app/"
# ENV AIO_STATIC_PATH="static/"
# ENV APP_COOKIE_SECRET="I3jFLQAZFWqt1DIOi3M9iv8_UR-l3iB1MA-W8QlTotU="
ENTRYPOINT ["/usr/bin/env","pipenv"]
