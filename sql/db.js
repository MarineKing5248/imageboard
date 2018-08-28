var spicedpg = require("spiced-pg");

let dbURL = "postgres:postgres:postgres@localhost:5432/template1";
// if (process.env.DATABASE_URL) {
//     dbURL = process.env.DATABASE_URL;
// } else {
//     const secrets = require("./secrets.json");
//     dbURL = secrets.dbURL;
// }
const db = spicedpg(dbURL);

module.exports.getImages = function() {
    var query = `SELECT * FROM images
                 ORDER BY created_at DESC`;
    return db.query(query);
};

module.exports.saveFile = function(url, title, description, username) {
    var query = `INSERT INTO images (url, title, description, username)
    VALUES ($1, $2, $3, $4)`;
    return db.query(query, [
        url || null,
        title || null,
        description || null,
        username || null
    ]);
};
