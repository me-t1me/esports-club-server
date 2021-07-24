const express = require("express");
const { google } = require("googleapis");
const cors = require("cors");
const Razorpay = require("razorpay");
const { v4: uuidv4 } = require("uuid");
const bodyParser = require("body-parser");
require("dotenv").config();

const SPREADSHEETS_ID = process.env.SPREADSHEETS_ID;

const MID = process.env.MID;
const KEY = process.env.KEY;
const FEE = process.env.FEE;
const CLIENT_URL = process.env.CLIENT_URL;

const razorpay = new Razorpay({
  key_id: MID,
  key_secret: KEY,
});

const app = express();
app.use(cors());
app.use(bodyParser.json());
let status = "not successful";

app.post("/apis/pay", async (req, res) => {
  const amount = FEE;
  const currency = "INR";

  const options = {
    amount: amount * 100,
    currency,
    receipt: uuidv4(),
  };

  const response = await razorpay.orders.create(options);
  res.json({
    id: response.id,
    currency: response.currency,
    amount: response.amount,
  });
});

app.post("/apis/1", (req, res) => {
  const secret = "12345678";

  const crypto = require("crypto");

  const shasum = crypto.createHmac("sha256", secret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest("hex");

  if (digest === req.headers["x-razorpay-signature"]) {
    status = req.body.payload.payment.entity.status;
    console.log(status);
  } else {
    // pass it
  }

  res.status(200);
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
