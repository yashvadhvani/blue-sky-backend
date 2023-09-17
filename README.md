# Blue Sky Analytics Docker Compose Configuration

This Docker Compose configuration is designed to set up a development environment for Blue Sky Analytics. It consists of two services: `blue-sky-postgres` and `blue-sky-backend`. The former provides a PostgreSQL database with PostGIS extensions, while the latter is a backend server for Blue Sky Analytics.

## Prerequisites

Before you can use this Docker Compose configuration, make sure you have the following installed on your system:

- Docker: [Install Docker](https://docs.docker.com/get-docker/)
- Docker Compose: [Install Docker Compose](https://docs.docker.com/compose/install/)

## Getting Started

1. Clone the repository containing this Docker Compose file to your local machine.

2. Open a terminal and navigate to the directory where the `docker-compose.yml` file is located.

3. Run the following command to start the services:

   ```bash
   docker-compose up
   ```

   This will build the `blue-sky-backend` service and start both services.

4. Wait for the services to start. The `blue-sky-backend` service will automatically run migrations and start the backend server.

5. Once the services are up and running, you can access the Blue Sky Analytics backend at `http://localhost:3000`. The PostgreSQL database is available at `localhost:5432`.

## Service Details

### `blue-sky-postgres` Service

- PostgreSQL database with PostGIS extensions.
- Environment Variables:
  - `POSTGRES_DB`: The name of the database (blueanalytics).
  - `POSTGRES_USER`: The PostgreSQL username (postgres).
  - `POSTGRES_PASSWORD`: The PostgreSQL password (postgres).
- Healthcheck: Verifies if PostgreSQL is ready to accept connections.

### `blue-sky-backend` Service

- Node.js backend server for Blue Sky Analytics.
- Environment Variables:
  - `DB_HOST`: Hostname for the PostgreSQL database (blue-sky-postgres).
  - `DB_PORT`: PostgreSQL database port (5432).
  - `DB_USERNAME`: PostgreSQL username (postgres).
  - `DB_PASSWORD`: PostgreSQL password (postgres).
  - `DB_NAME`: Name of the PostgreSQL database (blueanalytics).
- Builds the backend code, runs migrations, and starts the server.
- Exposes the server on port 3000.

## Notes

- The `depends_on` directive in the `blue-sky-backend` service ensures that the backend service starts only after the PostgreSQL database service is up and running.

- The `restart: always` directive in the `blue-sky-backend` service ensures that the backend server restarts automatically if it encounters any issues.

- You can customize environment variables and configurations as needed in the `docker-compose.yml` file to match your specific requirements.

## Shutting Down

To stop the services and remove the containers, press `Ctrl+C` in the terminal where the services are running, and then run:

```bash
docker-compose down
```

## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

# Running The Migration

```bash
$ yarn run migrate
```
