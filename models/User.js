const mongodb = require('mongodb');
const {getDb} = require('../utils/database');

module.exports = class User{
    constructor(name, email, password, image){
        this.name = name;
        this.email = email;
        this.password = password;
        this.image = image;
    }

    createUser(){
        const db = getDb();
        return db.collection('Users').insertOne(this);
    }

    static getUserById(userId){
        const db = getDb();
        return db.collection('Users').findOne({_id: new mongodb.ObjectId(userId)});
    }
    
    static getUserByEmail(email){
        const db = getDb();
        return db.collection('Users').findOne({email: email});
    }

    static searchUsers(name){
        const db = getDb();
        return db.collection('Users').find({name: {$eq: name}}).toArray();
    }
}