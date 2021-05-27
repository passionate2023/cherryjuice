### Required Variables
`DATABASE_URL` URL of a postgres database `postgres://USER:PASSWORD@HOST:5432/DATABASE`  

### Variables with default fallbacks
`JWT_SECRET` (secret)  
`JWT_EXPIRES_IN` (30d)  
`NODE_ENV` (production)  
`NODE_PORT` (3000): port number of the node server  
`CLIENT_PORT` (1236) port number of webpack dev server (relevant only in developement)  
`PORT` (4000) port number of the nginx reverse proxy (relevant for docker images)  
`NODE_SERVE_STATIC` (false) serve static assets using the server (relevant for executables)  
`NODE_REDIRECT_TO_HTTPS`  (false)  
`NODE_STS` (false)  

#### Required for email
`ASSETS_URL` URL of the client. used in password reset emails  
`EMAIL_HOST`  
`EMAIL_PASSWORD`  
`EMAIL_PORT`  
`EMAIL_SECURE`  
`EMAIL_SENDER`  
`EMAIL_USER`

#### Required for Google OAuth and Importing from Google Drive 
`SERVER_URL` URL of the server. used in oauth callback URLs  
`OAUTH_GOOGLE_CLIENT_ID`  
`OAUTH_GOOGLE_CLIENT_SECRET`  
