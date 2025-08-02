## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start


## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
.

This project is a simple event scheduling application built with NestJS and TypeORM. It allows users to create, retrieve, and process scheduled events.

- Swagger - API Documentation: Swagger for all endpoints.

i use this project structure : 

src
├── Web                          # Domain Controllers and Routes
│   ├── Controllers
│   │   └── [DomainName]
│   └── Middlewares
│
├── BL                           # Business Logic
│   └── [DomainName]
│       ├── [Service]
│       └── [DTOs]
│
├── DAL                          # Data Access Layer
│   ├── Repositories
│   │   ├── [DomainName]Repository
│   │   └── Generic              # Folder for generic implementations
│   ├── Entities
│   │   └── [Domains]
│   └── Data                     # Folder for Migrations and Seeded Data

