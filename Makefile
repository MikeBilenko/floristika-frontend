DOCKER_COMPOSE = docker-compose
build:
	$(DOCKER_COMPOSE) build

up:
	$(DOCKER_COMPOSE) up -d

down:
	$(DOCKER_COMPOSE) down

restart: stop start

clean:
	$(DOCKER_COMPOSE) down -v --remove-orphans
