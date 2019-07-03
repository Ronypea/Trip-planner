const mongoose = require('mongoose')
const db = require('../etc/config.json').db
const env_db = {
  name: process.env.DATABASE_NAME,
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
} // Это берется из докера, если запускается через докер
require('../models/models')

let connectionUrl = "mongodb://"+(env_db.host || db.host)+":"+(env_db.port || db.port)+"/"+(env_db.name || db.name);
//let connectionUrl = "mongodb://"+(db.host)+":"+(db.port)+"/"+(db.name);

//Connection
let setUpConnection = async () => {
  mongoose.connect(connectionUrl, { useNewUrlParser: true, useCreateIndex :  true , });
}

let closeConnection = async () => {
  mongoose.connection.close();
}

//DropDataBase
let dropDataBase = async () => {
  mongoose.connect(connectionUrl, { useNewUrlParser: true }, () => {
    mongoose.connection.db.dropDatabase();
  });
}

const City = mongoose.model("cities");
const Point = mongoose.model("points");
const PointType = mongoose.model("pointtypes");
const RoutePoint = mongoose.model("routepoints");
const Route = mongoose.model("routes");
const RouteType = mongoose.model("routetypes");
const User = mongoose.model("users");
const Like = mongoose.model("likes");

//City
let showCities = async () => {
  return City.find();
}

let addCity = async (data) => {
  const city = new City({
    City: data.City
  });
  return city.save().then( result => {
    console.log(result);
    return result._id;
  } );
}


//Points
let showPoints = async () => {
  return Point.find();
}

let findPoint = async (id) => {
  return Point.findOne({ _id: id });
}

let addPoint = async (data) => {
  const point = new Point({
    Name: data.Name,
    Type: data.Type,
    City: data.City,
    CoordX: data.CoordX,
    CoordY: data.CoordY,
    Author: data.Author,
    CreateDate: new Date(),
    Disc: data.Disc
  });
  return point.save().then( result => {
    console.log(result);
    return result._id;
  } );
}

let deletePoint = async (id) => {
  return Point.remove({ _id: id });
}

//PointTypes
let showPointTypes = async () => {
  return PointType.find();
}

let addPointType = async (data) => {
  const pointType = new PointType({
    Type: data.Type
  });
  return pointType.save().then( result => {
    console.log(result);
    return result._id;
  } );
}

//RoutePoints
let showRoutePoints = async () => {
  return RoutePoint.find();
}

let findRoutePoints = async (routeID) => {
  let rp = await RoutePoint.find({ Route: routeID });
  result = [];
  for (const id of rp) {
    result.push(await findPoint(id.Point));
  }
  return result;
}
let deleteRoutePoints = async (routeID) => {
  //await RoutePoint.find({ Route: routeID }).remove().exec();
  await RoutePoint.deleteMany({ Route: routeID })
}

let addRoutePoint = async (data) => {
  const routePoint = new RoutePoint({
    Route: data.Route,
    Point: data.Point
  });
  routePoint.save().then( result => {
    console.log(result);
    return result._id;
  } );
}

//Routes
let showRoutes = async () => {
  return Route.find().sort( { Likes : -1 } ).limit(10);
}

let searchRoutes = async (city, type, text) => {
  return Route.find(
    {
      $or:[
        { Name: {'$regex' : '.*'+text+'.*', '$options' : 'i' } },
        { Disc: {'$regex' : '.*'+text+'.*', '$options' : 'i' } }
      ],
      Type: type,
      City: city
    }
  ).sort( { Likes : -1 } ).limit(10);
}

let findRoute = async (id) => {
  return Route.findOne({ _id: id });
}

let findRouteByAuthor = async (author) => {
  return Route.find({ Author: author });
}

let findRouteByLikes = async (user_id) => {
  let routesID = await Like.find({ User: user_id });
  result = [];
  for (const id of routesID) {
    result.push(await findRoute(id.Route));
  }
  return result;
}

let addRoute = async (data) => {
  const route = new Route({
    Name: data.Name,
    Type: data.Type,
    City: data.City,
    Author: data.Author,
    CreateDate: new Date(),
    Disc: data.Disc,
    Likes: 0
  });
  return route.save().then( result => {
    console.log(result);
    return result._id;
  } );
}

