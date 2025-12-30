import { createServer } from "node:http";
import { fileURLToPath } from "url";
import { hostname } from "node:os";
import { server as wisp, logging } from "@mercuryworkshop/wisp-js/server";
import Fastify from "fastify";
import fastifyStatic from "@fastify/static";
import { scramjetPath } from "@mercuryworkshop/scramjet/path";
import { epoxyPath } from "@mercuryworkshop/epoxy-transport";
import { baremuxPath } from "@mercuryworkshop/bare-mux/node";
import * as dotenv from "dotenv";
dotenv.config();

const publicPath = fileURLToPath(new URL("./static/", import.meta.url));

logging.set_level(logging.NONE);
Object.assign(wisp.options, {
  allow_udp_streams: false,
  hostname_blacklist: [/example\.com/],
  dns_servers: ["1.1.1.3", "1.0.0.3"]
});

const fastify = Fastify({
  serverFactory: (handler) => {
    return createServer()
      .on("request", (req, res) => {
        res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
        res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
        handler(req, res);
      })
      .on("upgrade", (req, socket, head) => {
        if (req.url.endsWith("/wisp/")) wisp.routeRequest(req, socket, head);
        else socket.end();
      });
  },
});

fastify.register(fastifyStatic, {
  root: publicPath,
  decorateReply: true,
});

fastify.register(fastifyStatic, {
  root: scramjetPath,
  prefix: "/scram/",
  decorateReply: false,
});

fastify.register(fastifyStatic, {
  root: epoxyPath,
  prefix: "/epoxy/",
  decorateReply: false,
});

fastify.register(fastifyStatic, {
  root: baremuxPath,
  prefix: "/baremux/",
  decorateReply: false,
});

fastify.get("/check-domain", (req, reply) => {
  reply.code(200).send("OK");
});

fastify.get("/math", (req, reply) => reply.sendFile("games.html"));
fastify.get("/english", (req, reply) => reply.sendFile("apps.html"));
fastify.get("/about", (req, reply) => reply.sendFile("about.html"));
fastify.get("/settings", (req, reply) => reply.sendFile("settings.html"));
fastify.get("/changelog", (req, reply) => reply.sendFile("changelog.html"));
fastify.get("/portal", (req, reply) => reply.sendFile("loader.html"));
fastify.get("/dashboard", (req, reply) => reply.sendFile("agloader.html"));

const secrets = ["snorlax", "tlochsta", "fowntain", "bigfoot", "burb", "derpman", "cats"];
secrets.forEach(s => {
  fastify.get(`/${s}`, (req, reply) => reply.sendFile(`people-secrets/${s}.html`));
});

fastify.setNotFoundHandler((req, reply) => {
  return reply.code(404).type('text/html').sendFile('404.html');
})

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

function shutdown() {
  fastify.close();
  process.exit(0);
}

let port = parseInt(process.env.PORT || "");
if (isNaN(port)) port = 8080;

fastify.listen({
  port: port,
  host: "0.0.0.0",
}).then(() => {
  console.log(`Snorlax's Cave listening on port ${port}`);
});
