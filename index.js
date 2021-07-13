const express = require("express");
const { google } = require("googleapis");
const cors = require("cors");
const paytm = require("./paytm");
const formidable = require("formidable");
require("dotenv").config();

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
      res.send("Payment successful");
    } else {
      res.send("Payment failed");
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

    const spreadsheetId = "1KWAsYoJtUDjfbHd71Q1OiTJnt-QUJ6kmiJom4imR13I";

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

app.listen(process.env.PORT || 3005, (req, res) => {
  console.log("listening on port 3005");
});
