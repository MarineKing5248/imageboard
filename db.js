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

exports.selectComments = image_id => {
    const q = `
        SELECT comment, username FROM comments
        WHERE image_id = ($1);
    `;
    return db.query(q, [image_id]);
};
exports.insertComments = (image_id, comment, username) => {
    const q = `
    INSERT INTO comments (image_id, comment, username)
    VALUES ($1, $2, $3)
    RETURNING comment, username
    `;
    return db.query(q, [image_id, comment, username]);
};
