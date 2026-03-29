const express = require("express");
const puppeteer = require("puppeteer");

const app = express();

app.get("/api", async (req, res) => {
  const url = req.query.url;

  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox"]
    });

    const page = await browser.newPage();

    let video = null;

    page.on("response", (response) => {
      const rurl = response.url();
      if (rurl.includes(".mp4")) {
        video = rurl;
      }
    });

    await page.goto(url, { waitUntil: "networkidle2" });
    await page.waitForTimeout(5000);

    await browser.close();

    res.send(video || "NOT_FOUND");

  } catch (e) {
    res.send("ERROR");
  }
});

app.listen(3000);
