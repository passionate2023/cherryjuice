
## Postgres
### Install Postgres On Host Machine
Install Postgre:
- **Linux**: Follow [this](https://www.postgresqltutorial.com/install-postgresql-linux/) guide.
- **macOS**: Follow [this](https://www.postgresqltutorial.com/install-postgresql-macos/) guide.
- **Windows**: Follow [this](https://www.postgresqltutorial.com/install-postgresql/) guide.

Create a database 

```shell
$ psql -U USER -c "create database cj"
```

### Install Postgres using Docker-Compose

create a postgres folder

```sh
mkdir postgres
cd postgres
```

set a username and password in a `.env` file

```dotenv
POSTGRES_PASSWORD=password
POSTGRES_USER=user
```

create `docker-compose.yaml` file

```yaml
# Use postgres/example user/password credentials
version: '3.1'
services:
  postgres:
    restart: unless-stopped
    image: postgres
    ports:
      - 5432:5432/tcp
    env_file:
      - .env
    volumes:
      - ./data/:/var/lib/postgresql/data/
```

start the stack:

```sh
 sudo docker-compose up
```

exec into the container using the `POSTGRES_USER` you specified, and create a database:

```sh
 sudo docker exec -it `sudo docker ps -a -q --filter="name=postgres"` psql -U user -c "create database cj"
```

### SMTP Server
for development purposes, you can use a trap SMTP server, such as [maildev](https://github.com/maildev/maildev)  
```shell
npx maildev -w 3500 -s 25  --incoming-user me --incoming-pass me
```

with the following [environment variables](environment-variables.md#required-for-email):
```shell
EMAIL_HOST=0.0.0.0
EMAIL_PORT=25
EMAIL_USER=me
EMAIL_PASSWORD=me
EMAIL_SENDER=me@me.me
# URL of the frontend 
ASSETS_URL=http://localhost:3000
```

## Node 14
**Windows**: [https://github.com/coreybutler/nvm-windows](https://github.com/coreybutler/nvm-windows)  
**Mac** and **Linux**: [https://github.com/nvm-sh/nvm](https://github.com/nvm-sh/nvm)

## Rushjs
```sh
npm install -g @microsoft/rush
```

### Docker
[https://docs.docker.com/get-docker/]()  

### Docker Compose
[https://docs.docker.com/compose/install/]()
