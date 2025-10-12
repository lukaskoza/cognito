# Local development

## Requirements
- make
- docker
- docker compose

Tested os
- MacOS

## Setup
```
make start
```


# Technical notes

## Env variables
See `src/config/env.ts` for all available variables.
## Other notes
- `@/*` is used to import files from the src folder

## Module structure
```
src/
├── modules/
│   ├── auth/
│   │   ├── dto/            --> DTOs from service to response layer
│   │   ├── middlewares/    --> Elysia middlewares
│   │   ├── repositories/   --> Prisma repositories
│   │   ├── exceptions/     --> Exceptions
│   │   ├── types/          --> Types not connected with prisma or elysia
│   │   ├── services/       --> Business logic
│   │   ├── models/         --> Prisma models
│   │   ├── utils/          --> Utilities
│   │   ├── schema.ts       --> Elysia schema
│   │   ├── index.ts        --> Elysia module
```