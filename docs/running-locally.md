
# Running Locally
* [Docker Image](#docker-image)
    + [Prerequisites](#prerequisites)
    + [Running The Container](#running-the-container)


## Docker Image

### Prerequisites

- [Postgres 12](./prerequisits.md#postgres)
- [Docker](./prerequisits.md#docker)

### Running The Container

Set required [environment variables](environment-variables.md) in a `.env` file:

```dotenv
# .env
DATABASE_URL=postgres://USER:PASSWORD@host.docker.internal:5432/DATABASE
```

Run the container:
```sh
sudo docker run  --pull=always --env-file=.env -p 80:4000 --add-host=host.docker.internal:host-gateway ghcr.io/ycnmhd/cherryjuice/app-master:latest
```
>The app should be available at port 80.

>Related: [building the docker image](./development.md#building-the-docker-image).
