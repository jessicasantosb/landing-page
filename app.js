const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

// app.use(express.static(path.join(__dirname, "app.js")));
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.post("/", (req, res) => {
    const firstName = req.body.fname;
    const lastName = req.body.lname;
    const email = req.body.email;
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merger_field: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }

    const jsonData = JSON.stringify(data);
    const url = "https://us21.api.mailchimp.com/3.0/lists/3a04302d4e";
    const option = {
        method: "POST",
        auth: "jessica:4e1c9de5c49b479e4124d4fd534c25ba-us21"
    }

    const request = https.request(url, option, (response) => {
        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html")
        } else {
            res.sendFile(__dirname + "/failure.html")
        }

        response.on("data", (data) => {
            console.log(JSON.parse(data));
        })
    })
    request.write(jsonData);
    request.end();
});

app.post("/failure.html", (req, res) => {
    res.redirect("/");
});

app.listen(process.env.PORT || 4000, () => {
    console.log("Listening on port 4000");
});