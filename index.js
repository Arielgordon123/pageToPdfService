const express = require("express");
const path = require("path");
const puppeteer = require("puppeteer");
const bodyParser = require('body-parser')
const app = express();
const port = process.env.PORT || "3000";


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


async function printPDF(link) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--disable-dev-shm-usage"],
  });
  const page = await browser.newPage();
  await page.goto(link, { waitUntil: "networkidle0" });
  const pdf = await page.pdf({ format: "A4" });

  await browser.close();
  return pdf;
}

app.post("/", (req, res) => {
    if(req.body.link){
        printPDF(
           req.body.link
          ).then((pdf) => {
            res.set({ "Content-Type": "application/pdf", "Content-Length": pdf.length });
            res.status(200).send(pdf);
          });
    }else{
        res.status(500).json({error: "error"})
    }
});

app.listen(port, () => {
  console.log(`Listening to requests on http://localhost:${port}`);
});

