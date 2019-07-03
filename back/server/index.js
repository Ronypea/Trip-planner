const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const db = require('./utils/DataBase')
const cors = require('cors')
const serverPort = require('./etc/config.json').serverPort
const cookieParser = require('cookie-parser')

const urlencodedParser = bodyParser.urlencoded({extended: false})

const publicPath = path.join(__dirname, '../public');

const app = express()

const port = process.env.PORT || serverPort

app.use(urlencodedParser)

app.use(express.static(publicPath))

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//Connection
db.setUpConnection();

app.listen(port, () => {
  console.log('Server started on port ' + port)
})


// BodyParser Middleware
app.use(cookieParser());

// Configuring Passport
const jwt = require('jsonwebtoken');
const passportJWT = require('passport-jwt');
const ExtractJWT = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;
const passport = require('passport');


let jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = 'jwtsecret';
const strategy = new JwtStrategy(jwtOptions, async function(jwt_payload, done) {
  console.log('payload received', jwt_payload);
  // usually this would be a database call:
  const user = await db.getUser(jwt_payload.username);
  if(!user){
    return done(null, false, {message: 'Unknown User'});
  }else {
    return done(null, user);
  }
});
passport.use(strategy);
// const session = require('express-session');
// const FileStore = require('session-file-store')(session);

// let LocalStrategy = require('passport-local').Strategy;
// passport.use(new LocalStrategy(
//     function(username, password, done) {
//       db.getUser(username, function(err, user){
//         console.log('YSER', user)
//         if(err) return done(err);
//         if(!user){
//           return done(null, false, {message: 'Unknown User'});
//         }else {
//           if (user.Pass === password) {
//             return done(null, user);
//           } else {
//             return done(null, false, {message: 'Invalid password'});
//           }
//         }});
//     }));

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(async function(id, done) {
  const usr = await db.findUserById({ id })
  done(null, usr)
  return null

});


// app.use(session({
//   store: new FileStore(),
//   secret: 'secretkey',
//   resave: true,
//   saveUninitialized: false,
//   name: 'cocoo',
//   cookie: {
//     secure: false
//   }
// }));

app.use(passport.initialize());

app.get('/index', function (req, res) {
  let authorized = false;
  if(req.isAuthenticated()){ //true authorization check
    authorized = true;
  }
  db.showCities().then(city => {
    db.showRouteTypes().then(routetypes => {
      db.showRoutes().then(routes => {
          let result = {
            authorized : authorized,
            city: city,
            routetypes: routetypes,
            routes: routes
          };
          res.send(result);
      })
    })
  })
})

app.get('/search', function (req, res) {
  let scity = req.query.scity;
  let stype = req.query.stype;
  let stext = req.query.stext;
  db.showCities().then(city => {
    db.showRouteTypes().then(routetypes => {
      db.searchRoutes(scity, stype, stext).then(routes => {
          let result = {
            authorized : false,
            city: city,
            routetypes: routetypes,
            routes: routes
          };
          res.send(result);
      })
    })
  })
})

app.get('/route/:id',
    async function (req, res) {
      passport.authenticate('jwt', async function (err, user, info) {
        let route = req.params.id;
        let userID;
        let authorized = false;
        if (user) { //true authorization check
          authorized = true;
          userID = user._id;
        }
        const myRoute = await db.findRoute(route)
        const myRoutePoints = await db.findRoutePoints(myRoute._id)
        let likeCount;
        if(authorized)
          likeCount = await db.ableLike(userID, route)
        let result = {
          authorized: authorized,
          route: myRoute,
          routepoints: myRoutePoints,
          likecount: likeCount
        };
        console.log(result)
        res.send(result);
      })(req,res);

})

app.get('/editroute', function (req, res) {
  passport.authenticate('jwt', async function (err, user, info) {
    let userID;
    let authorized = false;
    if (user) { //true authorization check
      authorized = true;
      userID = user._id;
    }
    let result = {
      authorized: authorized
    };
    res.send(result);
  })(req,res);
})

app.get('/editroute/:id',
  async function (req, res) {
    passport.authenticate('jwt', async function (err, user, info) {
      let authorized = false;
      if (user) { //true authorization check
        authorized = true;
        let route = req.params.id;
        let myRoute = await db.findRoute(route);
        let myRoutePoints = await db.findRoutePoints(myRoute._id);
        let result = {
          authorized : authorized,
          route: myRoute,
          routepoints: myRoutePoints
        };
        res.send(result);
      }
    })(req,res);
  }
)

app.get('/pointinfo', function (req, res) {
  db.showPoints().then(myPoints => {
    db.showPointTypes().then(myPointTypes => {
      db.showCities().then(myCities => {
        let result = {
          points: myPoints,
          pointtypes: myPointTypes,
          cities: myCities
        };
        res.send(result);
      })
    })
  })
})

app.get('/profile',
  async function (req, res) {
    passport.authenticate('jwt', async function (err, user, info) {
      let authorized = false;
      if (user) { //true authorization check
        authorized = true;
        let userID = user._id;
        let userLogin = user.Login;
        let byAuthor = await db.findRouteByAuthor(userLogin);
        let authorResult = [];
        for (let i = 0; i < byAuthor.length; i++){
          let a = {}
          a.Route = byAuthor[i];
          a.Points = await db.findRoutePoints(a.Route._id);
          authorResult.push(a);
        }

        let byLikes = await db.findRouteByLikes(userID);
        let likeResult = [];
        for (let i = 0; i < byLikes.length; i++){
          let a = {}
          a.Route = byLikes[i];
          a.Points = await db.findRoutePoints(a.Route._id);
          likeResult.push(a);
        }
        let myUser = await db.findUser(userLogin);
        let result = {
          authorized: authorized,
          likes: likeResult,
          author: authorResult,
          profile: myUser
        };
        res.send(result);
      } else {
        let result = {
          authorized: authorized,
        };
        res.send(result);
      }
  })(req,res);
})

