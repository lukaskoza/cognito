import { Elysia } from "elysia";
import { authModule } from "./modules/auth";
import { exceptionHandler } from "./modules/util/middlewares/exception-handler";
import { swagger } from "@elysiajs/swagger";

const app = new Elysia()
  // Global middlewares
  .use(swagger())
  .use(exceptionHandler)
  
  // Application modules
  .use(authModule)
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
