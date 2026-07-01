const crypto = require("crypto");
const fs = require("fs");

const file = fs.readFileSync("assets/ALU-logo-white.png");

var hash = crypto.createHash("sha256")
                    .update(file)
                    .digest("hex");
                    
hash = "0x" + hash

fs.writeFileSync("hash.txt", hash);
console.log("Hash saved to hash.txt");
