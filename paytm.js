const paytm = require("paytm-nodejs");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

const URL = process.env.URL;
const MID = process.env.MID;
const KEY = process.env.KEY;
const CHANNEL_ID = process.env.CHANNEL_ID;

const config = {
  MID: MID, // Get this from Paytm console
  KEY: KEY, // Get this from Paytm console
  ENV: CHANNEL_ID, // 'dev' for development, 'prod' for production
  CHANNEL_ID: "WEB",
  INDUSTRY: "Retail",
  WEBSITE: "WEBSTAGING",
  CALLBACK_URL: `${URL}/apis/1`,
};

exports.pay = function (req, res) {
  let data = {
    TXN_AMOUNT: "10", // request amount
    ORDER_ID: uuidv4(), // any unique order id
    CUST_ID: "CUST_123456", // any unique customer id
  };

  // create Paytm Payment
  paytm.createPayment(config, data, function (err, data) {
    if (err) {
      // handle err
    }

    //success will return

    /*{ 
            MID: '###################',
            WEBSITE: 'DEFAULT',
            CHANNEL_ID: 'WAP',
            ORDER_ID: '#########',
            CUST_ID: '#########',
            TXN_AMOUNT: '##',
            CALLBACK_URL: 'localhost:8080/paytm/webhook',
            INDUSTRY_TYPE_ID: 'Retail',
            url: 'https://securegw-stage.paytm.in/order/process',
            checksum: '####################################' 
        }*/

    //store the url and checksum
    let url = data.url;
    let checksum = data.checksum;

    // delete it from data object
    delete data.url;
    delete data.checksum;

    /* Prepare HTML Form and Submit to Paytm */
    res.writeHead(200, { "Content-Type": "text/html" });
    res.write("<html>");
    res.write("<title>Merchant Checkout Page</title>");
    res.write("</head>");
    res.write("<body>");
    res.write("<center><h1>Please do not refresh this page...</h1></center>");
    res.write('<form method="post" action="' + url + '" name="paytm_form">');
    for (var x in data) {
      res.write(
        '<input type="hidden" name="' + x + '" value="' + data[x] + '">'
      );
    }
    res.write(
      '<input type="hidden" name="CHECKSUMHASH" value="' + checksum + '">'
    );
    res.write("</form>");
    res.write('<script type="text/javascript">');
    res.write("document.paytm_form.submit();");
    res.write("</script>");
    res.write("</body>");
    res.write("</html>");
    res.end();
  });
};

exports.webhook = function (req, res) {
  paytm.validate(config, req.body, function (err, data) {
    if (err) {
      console.log(err);
    }

    if (data.status == "verified") {
      res.send(data);
    }
  });
};
