//jshint eversion: 6

//require installed node packages
const express = require("express"); 
const mailchimp = require("@mailchimp/mailchimp_marketing");

//est port channel
const port = 3000;

//initialize express (create a new express app)
const app = express(); 

//enable express to parse URL-encoded body i.e. info from the HTML form
app.use(express.urlencoded({extended: true})); 

//GET Request
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/signup.html")
});

//setting up mailchimp package (in mailchimp documentations)
mailchimp.setConfig({
    apiKey: '8c24e881efac7a16bfbed4a26fc707c3-us21', 
    server: 'us21'
  });

//Post method called by <form> element
app.post("/", (req, res) => {

    const subscriber = {
        email: req.body.email,
        name: req.body.clientName,
        pronouns: req.body.pronouns
    }

    //now called Audience ID on mailchimp's audience dashboard
    const listId = "08f1666ef9"

    //copy-pasted from mailchimp's documentation
    async function run() {
        try {
            const response = await mailchimp.lists.addListMember(listId, {
            email_address: subscriber.email,
            status: "subscribed",
            merge_fields: {
                FNAME: subscriber.name,
                //PRONOUNS: subscriber.pronouns
            }
            });

            console.log(`Successfully added contact as a newsletter subscriber.`);

            res.sendFile(__dirname + "/success.html") 
        }
        catch (err) {
            console.log(err.status); 
            res.sendFile(__dirname + "/failure.html");
        }
        
    }

    run(); 
    
});

//For the server to serve up static files, we need to give it access to these static files. 
//enable express to access static files in this directory
app.use(express.static(__dirname));

app.listen(port, (err) => {
    if (err) {console.log("There was an issue starting your server")}  
    console.log("Your server has started successfully on", port); 
})