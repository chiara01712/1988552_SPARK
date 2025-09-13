This project is built using a microservices architecture with **Node.js**, **Express**, **Sequelize**, and **RabbitMQ**, running inside **Docker** containers.

## Technologies used:
*Sequelize*: ORM for Node.js supporting relational databases, which uses the Javascript language. It allows defining database models, executing queries, and syncing data with the db.  
*Express*: a framework for Node.js which simplifies the development of web applications and APIs. It provides a series of features for handling HTTP requests, defining routes, managing request and response parameters.  
*Node.js*: is a runtime environment for executing JavaScript code on the server side.  

## Setup:  
To create and start the Docker containers defined in docker-compose.yml, run the following command:   
`docker-compose up --build`   
Using the --build option also builds the images for the services specified in the docker-compose.yml file.

To initialize a Node.js project and create a package.json file with default settings, use the following command:
`npm init -y`

### Packages to install: 

`npm i bcryptjs body-parser cookie-parser cors dotenv express jsonwebtoken nodemon path pg sequelize amqplib multer`   

## PgAdmin connection:
To connect to the PostgreSQL database using PgAdmin, follow these steps:
- Create a new server in PgAdmin:
- Go to Connection:
    - Host name/address: localhost
    - Port: 5432
    - Maintenance database: usersdb (or students or coursesdb depending on the microservice)
    - Username: user
    - Password: password

# Project structure:  
Each microservice has its own folder (e.g., user-service) containing:
- The **public/** folder which contains the static assets (HTML, CSS) and client-side JavaScript files
- The **src/** folder for server-side JavaScript files, in particular:
    - *microservice*_repo.js: for database queries
    - *microservice*_route.js: contains the routes of the microservice and the functions to handle HTTP requests
    - *microservice*_service.js: manages the logic of the microservice connecting repo.js and route.js
    - *microservice*.js: contains the definition of the sequelize models (each model represents a table in the database)
- In the src folder there is a **rabbitmq/** folder that contains the files for the communication between microservices via RabbitMQ:
    - producer.js: file that contains the functions to produce messages to RabbitMQ
    - consumer.js: file that contains the functions to consume messages from RabbitMQ
    - *microservice-s*.js: file that contains the functions to manage the communication between microservices via RabbitMQ (produce and consume)
- File **package.json** to define the necessary packages for the microservice and the scripts to start the microservice.
- File **Dockerfile** to define how to build the microservice image
- File **index.js** to start the microservice server listening on a specific port.
- File **config.js** to define the configuration of RabbitMQ
- File **docker-compose.yml** to define the services (microservices) and their dependencies, the network, and the database. For each service it is specified the Dockerfile to use to build the service image, the ports to expose, environment variables, and dependencies on other services. Additionally, a volume is defined for the database so that data persists even after the container is closed.


## Microservices:
1. User-service (8080)
2. Student-service (7070)
3. Course-service (professor)(6060)


# RabbitMQ  
### Communication between microservices:

The client (microservice that needs to request resources/data) and the RPC Server (the microservice that needs to provide resources/data) communicate through RabbitMQ using two queues: rpcQueue and replyQueue. The rpcQueue is used by the client to send requests to the RPC server, while the replyQueue is used by the RPC server to send responses back to the client.

### Data flow between microservices:
- The client (microservice that needs to request resources/data):
    1. The client sends an HTTP request to /*something* (e.g. `/getUsername`)
    2. The request is handled in the *microservice*_route.js of the client, which calls the produce
    3. The produce is defined in the file microservice-s.js, which calls `produceMessage(data)`, where data are the data extracted from the HTTP request
    4. The `produceMessage(data)` is defined in producer.js, and starting from the data in the HTTP request, it pushes request into the rpcQueue.

- The RPC Server (microservice that should provide resources/data)
    1. In consumer.js:
        -  the function `consumeMessage` is defined, which through `this.channel.consume` is always listening to consume new messages arriving in the rpcQueue.
        - A database query is made to obtain the data requested by the client
        - The produce is called
    2. In producer.js, the data are produced on the replyQueue (which had been passed by the client in the request as a response channel)

- The Client (microservice that needs to request resources/data)  
    - In consumer.js, the function `consumeMessage` is defined, which through `this.channel.consume` is always listening to consume new messages arriving in the replyQueue.
 

In this project we used two different queues (defined in config.js):
- rpcQueue: is the queue on which user-service listens to requests from other microservices
- rpcQueueC: is the queue on which course-service listens to requests from other microservices


# Authentication 

The authentication is done using JWT (JSON Web Token) and cookies. The token is generated when the user logs in and is sent to the client, which stores it in a cookie. For subsequent requests, the client sends the token in the cookie, and the server verifies it to authenticate the user.
1. Token generation:  
    When the user sends email and password (POST request to /login in access.js), the server (user_route.js which calls user_service.js) verifies the credentials (the password is verified with bcrypt), and if they are correct, a JWT (JSON Web Token) is generated using the jsonwebtoken library (jwt.sign()). The token contains the user's information and is signed with a secret key (ACCESS_TOKEN_SECRET).
    To create the ACCESS_TOKEN_SECRET in the .env we used ` require('crypto').randomBytes(64).toString('hex')` in node. The .env is not loaded in git, so it should be created locally for each microservice. The access_token is saved in cookies (res.cookie in user_service.js).
2. Request authentication:  
    When the client sends a request to a microservice (for example when it wants to access the home of student-service), the microservice extracts the access_token from the cookies and verifies it (jwt.verify()). If the token is valid, the microservice can accept the request and proceed with the requested operation.

