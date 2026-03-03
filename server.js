try { require("dotenv").config(); } catch (_) {}
const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const PORT = process.env.PORT || 3000;
const TOSS_SECRET = process.env.TOSS_SECRET_KEY || "";

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript",
  ".json": "application/json",
  ".css": "text/css",
};

const orders = new Map();

function orderId() {
  return crypto.randomBytes(12).toString("base64url");
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || "/", `http://localhost:${PORT}`);
  const pathname = url.pathname === "/" ? "/checkout.html" : url.pathname;

  if (req.method === "GET" && !pathname.startsWith("/api")) {
    const file = path.join(__dirname, pathname);
    const ext = path.extname(file);
    if (!fs.existsSync(file) || !fs.statSync(file).isFile()) {
      res.writeHead(404);
      res.end("Not Found");
      return;
    }
    res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
    res.end(fs.readFileSync(file));
    return;
  }

  if (req.method === "POST" && pathname === "/api/orders") {
    let body = "";
    for await (const chunk of req) body += chunk;
    const { amount, orderName } = JSON.parse(body || "{}");
    const id = orderId();
    orders.set(id, { amount: Number(amount), orderName });
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ orderId: id }));
    return;
  }

  if (req.method === "POST" && pathname === "/api/confirm") {
    let body = "";
    for await (const chunk of req) body += chunk;
    const { paymentKey, orderId: id, amount } = JSON.parse(body || "{}");

    const saved = orders.get(id);
    if (saved && saved.amount !== Number(amount)) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "결제 금액이 일치하지 않습니다." }));
      return;
    }

    if (!TOSS_SECRET) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "서버에 시크릿 키가 설정되지 않았습니다. .env에 TOSS_SECRET_KEY를 넣어 주세요." }));
      return;
    }

    const auth = Buffer.from(TOSS_SECRET + ":").toString("base64");
    const confirmBody = JSON.stringify({
      paymentKey,
      orderId: id,
      amount: Number(amount),
    });

    const options = {
      hostname: "api.tosspayments.com",
      path: "/v1/payments/confirm",
      method: "POST",
      headers: {
        Authorization: "Basic " + auth,
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(confirmBody),
      },
    };

    const proxy = http.request(options, (payRes) => {
      let data = "";
      payRes.on("data", (chunk) => (data += chunk));
      payRes.on("end", () => {
        res.writeHead(payRes.statusCode, { "Content-Type": "application/json" });
        try {
          const json = JSON.parse(data);
          res.end(JSON.stringify({ paymentKey: json.paymentKey, orderId: json.orderId, totalAmount: json.totalAmount }));
        } catch {
          res.end(data);
        }
      });
    });
    proxy.on("error", (e) => {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: e.message }));
    });
    proxy.write(confirmBody);
    proxy.end();
    return;
  }

  res.writeHead(404);
  res.end("Not Found");
});

server.listen(PORT, () => {
  console.log(`결제 연동 서버: http://localhost:${PORT}`);
  if (!TOSS_SECRET) console.warn("경고: TOSS_SECRET_KEY가 없습니다. 결제 승인은 .env 설정 후 가능합니다.");
});
