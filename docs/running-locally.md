
# Running Locally
* [Docker Image](#docker-image)
    + [Prerequisites](#prerequisites)
    + [Running The Container](#running-the-container)
* [Executable](#executable)
    + [Prerequisites](#prerequisites-1)
    + [Running The Executable](#running-the-executable)


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

## Executable

### Prerequisites

- [Postgres 12](./prerequisits.md#postgres)

### Running The Executable

Download the binary for your platform from [the releases](https://github.com/ycnmhd/cherryjuice/releases) page.  
Extract the archive.  
Update the `.env` file inside the extracted folder with the required [environment variables](environment-variables.md):

```dotenv
#.env
DATABASE_URL=postgres://USER:PASSWORD@HOST:5432/DATABASE
```

Run the executable.
>The app should be available at port 3000.

>Related:  [building the executable](./development.md#building-the-executable).
