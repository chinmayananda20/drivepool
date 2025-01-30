const Chats = require("./models/Chats");
const Conversation = require("./models/Conversation");
const Notifications = require("./models/Notifications");
const User = require("./models/User");
const Request = require("./models/Requests");
module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("New client connected");
    socket.on("createChat", async (data) => {
      await data.sort();
      const chats = await Chats.find({});
      let chat;
      if (chats.length === 0) {
        convo = await Conversation.create({
          messages: [],
        });
        chat = await Chats.create({
          users: data,
          conversation_id: convo._id,
        });
      } else {
        const flag = await Chats.findOne({ users: data });

        if (!flag) {
          convo = await Conversation.create({
            messages: [],
          });
          chat = await Chats.create({
            users: data,
            conversation_id: convo._id,
          });
        }
      }
    });
    socket.on("fetchChats", async (id) => {
      const chats = await Chats.find({});
      const my_chats = chats.filter((chat) => chat.users.includes(id));
      let data = [];
      for (let i = 0; i < my_chats.length; i++) {
        let id1 = my_chats[i].users[0];
        let user1 = await User.findOne({ _id: id1 });
        let id2 = my_chats[i].users[1];
        let user2 = await User.findOne({ _id: id2 });
        data[i] = {
          _id: my_chats[i]._id,
          users: { user1: [id1, user1.name], user2: [id2, user2.name] },
          createdAt: my_chats[i].createdAt,
          updatedAt: my_chats[i].updatedAt,
          conversation_id: my_chats[i].conversation_id,
        };
      }
      data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      socket.emit("receiveChats", data);
    });

    socket.on("sendMessage", async (data) => {
      const { conversation_id, sender, receiver_id, chat_id, message } = data;
      let conversation = await Conversation.findOne({ _id: conversation_id });
      conversation.messages.push({ user: sender, message });
      conversation.save();
      let chat = await Chats.findOne({ chat_id });
      io.emit("receiveMessage", {
        convo_id: conversation_id,
        chat,
        sender,
        rec_id: receiver_id,
        chat_id,
        message,
      });
    });
    socket.on("openChat", async (_id) => {
      let conversation = await Conversation.findOne({ _id });
      socket.emit("takeChats", conversation.messages);
    });
    socket.on("updatechat", async (_id) => {
      const chat = await Chats.findOne({ _id });
      const currentTime = new Date();
      chat.updatedAt = currentTime;
      chat.save();
    });
    socket.on("get_notifications_array", async (_id) => {
      const n = await Notifications.findOne({ user_id: _id });

      if (n) {
        console.log(_id);
        socket.emit("receive_notifications_array", n.chat_notification_on);
      } else {
        console.log(_id);
        const n = await Notifications.create({
          user_id: _id,
          chat_notification_on: [],
        });
        socket.emit("receive_notifications_array", n.chat_notification_on);
      }
    });
    socket.on("add_notification", async (data) => {
      console.log("adding");
      const { user_id, chat_id } = data;
      const n = await Notifications.findOne({ user_id: user_id });
      n.chat_notification_on = [...n.chat_notification_on, chat_id];
      await n.save();

      io.emit("receive_notifications", { id: user_id, chat_id });
      console.log("publishde");
    });
    socket.on("remove_notification", async (data) => {
      const { user_id, _id } = data;
      const n = await Notifications.findOne({ user_id: user_id });

      const new_n = n.chat_notification_on.filter((obj) => obj !== _id);

      n.chat_notification_on = new_n;
      await n.save();
    });
    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
    socket.on("send_req", async (data) => {
      console.log(data);
      const { receiver, sender, ride_id, sender_name, from, to } = data;
      let req = await Request.create({
        sender: sender,
        receiver: receiver,
        ride_id: ride_id,
        sender_name: sender_name,
        from: from,
        to: to,
        accepted: false,
        message: null,
      });
      io.emit("receive_req", req);
    });
    socket.on("get_req", async (data) => {
      const { sender, ride_id } = data;
      const req = await Request.findOne({ sender, ride_id });
      socket.emit("rec_req", req);
    });
    socket.on("getmynotifications", async (_id) => {
      const req = await Request.find({ receiver: _id });
      socket.emit("rec_urnotifications", req);
    });
    socket.on("reject_ride", async ({_id,user_name}) => {
      const req = await Request.findOne({ _id });
      console.log("req",req)
      let newreq =await  Request.create({
        sender: req.receiver,
        receiver: req.sender,
        sender_name: user_name,
        from: req.from,
        to: req.to,
        message: "Your Request has been Rejected",
      });
      const x = await Request.findByIdAndDelete({ _id });

      io.emit("receive_req", newreq);
    });

    socket.on("accept_ride",async ({_id,user_name,name}) =>{
      const req = await Request.findOne({ _id });
      req.message =  `Enjoy The Ride with ${name}`
      req.save()
      let newreq =await  Request.create({
        sender: req.receiver,
        receiver: req.sender,
        sender_name: user_name,
        from: req.from,
        to: req.to,
        message: "Your Request has been Accepted! Enjoy your Ride",
      });

      io.emit("receive_req", newreq);
    })
  });
};
