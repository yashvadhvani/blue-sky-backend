# Blue Sky Analytics Docker Compose Configuration

This Docker Compose configuration is designed to set up a development environment for Blue Sky Analytics. It consists of two services: `blue-sky-postgres` and `blue-sky-backend`. The former provides a PostgreSQL database with PostGIS extensions, while the latter is a backend server for Blue Sky Analytics.

## Prerequisites

Before you can use this Docker Compose configuration, make sure you have the following installed on your system:

- Docker: [Install Docker](https://docs.docker.com/get-docker/)
- Docker Compose: [Install Docker Compose](https://docs.docker.com/compose/install/)
- ADD Env values if running in local or docker. Please update .env or Environment Variables in docket [MANDETORY]

## Getting Started

1. Clone the repository containing this Docker Compose file to your local machine.

2. Open a terminal and navigate to the directory where the `docker-compose.yml` file is located.

3. Run the following command to start the services:

   ```bash
   docker-compose up --build
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
  - `POSTGRES_PASSWORD`: The PostgreSQL password.
- Healthcheck: Verifies if PostgreSQL is ready to accept connections.

### `blue-sky-backend` Service

- Node.js backend server for Blue Sky Analytics.
- Environment Variables:
  - `DB_HOST`: Hostname for the PostgreSQL database (blue-sky-postgres).
  - `DB_PORT`: PostgreSQL database port (5432).
  - `DB_USERNAME`: PostgreSQL username (postgres).
  - `DB_PASSWORD`: PostgreSQL password .
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

## Running the app Locally without docker

```bash
# Prodcution
$ yarn run build
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

## API Documentation

Welcome to the API documentation for our project! Our API documentation is automatically generated using OpenAPI 3.0, providing you with up-to-date information about our API.

### Accessing API Docs

To access the automatically generated API documentation, follow these simple steps:

1. Start the application if it's not already running.

2. Open your web browser or API client of choice.

3. In the address bar, enter the following URL:

   ```
   http://localhost:3000/api-docs
   ```

   If your application is hosted on a different server or port, replace `localhost:3000` with the appropriate host and port.

4. Press Enter or navigate to the URL.

### Exploring the Documentation

Our API documentation is automatically generated using OpenAPI 3.0, providing detailed information about the available API endpoints, request methods, request and response formats, and any authentication requirements. You can use this documentation to:

- Understand how to interact with our API.
- Explore the available endpoints and their functionality.
- Test API requests and responses directly from the documentation.
- Learn about authentication methods, if applicable.

# Hosting

I have been using EC2 + GITHUB actions which makes this process a bit easier and stable. Using Amazon Elastic Compute Cloud (EC2) instances in conjunction with GitHub Actions provides a flexible and scalable infrastructure for deploying and automating various tasks in your software development workflow. Below, I'll outline the steps involved and the benefits of using EC2 instances with GitHub Actions.

**Steps for Using EC2 with GitHub Actions:**

1. **Create an EC2 Instance**:

   - Start by creating an EC2 instance on AWS with the necessary specifications for your project.

2. **SSH Access**:

   - Set up SSH key pairs to allow secure access to your EC2 instance. Keep the private key secure on your local machine.

3. **Configure Security Groups**:

   - Configure security groups for your EC2 instance to control inbound and outbound traffic, allowing access on the ports required for your application.

4. **Install Dependencies**:

   - SSH into your EC2 instance and install any necessary dependencies for your application, such as Node.js, databases, and other runtime requirements.

5. **Set Up Your Application**:

   - Clone your GitHub repository onto the EC2 instance.
   - Configure environment variables, secrets, and any other settings required for your application.

6. **GitHub Actions Workflow**:

   - Create a GitHub Actions workflow in your repository by adding a YAML file to the `.github/workflows` directory.
   - Define the workflow triggers (e.g., push, pull request, schedule) and specify the steps to execute.

7. **SSH Deployment Step**:

   - Include an SSH deployment step in your GitHub Actions workflow. This step involves using your SSH private key to securely connect to your EC2 instance and trigger actions like pulling the latest code, running tests, or deploying the application.

8. **Post-Deployment Actions**:
   - After deployment, you can perform additional actions, such as restarting services, clearing caches, or notifying team members, as needed.
