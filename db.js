const spicedPg = require("spiced-pg");

let dbURL;

if (process.env.NODE_ENV === "production") {
    dbURL = process.env.DATABASE_URL;
} else {
    const { user, password, database } = require("./secrets.json");
    dbURL = `postgres:${user}:${password}@localhost:5432/${database}`;
}
console.log("dbURL: ", dbURL);

const db = spicedPg(dbURL);

module.exports.getTable = () => {
    return db.query(`select * from images`);
};
