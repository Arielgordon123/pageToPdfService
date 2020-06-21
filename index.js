const express = require("express");
const path = require("path");
const puppeteer = require("puppeteer");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || "3000";

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

async function printPDF(link) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--disable-dev-shm-usage", "--no-sandbox", "--disable-gpu"],
  });
  const page = await browser.newPage();
  await page.goto(link, { waitUntil: "networkidle0" });
  await page.emulateMediaType("screen");
  const pdf = await page.pdf({ format: "A4" });

  await browser.close();
  return pdf;
}

app.get("/", (req, res) => {
  const { rawHeaders, httpVersion, method, socket, url } = req;
  const { remoteAddress, remoteFamily } = socket;

  console.log(
    JSON.stringify({
      timestamp: Date.now(),
      rawHeaders,
      httpVersion,
      method,
      remoteAddress,
      remoteFamily,
      url,
    })
  );

  if (req.query.link) {
    printPDF(req.query.link).then((pdf) => {
      res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=cv.pdf",
        "Content-Length": pdf.length,
      });
      res.end(pdf);
    });
  } else {
    res.status(500).json({ error: "error" });
  }
});

app.listen(port, () => {
  console.log(`Listening to requests on http://localhost:${port}`);
});
