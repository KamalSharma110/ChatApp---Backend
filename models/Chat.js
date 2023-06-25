const mongodb = require("mongodb");

const { getDb } = require("../utils/database");

module.exports = class Chat {
  static createRecentChats(data) {
    const db = getDb();
    return db.collection("RecentChats").updateOne(
      {
        _id: new mongodb.ObjectId(data.currentUserId),
      },
      {
        $addToSet: {
          recentChats: {
            date: data.date,
            combinedId: data.combinedId,
            userInfo: {
              displayName: data.displayName,
              localId: data.localId,
              photoUrl: data.photoUrl,
            },
          },
        },
      },
      { upsert: true }
    );
  }

  static createChat(combinedId) {
    const db = getDb();
    return db.collection("Chats").insertOne({
      _id: combinedId,
      messages: [],
    });
  }

  static getRecentChats(userId) {
    const db = getDb();
    return db
      .collection("RecentChats")
      .findOne({ _id: new mongodb.ObjectId(userId) });
  }

  static updateRecentChats(id, combinedId, lastMessage) {
    const db = getDb();
    return db.collection("RecentChats").updateOne(
      { _id: new mongodb.ObjectId(id), "recentChats.combinedId": combinedId },
      {
        $set: {
          "recentChats.$.date": new Date(),
          "recentChats.$.lastMessage": lastMessage,
        },
      }
    );
  }

  static sendChat(data) {
    const db = getDb();
    return db.collection("Chats").updateOne(
      { _id: data.combinedId },
      {
        $push: {
          messages: {
            _id: new mongodb.ObjectId(),
            text: data.text,
            image: data.imagePath,
            senderId: data.senderId,
            date: data.date,
          },
        },
      },
      // { upsert: true }
    );
  }

  static getChats(combinedId) {
    const db = getDb();
    return db.collection("Chats").findOne({ _id: combinedId });
  }
};
