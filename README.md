steps to install:

npm init -y (it will prepopulate the package.json file) <br />
npm install express jsforce dotenv <br />
node index.js (run the server) <br />


logic steps: <br />

create connection variable conn with login url  <br />
access the variable login function with Salesforce username, password and token (password+token) <br />
use the variable conn query function to retrieve account data from the salesforce org <br />

SOQL for logs: 

SELECT Id, LogUserId,StartTime, LogUser.Name, LogLength, Operation ,Request, Application, Status, Location, RequestIdentifier FROM ApexLog 

For the Body: GET /services/data/v50.0/tooling/sobjects/ApexLog/07L5Y00004hdTKLUA2/Body

tooling request:

var requestURL = {
    url: '/services/data/v50.0/tooling/sobjects/ApexLog/07L5Y00004hd6PrUAI/Body',
    method: 'get',
    body: '',
    headers : {
            "Content-Type" : "application/json"
        }
  };

conn.request(requestURL, function(err,resp)