app.post("/addpoint",
  async function (req, res) {
    passport.authenticate('jwt', async function (err, user, info) {
      if (!req.body) return res.sendStatus(400);
      if (user) {
        let author = user.Login;
        let point = {
          Name : req.body.Name,
          Type : req.body.Type,
          City : req.body.City,
          CoordX: req.body.CoordX,
          CoordY: req.body.CoordY,
          Author: author,
          Disc: req.body.Disc,
        };
        let result = await db.addPoint(point);
        res.send(result);
      }
    })(req,res);
  }
)

app.post("/deletepoint", function (req, res) {
  if(!req.body) return res.sendStatus(400);
  let point = req.body.point.id;
  db.deletePoint(point).then(result => {
    res.send(result);
  });
})

app.post("/addroute",
  async function (req, res) {
    passport.authenticate('jwt', async function (err, user, info) {
      if (!req.body) return res.sendStatus(400);
      if (user) {
        let author = user.Login;
        let route = {
          Name : req.body.name,
          Type : req.body.type,
          City : req.body.city,
          Author: author,
          Disc: req.body.disc,
        };
        let points = req.body.points;
        let result = await db.addRoute(route);
        for (let i = 0; i < points.length; i++){
          let data = {
           Route: result,
           Point: points[i].id
          }
          await db.addRoutePoint(data);
        }
        res.send(result)
      }
    })(req,res);
  }
)

app.post("/deleteroute", function (req, res) {
  if(!req.body) return res.sendStatus(400);
  let route = req.body.route.id;
  db.deleteRoute(route).then(result => {
    res.send(result);
  });
})

app.post("/updateroute/:id", async function (req, res) {
  passport.authenticate('jwt', async function (err, user, info) {
    if (!req.body) return res.sendStatus(400);
    if (user) {
      let author = user.Login;
      let routeID = req.params.id;
      await db.deleteRoutePoints(routeID);
      console.log('route points deleted');
      let route = {
        _id : req.body.id,
        Name : req.body.name,
        Type : req.body.type,
        City : req.body.city,
        Author: author,
        Disc: req.body.disc,
      };
      let points = req.body.points;
      console.log(route);
      let result2 = await db.updateRoute(route);
      console.log("result2 = ", result2);
      let result = req.body.id;
      console.log('route info updated');
      for (let i = 0; i < points.length; i++){
        let data = {
          Route: result,
          Point: points[i].id
        }
        console.log(data)
        await db.addRoutePoint(data);
      }
      console.log('route points added')
      res.send(result)
    }
  })(req,res);

})
///
///
app.post("/addlike",
  async function (req, res) {
    passport.authenticate('jwt', async function (err, user, info) {
      if(!req.body) return res.sendStatus(400);
      if (user) { //true authorization check
        let userID = user._id;
        let like = {
          Route : req.body.route,
          User : userID
        }
        db.addLike(like).then(result => {
          res.send(result);
        });
      }
    })(req,res);
  }
)

app.post("/removeLike", function (req, res) {
  if(!req.body) return res.sendStatus(400);
  let id = req.body.id;
  db.removeLike(id).then(result => {
    res.send(result);
  });
})

app.post("/editprofile",
  async function (req, res) {
    passport.authenticate('jwt', async function (err, user, info) {
      if(!req.body) return res.sendStatus(400);
      if (user) { //true authorization check
        let newProfile = {
          Fio : req.body.Fio,
          Info : req.body.Info,
          id : user._id
        }
        console.log(newProfile)
        db.editUser(newProfile).then(result => {
          res.send(result);
        });
      }
    })(req,res);
  }
)

app.post('/login',
  function(req, res) {
    const { username, password } = req.body;
    db.getUser(username, function(err, user){
      if(err) return res.json({ok:false})
      if(!user){
        return res.json({ok:false})
      }else {
        if (user.Pass === password) {
          const token = jwt.sign({username: user.Login}, jwtOptions.secretOrKey)
          return res.json({ok: true, token})
        } else {
          return res.json({ok:false})
        }
      }});
  }
);
app.post('/logout',
  function(req, res) {
    req.logout();
    res.json({ok: true});

  }
);
app.get('/me',
    passport.authenticate('jwt', {session: false}),
    function(req,res) {
      res.json(req.user)
    }
);
app.post("/register", async function (req, res) {
  let password = req.body.password;
  let password_repeated = req.body.password_repeated;
  let username = req.body.username;
  console.log(username);
  let usr = await db.findUser(username);
    console.log("user = " + usr);
    if (password === password_repeated){
      let newUser ={
        Login: username,
        Pass: password
      };
      if(usr===null||usr===undefined) {
        let createdUser = await db.addUser(newUser);
        return res.json({ok:true})
      } else{
        res.status(500).send("{error: \" Username "+usr.Login+" is already taken\"}").end()
      }
    } else{
      res.status(500).send("{error: \"Passwords don't match\"}").end()
    }
  })


app.post("/exit", function (req, res) {

})
