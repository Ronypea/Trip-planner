const db = require('../utils/DataBase')
const dbinfo = require('./initDBinfo.json')

const synchronizer = async (func, data) => {
    for (const item of data) {
        await func(item)
    }
}

async function main(){
    await db.setUpConnection();
    await synchronizer(db.addCity, dbinfo.myCities);
    console.log('Cities added');
    await synchronizer(db.addPointType, dbinfo.myPointTypes);
    console.log('PointTypes added');
    await synchronizer(db.addRouteType, dbinfo.myRouteTypes);
    console.log('RouteTypes added');
    await synchronizer(db.addUser, dbinfo.myUsers);
    console.log('Users added');
    await synchronizer(db.addPoint, dbinfo.myPoints);
    console.log('Points added');
    await synchronizer(db.addRoute, dbinfo.myRoutes);
    console.log('Routes added');
    console.log('Done');

}
//db.dropDataBase();
(async ()=>{
    await main();
    process.exit(0)
})()
