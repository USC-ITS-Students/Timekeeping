// <Database>
var db = {};
if(process.argv[2] === 'production'){
  db.host = ''; // production host
  db.port = 27017; // production port
}else {
  db.host = 'localhost'; // local host
  db.port = 27017; // local port
}
db.connectionString = function(){
  return 'mongodb://'+this.host+':'+this.port+'/Timekeeping';
};
// </Database>

module.exports = {
  db: db
};
