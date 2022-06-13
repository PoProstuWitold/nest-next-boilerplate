# nest-next-boilerplate 
## (WORK IN PROGRESS; PROJECT IS IN VERY EARLY PHASE SO SOME FEATURES MAY NOT WORK AS INTENDED)

NodeJS boilerplate for building fullstack applications built in TypeScript, TypeORM, NestJS and NextJS

## Usage

Run Docker containers and use the package manager (**yarn** or **npm**) to install dependencies in server and client directories.

### 1. Docker
```bash
cd server 
```
```bash
docker-compose up 
```

### 2. Server setup
```bash
cd server 
```
```bash
npm install 
# OR 
yarn
```

####  2.1
Create ``.env`` file in server root directory and fill with following:

```code
# APP
NODE_ENV='development'
APP_URL='http://localhost'
APP_PORT=4000
ORIGIN='http://localhost:3000'
API_PREFIX='/api'

# JWT AUTH
JWT_ACCESS_SECRET_KEY='uAsBw6WxqD'
JWT_ACCESS_EXPIRATION_TIME=36000000

# DATABASE
DB_TYPE='postgres'
DB_USERNAME='admin'
DB_PASSWORD='admin'
DB_HOST='localhost'
DB_PORT=5432
DB_DATABASE='postgres-nest'
DB_SYNC=true // NEVER USE IT IN PRODUCTION ENVIRONMENT OR YOU MAY LOOSE YOUR DATA

# MAIL
SMTP_USER=[YOUR_SMTP_USER]
SMPT_PASSWORD=[YOUR_SMTP_PASSWORD]

# GOOGLE
OAUTH_GOOGLE_ID=[YOUR_GOOGLE_OAUTH_ID]
OAUTH_GOOGLE_SECRET=[YOUR_GOOGLE_SECRET]
OAUTH_GOOGLE_REDIRECT_URL='/api/v1/auth/google/redirect'

# FACEBOOK
OAUTH_FACEBOOK_ID=[YOUR_FACEBOOK_ID]
OAUTH_FACEBOOK_SECRET=[YOUR_FACEBOOK_SECRET]
OAUTH_FACEBOOK_REDIRECT_URL='/api/v1/auth/facebook/redirect'
``` 

### 3. Client setup
```bash
cd client 
```
```bash
npm install 
# OR 
yarn
```

## FEATURES
- Local login & register
- Social login & register using Google and Facebook
- Account confirmation
- Password recover
- Profile update

## TO DO
- [x] Local login
- [x] Google login
- [x] Facebook login
- [x] Client app routing
- [x] Write tests for API


## License
[MIT](https://choosealicense.com/licenses/mit/)
