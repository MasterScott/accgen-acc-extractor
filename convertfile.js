var fs = require('fs');
account = "";
// Cross platform :tm:
var endOfLine = require('os').EOL;

// Keep track of how many accounts were taken from API Key
var i = 0;
// Recursive function to get accounts
function StoreAccount() {
    // Try to keep script running even if an error occurs
    data = fs.readFileSync("data.json");
    data = JSON.parse(data);
    for (var i = 0; i < data.length; i++) {
        var body = data[i];
        // Add account to list
        account = body.login + ":" + body.password + endOfLine;
        // Write to file
        fs.appendFileSync("accounts.txt", account);
    }
    return;
}
// Call func
StoreAccount();
