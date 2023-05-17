import { Application, Router } from 'oak';

const app = new Application();

const router = new Router({ prefix: "/hello-world" });
router.get("/", (ctx) => {
  ctx.response.body = { message: "Hello world!" };
  ctx.response.status = 200;
});

app.use(router.routes());
app.use(router.allowedMethods());

app.addEventListener("listen", () => console.log("API is running on http://localhost:3000"));
await app.listen({ port: 3000 });