let deleteRoute = async (id) => {
  return Route.deleteOne({ _id: id });
}
let updateRoute = async (data) => {

  const route = new Route({
    _id: data._id,
    Name: data.Name,
    Type: data.Type,
    City: data.City,
    Author: data.Author,
    CreateDate: new Date(),
    Disc: data.Disc,
    Likes: 0
  });
  return Route.update(
    { _id: data._id},
    {$set: {
        Name: data.Name,
        Type: data.Type,
        City: data.City,
        Author: data.Author,
        Disc: data.Disc,
      }}).then( result => {
    console.log(result);
    return result._id;
  } );
}

//RouteTypes
let showRouteTypes = async () => {
  return RouteType.find();
}

let addRouteType = async (data) => {
  const routeType = new RouteType({
    Type: data.Type
  });
  return routeType.save().then( result => {
    console.log(result);
    return result._id;
  } );
}

//Users
let showUsers = async () => {
  return User.find();
}

let findUser = async (data) => {
  return User.findOne({ Login: data });
}
let findUserById = async ({ id }) => {
  return User.findOne({ _id: id });
}


let getUser = function(username, callback){ //TODO починить, чтобы эта функция была не нужна,вместо неё - findUser
  let query = {Login: username};
  return User.findOne(query, callback);
}


let addUser = async (data) => {
  return User.countDocuments({ Login: data.Login }, function(err, count) {
    if (err) { return handleError(err) }
    if (count === 0) {
      const user = new User({
        Login: data.Login,
        Pass: data.Pass,
      });
      return user.save().then( result => {
        console.log(result);
        return result._id;
      } );
    }
  })
}

let editUser = async (data) => {
  return User.update({ _id: data.id }, { $set: { Fio: data.Fio, Info: data.Info  } }).then(
    result => {
      console.log(result);
      return result;
    }
  )
}


//Likes
let showLikes = async () => {
  return Like.find();
}

let ableLike = async (user, route) => {
  return Like.countDocuments({ User: user, Route: route });
}

let addLike = async (data) => {
  const like = new Like({
    User: data.User,
    Route: data.Route,
  });
  like.save().then( result => {
    Route.findOne({ _id: data.Route }).then(
      rt => {
        rt.Likes++;
        Route.update({ _id: rt._id}, rt).then(
          newrt => {
            console.log(result, newrt);
            return result._id;
          }
        )
      }
    )
  })
}

let removeLike = async (id) => {
  Like.findOne({ _id: id }).then(
    result => {
      Like.deleteOne({ _id: id }).then( sc => {
        Route.findOne({ _id: result.Route }).then(
          rt => {
            rt.Likes--;
            Route.update({ _id: rt._id}, rt).then(
              newrt => {
                console.log(result, newrt);
                return result._id;
              }
            )
          }
        )
      }
    )
  })
}

//BD
module.exports.setUpConnection = setUpConnection;
module.exports.closeConnection = closeConnection;
module.exports.dropDataBase = dropDataBase;

//City
module.exports.showCities = showCities;
module.exports.addCity = addCity;

//Points
module.exports.showPoints = showPoints;
module.exports.findPoint = findPoint;
module.exports.addPoint = addPoint;
module.exports.deletePoint = deletePoint;

//PointTypes
module.exports.showPointTypes = showPointTypes;
module.exports.addPointType = addPointType;

//RoutePoints
module.exports.showRoutePoints = showRoutePoints;
module.exports.findRoutePoints = findRoutePoints;
module.exports.addRoutePoint = addRoutePoint;
module.exports.deleteRoutePoints = deleteRoutePoints;
//Routes
module.exports.showRoutes = showRoutes;
module.exports.searchRoutes = searchRoutes;
module.exports.findRoute = findRoute;
module.exports.findRouteByAuthor = findRouteByAuthor;
module.exports.findRouteByLikes = findRouteByLikes;
module.exports.addRoute = addRoute;
module.exports.deleteRoute = deleteRoute;
module.exports.updateRoute = updateRoute;

//RouteTypes
module.exports.showRouteTypes = showRouteTypes;
module.exports.addRouteType = addRouteType;

//Users
module.exports.showUsers = showUsers;
module.exports.findUser = findUser;
module.exports.findUserById = findUserById;
module.exports.addUser = addUser;
module.exports.editUser = editUser;
module.exports.getUser = getUser;// TODO

//Likes
module.exports.showLikes = showLikes;
module.exports.ableLike = ableLike;
module.exports.addLike = addLike;
module.exports.removeLike = removeLike;
