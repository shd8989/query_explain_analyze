# Environment
## Frontend
reactjs 18.2.0

## Backend
node v18.19.0<br>
npm 10.2.3

## Database
PostgreSQL 14.10
- PG기반 데이터베이스는 모두 활용 가능

# Project Build
## Nodejs install
1. wget https://nodejs.org/dist/v18.19.0/node-v18.19.0-linux-x64.tar.gz
2. tar zxvf node-v18.19.0-linux-x64.tar.gz
3. export PATH=$PATH:/opt/node-v18.19.0-linux-x64/bin

## Project Download
1. git clone https://github.com/shd8989/query_explain_analyze.git
2. cd query_explain_analyze
3. npm run setup
4. npm run start

# Docker Command(수정중)
## Docker build
docker build -f Dockerfile -t query_analyze:1.0 .

## Docker run
docker run -it --name query_analyze -p 4000:3000 query_analyze:1.0
