import express from "express";
import http from "node:http";
import { createBareServer } from "@tomphttp/bare-server-node";
import { rateLimit } from "express-rate-limit";
import path from "node:path";
import * as dotenv from "dotenv";
dotenv.config();

const __dirname = process.cwd();
const app = express();
const server = http.createServer();

app.set('trust proxy', 1);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10000,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  validate: { trustProxy: false },
  message: 'Too many requests from this IP, please try again after 15 minutes',
});

app.use(limiter);

const bareServer = createBareServer("/bare/v1/", {
  logErrors: false,
  localAddress: undefined,
  maintainer: {
    email: "snorlax@example.com"
  },
  http2: false,
  maxSockets: 10000
});
const PORT = process.env.PORT || 8080

function getIP(req) {
  return req.headers['x-forwarded-for']?.split(',')[0] || req.headers['x-real-ip'] || req.socket.remoteAddress;
}

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.static(path.join(__dirname, "static")));

app.get("/check-domain", (req, res) => {
  res.status(200).send("OK");
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "static", "index.html"));
});
app.get("/math", (req, res) => {
  res.sendFile(path.join(__dirname, "static", "games.html"));
});
app.get("/english", (req, res) => {
  res.sendFile(path.join(__dirname, "static", "apps.html"));
});
app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "static", "about.html"));
});
app.get("/settings", (req, res) => {
  res.sendFile(path.join(__dirname, "static", "settings.html"));
});
app.get("/changelog", (req, res) => {
  res.sendFile(path.join(__dirname, "static", "changelog.html"));
});
app.get("/portal", (req, res) => {
  res.sendFile(path.join(__dirname, "static", "loader.html"));
});
app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "static", "agloader.html"));
});
app.get("/snorlax", (req, res) => {
  res.sendFile(path.join(__dirname, "static/people-secrets/", "snorlax.html"));
});
app.get("/tlochsta", (req, res) => {
  res.sendFile(path.join(__dirname, "static/people-secrets/", "tlochsta.html"));
});
app.get("/fowntain", (req, res) => {
  res.sendFile(path.join(__dirname, "static/people-secrets/", "fowntain.html"));
});
app.get("/bigfoot", (req, res) => {
  res.sendFile(path.join(__dirname, "static/people-secrets/", "bigfoot.html"));
});
app.get("/burb", (req, res) => {
  res.sendFile(path.join(__dirname, "static/people-secrets/", "burb.html"));
});
app.get("/derpman", (req, res) => {
  res.sendFile(path.join(__dirname, "static/people-secrets/", "derpman.html"));
});
app.get("/cats", (req, res) => {
  res.sendFile(path.join(__dirname, "static/people-secrets/", "cats.html"));
});

app.use((req, res) => {
  res.statusCode = 404;
  res.sendFile(path.join(__dirname, './static/404.html'))
});

server.on("request", (req, res) => {
  const ip = getIP(req);
  Object.defineProperty(req.socket, 'remoteAddress', { value: ip, writable: true, configurable: true });
  if (req.connection) Object.defineProperty(req.connection, 'remoteAddress', { value: ip, writable: true, configurable: true });

  if (bareServer.shouldRoute(req)) {
    bareServer.routeRequest(req, res);
  } else {
    app(req, res);
  }
});

server.on("upgrade", (req, socket, head) => {
  const ip = getIP(req);
  Object.defineProperty(socket, 'remoteAddress', { value: ip, writable: true, configurable: true });
  if (socket.connection) Object.defineProperty(socket.connection, 'remoteAddress', { value: ip, writable: true, configurable: true });

  if (bareServer.shouldRoute(req)) {
    bareServer.routeUpgrade(req, socket, head);
  } else {
    socket.end();
  }
});



server.on("listening", () => {
  console.log(`Snorlax's Cave listening on port ${PORT}`);
});

server.listen({
  port: PORT,
});

