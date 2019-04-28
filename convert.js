// Load modules
var request = require('request');
var fs = require('fs');
// Load APIKey
var { apikey } = require("./apikey.json");
// Check just in case
if (apikey == "Insert your api key")
    return console.log("Please edit apikey.json and add your api key");
account = "";
// Cross platform :tm:
var endOfLine = require('os').EOL;

// WARNING setting this to a higher value may get you manually banned from our API
var default_extract_count = 450;

// Keep track of how many accounts were taken from API Key
var i = 0;
// Recursive function to get accounts
function StoreAccount() {
    // Exit once done
    if (i > default_extract_count) {
        console.log("Done extracting " + default_extract_count + " Accounts");
        process.exit(0);
    }
    // Try to keep script running even if an error occurs
    try {
        request("https://accgen.cathook.club/api/v1/account/" + apikey, (error, response, body) => {
            body = JSON.parse(body);
            // You're too fast and got ratelimited
            if (error || body.error) {
                // Actual limit hit, discouraged
                if (body.error.indexOf("API key exhausted. Please try again later!") != -1) {
                    console.log("API Key exhausted for today, exiting");
                    return;
                }
                console.log("Ratelimited, please wait...");
                setTimeout(() => { StoreAccount(); }, 30000);
                return;
            }
            // Add account to list
            account = body.login + ":" + body.password + endOfLine;
            // Write to file
            fs.appendFileSync("accounts.txt", account);
            // Increment account count
            i++;
            console.log("Account added");
            // Call itself after 10ms
            setTimeout(() => { StoreAccount(); }, 2500);
            return;
        });
    }
    // An error that should not have occured occured, don't exit, just retry
    catch (err) {
        console.log("An error occurred, retrying in 60 seconds: " + err);
        setTimeout(() => { StoreAccount(); }, 60000);
    }
}
// Call func
StoreAccount();
