// 데이터베이스를 사용하는데 필요한 정보들을 저장해두는 곳

require('dotenv').config();
const env = process.env;

const development = {
    username: env.USERNAME,
    password: env.PASSWORD,
    database: env.DATABASE,
    host: env.HOST,
    dialect: "mysql",
    port: "3306"
};
  
//   const production = {
//     username: env.MYSQL_USERNAME,
//     password: env.MYSQL_PASSWORD,
//     database: env.MYSQL_DATABASE,
//     host: env.MYSQL_HOST,
//     dialect: "mysql",
//     //port: env.MYSQL_PORT
//   };
  
//   const test = {
//     username: env.MYSQL_USERNAME,
//     password: env.MYSQL_PASSWORD,
//     database: env.MYSQL_DATABASE_TEST,
//     host: env.MYSQL_HOST,
//     dialect: "mysql",
//     //port: env.MYSQL_PORT
//   };
  
  module.exports = { development };