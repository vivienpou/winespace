import mysql from 'mysql';


const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '**',
  database: 'projets',
});

export default connection;
