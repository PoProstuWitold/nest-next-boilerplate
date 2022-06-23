# nest-next-boilerplate

NodeJS boilerplate for building fullstack applications in TypeScript, TypeORM, NestJS and NextJS

# Usage

###  0.
Create **``.env``** file in **``server``** root directory and fill with following:

```code
# APP
NODE_ENV='development'
APP_PORT=4000
ORIGIN='http://localhost:3000'
API_PREFIX='/api'

# JWT AUTH
JWT_ACCESS_SECRET_KEY='uAsBw6WxqD'
JWT_ACCESS_EXPIRATION_TIME='5m
JWT_REFRESH_SECRET_KEY='dwafagadfasdaw'
JWT_REFRESH_EXPIRATION_TIME='30d'

# DATABASE
# change if you running in a different way than the one written in docker compose file
DB_TYPE='postgres'
DB_USERNAME='admin'
DB_PASSWORD='admin'
DB_HOST='localhost'
DB_PORT=5432
DB_DATABASE='postgres-nest'
DB_SYNC=true

# REDIS
# change if you running in a different way than docker compose
REDIS_HOST='redis-main'
REDIS_PORT=6379

# GOOGLE
OAUTH_GOOGLE_ID=[YOUR_GOOGLE_OAUTH_ID]
OAUTH_GOOGLE_SECRET=[YOUR_GOOGLE_SECRET]
OAUTH_GOOGLE_REDIRECT_URL='/api/v1/auth/google/redirect'

# FACEBOOK
OAUTH_FACEBOOK_ID=[YOUR_FACEBOOK_ID]
OAUTH_FACEBOOK_SECRET=[YOUR_FACEBOOK_SECRET]
OAUTH_FACEBOOK_REDIRECT_URL='/api/v1/auth/facebook/redirect'
``` 
Create **``.env``** file in **``workers > queues``** root directory and fill with following:

```code
# MAIL
SMTP_USER=[YOUR_SMTP_USER]
SMPT_PASSWORD=[YOUR_SMTP_PASSWORD]

# REDIS
# change if you running in a different way than docker compose
REDIS_HOST='redis-main'
REDIS_PORT=6379
``` 

## With Docker
Run Docker containers

### 1. Docker
```bash
docker-compose up 
```

## Without Docker
### 1. Change contents of ``DATABASE`` and ``REDIS`` sections in env files
**``server``**
```code
...

# DATABASE
DB_TYPE=[YOUR_DB_TYPE]
DB_USERNAME=[YOUR_DB_USERNAME]
DB_PASSWORD=[YOUR_DB_PASSWORD]
DB_HOST=[YOUR_DB_HOST]
DB_PORT=[YOUR_DB_PORT]
DB_DATABASE=[YOUR_DB_DATABASE]
DB_SYNC=[true or false in dev mode, false in prod]

# REDIS
REDIS_HOST=[YOUR_REDIS_HOST]
REDIS_PORT=[YOUR_REDIS_PORT]

...
```

**``workers > queues``**
```code
...

# REDIS
REDIS_HOST=[YOUR_REDIS_HOST]
REDIS_PORT=[YOUR_REDIS_PORT]
```
### 2.1 Server setup
```bash
cd server 
```
```bash
npm install 
# OR 
yarn
```

### 2.2 Worker
```bash
cd workers 
```
```bash
cd queues 
```
```bash
npm install 
# OR 
yarn
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
- Jwt access token & refresh token
- Account confirmation
- Password recover
- Profile update

## TO DO
- [x] Local login
- [x] Google login
- [x] Facebook login
- [x] Client app routing
- [x] Write tests for API
- [x] Password recover & change features
- [x] Queues
- [x] Refresh tokens

## License
[MIT](https://choosealicense.com/licenses/mit/)
