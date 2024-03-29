
# Development
* [Codebase](#codebase)
    + [Technologies Overview](#technologies-overview)
    + [Repository Structure](#repository-structure)
* [GitHub CodeSpaces](#github-codespaces)
* [Local Development](#local-development)
    + [Prerequisites](#prerequisites)
    + [First Time Setup](#first-time-setup)
* [Building](#building)
    + [Building The Docker Image](#building-the-docker-image)


## Codebase

### Technologies Overview

- The app consists of a PWA built using **React**, and a monolithic server built using **NestJS**
- Data is cached in the browser using **LocalForage**, and stored server-side using **Postgres**
- The app state and data are managed using **Redux**
- **GraphQL** is used as a data layer
- Code is shared between the server and client using **Rushjs**

### Repository Structure

```
.
├── apps
│ ├── client             # Frontend SPA
│ └── server             # Server
│
├── libs
  ├── ctb-to-ahtml       # Converts ctb rich-text to a custom format
  ├── ahtml-to-html      # Renders rich-text as html
  ├── editor             # Rich-text editor
  │
  ├── components         # Reusable react components
  ├── icons wrapper      # Svg icons wrapper
  │
  ├── default-settings
  ├── hotkeys
  ├── graphql-types
  │
  ├── shared-helpers
  └── shared-styles
```

## GitHub CodeSpaces
You can use [GitHub Codespaces](https://docs.github.com/en/codespaces/developing-in-codespaces/creating-a-codespace) to quickly get started. The environment has all the required [development prerequisites](#prerequisites). It can be used in the browser or in [VS Code](https://docs.github.com/en/codespaces/developing-in-codespaces/using-codespaces-in-visual-studio-code#creating-a-codespace-in-visual-studio-code).

Start client development:

```sh
cd apps/client
rushx dev
```

Start server development:

```sh
cd apps/server
rushx dev
```

## Local Development

### Prerequisites

- [Node 14](./prerequisits.md#node)
- [Rushjs](./prerequisits.md#rushjs)
- [Postgres 12](./prerequisits.md#postgres)
- [SMTP server](./prerequisits.md#smtp-server) (optional)

### First Time Setup

Clone the repository:

```sh
git clone git@github.com:ycnmhd/cherryjuice.git
cd cherryjuice
```

> Note: the latest changes are in the **staging** branch.

Set required [environment variables](environment-variables.md) in a `.env` file placed at the root of the repository:

```dotenv
# .env 
DATABASE_URL=postgres://USER:PASSWORD@HOST:5432/DATABASE
```

Install dependencies and build local libraries:

```sh
rush update
rush build 
rush types
```

Start client development:

```sh
cd apps/client
rushx dev
```

Start server development:

```sh
cd apps/server
rushx dev
```

## Building

### Building The Docker Image

>Note: In addition to [the development prerequisites](#prerequisites), [Docker](./prerequisits.md#docker) is required.

Clone the repository:

```sh
git clone git@github.com:ycnmhd/cherryjuice.git
cd cherryjuice
```

Build the image:

```sh
# you can provide the image name as an argument (default is "cherryjuice")
rush update
rush build --to @cherryjuice/nest-server --to @cherryjuice/react-client
rush deploy
rush prepare-docker-context
rush build-docker
```

>Related: [Running the container](./running-locally.md#running-the-container).
