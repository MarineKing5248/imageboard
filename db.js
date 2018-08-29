var spicedpg = require("spiced-pg");
const secrets = require("./secrets.json");
const dbURL = secrets.dbURL;
const db = spicedpg(dbURL);

module.exports.getImages = function() {
    var query = `SELECT *
    FROM images
    ORDER BY id DESC`;
    return db.query(query);
};

module.exports.getCurrentImage = function(id) {
    return db.query(`SELECT * FROM images WHERE id=$1`, [id]);
};

module.exports.saveFile = function(url, title, description, username) {
    var query = `INSERT INTO images (url,title, description,username)
    VALUES ($1,$2,$3,$4) returning url,title`;
    return db.query(query, [
        url || null,
        title || null,
        description || null,
        username || null
    ]);
};
