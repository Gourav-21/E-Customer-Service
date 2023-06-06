const express = require('express')
const { connectMongoose,User, userSchema, Item } =require("./database")
const passport= require("passport")
const bodyParser = require('body-parser');
const { initializingPassport } = require('./passportConfig')
const passportlocalmongoose = require('passport-local-mongoose')
const expressSession = require('express-session')
const app = express()
const port = 3000

connectMongoose();
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(express.urlencoded({extended:true}))
app.use(express.static("public"));
app.use(expressSession({secret: 'secret', resave:false, saveUninitialized:false}))
app.use(passport.initialize())
app.use(passport.session()); 
initializingPassport(passport);

app.get('/', (req, res) => {
    if(req.isAuthenticated()){
        res.render("home",{user:true})
    }else
    res.render("home",{user:null})
})
app.get('/about', (req, res) => {
    if(req.isAuthenticated()){
        res.render("about",{user:true})
    }else
    res.render("about",{user:null})
})
app.get('/contact', (req, res) => {
    if(req.isAuthenticated()){
        res.render("contact",{user:true})
    }else
    res.render("contact",{user:null})
})


app.route("/login")
    .get((req,res)=>{
        if(req.isAuthenticated()){
            res.render("home",{user:true})
        }else
        res.render("login",{user:null})
    })
    .post((req,res)=>{
        const user= new User({
            email:req.body.email,
            password:req.body.password
        })
        console.log(req.body)
        
        req.login(user, function(err){
            if (err) { 
                console.log(err) 
                res.redirect("/register")
            }else{
                // passport.authenticate("local")(req,res,()=>{
                //     res.redirect("/")
                // })
                passport.authenticate('local', function(err, user, info) {
  if (err) {
    console.log(err);
    res.redirect('/register');
  } else if (!user) {
    // Handle the case where the user enters the wrong password
    res.redirect('/logout');

  } else {
    req.logIn(user, function(err) {
      if (err) {
        console.log(err);
        res.redirect('/register');
      } else {
        res.redirect('/');
      }
    });
  }
})(req, res);

            }
        })
    })

app.route("/register")
    .get((req,res)=>{
        if(req.isAuthenticated()){
            res.render("home",{user:true})
        }else
        res.render("register",{user:null})
    })
    .post((req,res)=>{
        const newUser = new User({
            name: req.body.name,
            phone_number: req.body.phone_number,
            username: req.body.username
        })
        User.register(newUser, req.body.password, function(err, user) {
            if (err) { 
                console.log(err) 
                res.redirect("/register")
            }else{
                passport.authenticate("local")(req,res,()=>{
                    res.redirect("/")
                })
            }
        });
    })
    
app.get("/logout",(req,res)=>{
    req.logout(()=>{
        console.log("loged out")
    });
    res.render("home",{user:null})
})

app.post("/message",(req,res)=>{
    console.log(req.body)
    Item.create(req.body)
    res.redirect('/contact')

})

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})