# nest-next-boilerplate
Boilerplate for Nest.js, Next.js, TypeScript stack. Includes social logins, account verification, password change & recover, real-time chats and more.

# Usage

###  0. Environmental variables
0.1. Create **``.env``** file in **``server``** root directory and fill with following:
```code
# APP
NODE_ENV='development'
APP_PORT=4000
ORIGIN='http://localhost:3000'
API_PREFIX='/api'

# JWT AUTH
JWT_ACCESS_SECRET_KEY='long-unpredictable-secret1'
JWT_ACCESS_EXPIRATION_TIME='5m'
JWT_REFRESH_SECRET_KEY='long-unpredictable-secret2'
JWT_REFRESH_EXPIRATION_TIME='30d'

# DATABASE
# change if you running in a different way than the one written in docker compose file
DB_TYPE='postgres'
DB_USERNAME='admin'
DB_PASSWORD='admin'
DB_HOST='postgres-main'
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
0.2. Create **``.env``** file in **``workers/queues``** root directory and fill with following:

```code
# MAIL
SMTP_USER=[YOUR_SMTP_USER]
SMPT_PASSWORD=[YOUR_SMTP_PASSWORD]

# REDIS
# change if you running in a different way than docker compose
REDIS_HOST='redis-main'
REDIS_PORT=6379
``` 
#### **Tip**
For free email testing you can use service such as [Mailtrap](https://mailtrap.io/).

## With Docker

### 1. Run Docker containers
```bash
docker compose up 
```

## Without Docker
### 1. Change contents of ``DATABASE`` and ``REDIS`` sections in ``env`` files
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

**``workers/queues``**
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
pnpm install 
# OR 
yarn
```

### 2.2 Worker
```bash
cd workers/queues
```
```bash
npm install 
# OR 
pnpm install 
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
pnpm install 
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
- Multiple themes with the ability to add your own
- Group chat with basic permissions
- Private chat (also with yourself)
- Rate limiting

## TECH STACK
- Backend:
    - Nest.js
    - PostgreSQL
    - Redis
    - WebSockets
    - JWT
    - Passport.js
- Frontend
    - Next.js
    - Tailwind & DaisyUI
    - Redux ([rematch](https://rematchjs.org/))
## TO DO
- [x] Local login
- [x] Google login
- [x] Facebook login
- [x] Client app routing
- [x] Write tests for API
- [x] Password recover & change features
- [x] Queues
- [x] Refresh tokens
- [X] Chat
- [ ] Make URL preview
- [ ] Enable sending images and maybe videos
- [ ] Public profile page
- [ ] Refactor chat backend & UI

## License
[MIT](https://choosealicense.com/licenses/mit/)
