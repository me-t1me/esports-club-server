const express = require("express");
const { google } = require("googleapis");
const cors = require("cors");
const paytm = require("./paytm");
const formidable = require("formidable");
require("dotenv").config();

const SPREADSHEETS_ID = process.env.SPREADSHEETS_ID;

const CLIENT_URL = process.env.CLIENT_URL;

const app = express();
app.use(cors());
let status = "";

app.get("/apis/pay", (req, res) => {
  paytm.pay(req, res);
});

app.post("/apis/1", (req, res) => {
  const form = new formidable.IncomingForm();
  form.parse(req, (err, fields, files) => {
    status = fields.STATUS;
    if (status === "TXN_SUCCESS") {
      res.redirect(`${CLIENT_URL}/success`);
    } else {
      res.redirect(`${CLIENT_URL}/failure`);
    }
  });
});
app.get("/apis/2", (req, res) => {
  res.json({
    data: status,
  });
});

app.get(
  "/apis/:name/:mobile/:riot/:crank/:hrank/:status/:time",
  async (req, res) => {
    const auth = new google.auth.GoogleAuth({
      keyFile: "credentials.json",
      scopes: "https://www.googleapis.com/auth/spreadsheets",
    });

    const client = await auth.getClient();

    const googleSheets = google.sheets({ version: "v4", auth: client });

    const spreadsheetId = SPREADSHEETS_ID;

    await googleSheets.spreadsheets.values.append({
      auth,
      spreadsheetId,
      range: "Sheet1",
      valueInputOption: "USER_ENTERED",
      resource: {
        values: [
          [
            req.params.name,
            req.params.mobile,
            req.params.riot,
            req.params.crank,
            req.params.hrank,
            req.params.status,
            req.params.time,
          ],
        ],
      },
    });

    res.send(req.params);
  }
);

const PORT = process.env.PORT || 3005;

app.listen(PORT, (req, res) => {
  console.log("listening on port 3005");
});
