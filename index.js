var express = require("express")
var bodyParser = require("body-parser")
var mongoose = require("mongoose")

const app = express()

app.use(bodyParser.json())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({
    extended:true
}))

mongoose.connect('mongodb://localhost:27017/WEB-assignment',{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

var db = mongoose.connection;

db.on('error',()=>console.log("Error in Connecting to Database"));
db.once('open',()=>console.log("=====================\nConnected to Database\n====================="))

app.post("/sign_up",(req,res)=>{
    var email = req.body.email;
    var password = req.body.password;

    var data = {
        "email" : email,
        "password" : password
    }

    db.collection('users').insertOne(data,(err,collection)=>{
        if(err){
            throw err;
        }
        console.log("Data Inserted Successfully");
    });

    return res.redirect('signup_success.html')

})

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        user = await db.collection('users').findOne({ email, password });
        
        //const user = await User.findOne({ email, password });
    
        if (user) {
          return res.redirect('login_success.html');
        } else {
          return res.redirect('login_failure.html');
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

app.get("/",(req,res)=>{
    res.set({
        "Allow-access-Allow-Origin": '*'
    })
    return res.redirect('login.html');
}).listen(3000);