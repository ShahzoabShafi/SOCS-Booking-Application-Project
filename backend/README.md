## .env
provides the values for configuration.

## config/db.js
Uses the values from .env
Connects app to SQLite
Exports an object, db, that other programs can use

## server.js
This is the entry point and the main file of the backend. 
It starts the server and connects/configures everything.
It listens on a port for incoming requests.

## routes/
Endpoints are defined to redirect to certain functions.

## middleware/
Filters things before they reach routes.
Used for authentification.

## controllers/
Functions to actually carry out work live here.
Recieve input, interact with db, and send output.




## example to understand the backend project structure and workflow:

When a react request or html form enters the backend it hits server.js
server.js will process it and send it to the proper route
If you implemented middleware, data will be sent there before it gets sent to
Controllers, where endpoint is implemented, interacting with db set up in config.




