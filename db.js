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
    return db.query(`select * from images
                    order by id desc
                    limit 3`);
};

module.exports.getImage = (id) => {
    return db.query(`select * from images where id=${id}`);
};

module.exports.getMoreImages = (lastId) => {
    return db.query(
        `SELECT url, title, id,(
        select id from images
        order by id asc
        limit 1
        ) as "endId" from images
        WHERE id < $1
        ORDER BY id DESC
        LIMIT 3`,
        [lastId]
    );
};

module.exports.insertImage = (data) => {
    return db.query(
        `insert into images (url, username, title, description)
        values ($1, $2, $3, $4)`,
        [data.awsurl, data.username, data.title, data.description]
    );
};
