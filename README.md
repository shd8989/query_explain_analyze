# Environment
## Frontend
reactjs 18.2.0

## Backend
node v18.19.0<br>
npm 10.2.3

## Database
PostgreSQL 14.10

# Docker Command
## Docker build
docker build -f Dockerfile -t query_analyze:1.0

## Docker run
docker run -it --name query_analyze -p 4000:3000 query_analyze:1.0
