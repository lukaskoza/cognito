import { Elysia } from "elysia";
import { authModule } from "./modules/auth";
import { exceptionHandler } from "./modules/util/middlewares/exception-handler";
import { swagger } from "@elysiajs/swagger";
import env from "./config/env";

const app = new Elysia()
  // Global middlewares
  .use(swagger())
  .use(exceptionHandler)
  
  // Application modules
  .use(authModule)
  .listen(env.PORT);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
