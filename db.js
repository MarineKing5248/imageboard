var spicedpg = require("spiced-pg");
const secrets = require("./secrets.json");
dbURL = secrets.dbURL;
const db = spicedpg(dbURL);

module.exports.getImages = function() {
    var query = `SELECT id,url,title, username, tag
    FROM images
    ORDER BY id DESC
    LIMIT 12`;
    return db.query(query);
};
module.exports.getMoreImages = function(id) {
    console.log("id last", id);
    var query = `SELECT id,url,title,username, tag
    FROM images
    WHERE id<$1
    ORDER BY id DESC
    LIMIT 8`;
    return db.query(query, [+id]);
};

module.exports.getComments = function(id) {
    var query = `SELECT comment,username,created_at
    FROM comments
    WHERE image_id=$1
    ORDER BY id DESC`;
    return db.query(query, [+id]);
};

module.exports.getImage = function(id) {
    var query = `SELECT id,url,title,description,tag, created_at
    FROM images
    WHERE id=$1`;
    return db.query(query, [id]);
};

module.exports.upLoad = function(url, title, description, username, tag) {
    var query = `INSERT INTO images (url,title, description,username,tag)
    VALUES ($1,$2,$3,$4,$5) returning id,url,username,title,tag`;
    return db.query(query, [
        url || null,
        title || null,
        description || null,
        username || null,
        tag || null
    ]);
};

module.exports.writeComments = function(imageid, comment, username) {
    var query = `INSERT INTO comments (image_id, comment,username)
    VALUES ($1,$2,$3) returning comment,username,created_at`;
    return db.query(query, [imageid || null, comment || null, username || null]);
};

module.exports.selectTagImages = function(tag) {
    var query = `SELECT id,url,title,username,tag
    FROM images
    WHERE tag=$1
    ORDER BY id DESC
    LIMIT 8`;
    return db.query(query, [+tag]);
};
