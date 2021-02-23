steps to install:

npm init -y (it will prepopulate the package.json file) <br />
npm install express jsforce dotenv <br />
npm index.js (run the server) <br />

logic steps: <br />

create connection variable conn with login url  <br />
access the variable login function with Salesforce username, password and token (password+token) <br />
use the variable conn query function to retrieve account data from the salesforce org <br />
