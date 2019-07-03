const mongoose = require('mongoose')

const Schema = mongoose.Schema;

//City
const CitySchema = new Schema({
  City: { type: String, required: true }
}, {
    versionKey: false
});

//Likes
const LikeSchema = new Schema({
  User: { type: String, required: true },
  Route: { type: String, required: true }
}, {
    versionKey: false
});

//Points
const PointSchema = new Schema({
  Name: { type: String, required: true },
  Type: { type: String, required: true },
  City: { type: String, required: true },
  CoordX: { type: String, required: true },
  CoordY: { type: String, required: true },
  Author: { type: String, required: true },
  CreateDate: { type: Date, required: true },
  Disc: { type: String }
}, {
    versionKey: false
});

//PointTypes
const PointTypeSchema = new Schema({
  Type: { type: String, required: true }
}, {
    versionKey: false
});

//RoutePoints
const RoutePointSchema = new Schema({
  Route: { type: String, required: true },
  Point: { type: String, required: true }
}, {
    versionKey: false
});

//Routes
const RouteSchema = new Schema({
  Name: { type: String, required: true },
  Type: { type: String, required: true },
  Author: { type: String, required: true },
  CreateDate: { type: Date, required: true },
  City: { type: String, required: true },
  Disc: { type: String },
  Likes: { type: Number }
}, {
    versionKey: false
});

//RouteTypes
const RouteTypeSchema = new Schema({
  Type: { type: String, required: true }
}, {
    versionKey: false
});

//Users
const UserSchema = new Schema({
  Login: { type: String, required: true, unique : true },
  Pass: { type: String, required: true },
  Fio: { type: String },
  Info: { type: String }
}, {
    versionKey: false
});

const City = mongoose.model('cities', CitySchema);
const Like = mongoose.model('likes', LikeSchema);
const Point = mongoose.model('points', PointSchema);
const PointType = mongoose.model('pointtypes', PointTypeSchema);
const RoutePoint = mongoose.model('routepoints', RoutePointSchema);
const Route = mongoose.model('routes', RouteSchema);
const RouteType = mongoose.model('routetypes', RouteTypeSchema);
const User = mongoose.model('users', UserSchema);

module.exports.City = City
module.exports.Like = Like
module.exports.Point = Point
module.exports.PointType = PointType
module.exports.RoutePoint = RoutePoint
module.exports.Route = Route
module.exports.RouteType = RouteType
module.exports.User = User
