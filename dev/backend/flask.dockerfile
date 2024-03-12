FROM python:3.6

WORKDIR /app

COPY requirements.txt /app
RUN pip install -r requirements.txt

COPY . .
EXPOSE 4000
CMD [ "flask", "run", "--host=0.0.0.0", "--port=4000"]