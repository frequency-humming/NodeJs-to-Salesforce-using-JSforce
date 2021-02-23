steps to install:

npm init -y (it will prepopulate the package.json file)
npm install express jsforce dotenv
npm index.js (run the server)

logic steps:

create connection variable conn with login url 
access the variable login function with Salesforce username, password and token (password+token)
use the variable conn query function to retrieve account data from the salesforce org