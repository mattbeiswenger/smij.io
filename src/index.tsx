import * as elements from "typed-html";
import { Elysia, t } from "elysia";
import { html } from "@elysiajs/html";
import { redis, ratelimit } from "./redis";
import { randomUUID } from "node:crypto";
import { BaseHtml } from "./components/BaseHtml";
import { Form } from "./components/Form";
import { Header } from "./components/Header";
import { Layout } from "./components/Layout";
import { ShortenedUrl } from "./components/ShortenedUrl";
import { base62 } from "./utils";
import config from "./config";

const cookie = t.Cookie({
  userSession: t.Optional(t.String()),
});

new Elysia()
  .use(html())
  .get(
    "/",
    async ({ html, cookie: { userSession } }) => {
      let { value: sessionId } = userSession;
      if (!sessionId) {
        sessionId = randomUUID();
        userSession.set({ value: sessionId });
      }
      const shortenedUrls = sessionId
        ? await redis.smembers(`session:${sessionId}`)
        : [];

      return html(
        <BaseHtml>
          <Layout>
            <Header />
            <Form />
            <ul id="shortened-urls" class="flex w-full max-w-xs flex-col gap-2">
              {shortenedUrls.map((url) => (
                <ShortenedUrl url={`${config.HOSTNAME}/${url}`} />
              ))}
            </ul>
          </Layout>
        </BaseHtml>
      );
    },
    { cookie }
  )
  .post(
    "/shorten",
    async ({ body: { url }, cookie: { userSession }, set }) => {
      const { value: sessionId } = userSession;
      // Use hardcoded identifier if session id is not set
      // Will update to use request ip once bun supports it
      const identifier = sessionId ?? "shorten";
      const { success } = await ratelimit.limit(identifier);
      if (success) {
        const count = await redis.incr("count");
        const hash = base62.encode(count);
        const p = redis.pipeline();
        p.setnx(hash, url);
        p.sadd(`session:${sessionId}`, hash);
        await p.exec();
        return <ShortenedUrl url={`${config.HOSTNAME}/${hash}`} />;
      }
      set.status = 429;
      return "Too many requests";
    },
    {
      type: "application/x-www-form-urlencoded",
      body: t.Object({
        url: t.RegExp("^(https?|ftp)://[^s/$.?#].[^s]*$"),
      }),
      cookie,
    }
  )
  .get(
    "/:hash",
    async ({ params: { hash }, set }) => {
      const url = await redis.get(hash);
      console.log(hash, url);
      if (url) {
        set.redirect = url;
      } else {
        set.status = 404;
        return "Not found";
      }
    },
    {
      params: t.Object({
        hash: t.String(),
      }),
    }
  )
  .get("/styles.css", () => Bun.file("./tailwind-gen/styles.css"))
  .listen(3000, () => console.log("🚀 Listening on port 3000..."));
