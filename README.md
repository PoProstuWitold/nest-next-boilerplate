# nest-next-boilerplate

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
yarn add
```

####  2.1
Create ``.env`` file in server root directory and fill with following:

```code
# APP
APP_ENV='dev'
APP_URL='http://localhost'
APP_PORT=4000
ORIGIN='http://localhost:3001'
SWAGGER=true
API_PREFIX='/api/v1/'

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
DB_SYNC=true


# GOOGLE
OAUTH_GOOGLE_ID=[YOUR_GOOGLE_OAUTH_ID]
OAUTH_GOOGLE_SECRET=[YOUR_GOOGLE_SECRET]
OAUTH_GOOGLE_REDIRECT_URL=[YOUR_GOOGLE_REDIRECT_URL] //may be relative

# FACEBOOK
OAUTH_FACEBOOK_ID=[YOUR_FACEBOOK_ID]
OAUTH_FACEBOOK_SECRET=[YOUR_FACEBOOK_SECRET]
OAUTH_FACEBOOK_REDIRECT_URL=[YOUR_FACEBOOK_REDIRECT_UR] //may be relative
``` 

### 3. Client setup
```bash
cd client 
```
```bash
npm install 
# OR 
yarn add
```


## TO DO
- [x] Setup Local login
- [x] Setup Google login
- [x] Setup Facebook login
- [ ] NextJS client app routing



## License
[MIT](https://choosealicense.com/licenses/mit/)