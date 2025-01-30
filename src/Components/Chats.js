import React, { useEffect, useState, useRef } from "react";
import jwt from "jsonwebtoken";
import { IoSend } from "react-icons/io5";
import { GoDotFill } from "react-icons/go";
export default function Chats(props) {
  const [myChats, setmyChats] = useState([]);
  const [user_id, setuser_id] = useState("");
  const [present_chat, setpresent_chat] = useState(null);
  const [present_chat_name, setpresent_chat_name] = useState(null);
  const [message, setmessage] = useState("");
  const [receiver_id, setreceiver_id] = useState(null);
  const [conversation_id, setconversation_id] = useState(null);
  const [texts, settexts] = useState([]);
  const [on_notify, seton_notify] = useState([])
  // Ref to the last message
  const messagesEndRef = useRef(null);

  const render_page = (token) => {
    const decodedToken = jwt.decode(token);
    if (decodedToken) {
      setuser_id(decodedToken.user.id);
      props.socket.emit("fetchChats", decodedToken.user.id);

    }
  };
  useEffect(() => {
    setmessage("");
  }, [conversation_id]);

  const handleSend = () => {
    let data = {
      sender: user_id,
      message,
      chat_id: present_chat,
      receiver_id,
      conversation_id,
    };
    props.socket.emit("sendMessage", data);
    settexts((prevChat) => [...prevChat, { user: user_id, message }]);
    const chat = myChats.find((obj) => obj._id === present_chat);
    props.socket.emit("updatechat", present_chat);
    props.socket.emit("add_notification",{user_id:receiver_id,chat_id:present_chat})

    setmyChats(myChats.filter((item) => item._id !== present_chat));
    setmyChats((prevChat) => [chat, ...prevChat]);
    setmessage(""); // Clear the input field after sending
  };

  // Function to scroll to the bottom of the chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    if(user_id!==""){  
    props.socket.emit("get_notifications_array",user_id)
    }

  }, [user_id])
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      render_page(token);
    }
  
    props.socket.on("receiveChats", (chats) => {
      setmyChats(chats); // Set chats directly from the response
    });

    props.socket.on("takeChats", (data) => {
      settexts(data);
    });
    
    props.socket.on("receive_notifications_array",(data)=>{
      seton_notify(data)
    })
    props.socket.on("receiveMessage", (data) => {
      const { convo_id, sender, rec_id, chat_id, chat, message } = data;
      if (rec_id === user_id) {
        let x = myChats.find((obj) => obj._id === chat_id);
        if (x) {
          if (convo_id === conversation_id) {
            settexts((prevChat) => [...prevChat, { sender, message }]);
            seton_notify((prevNotify) =>
              prevNotify.filter((notifyId) => notifyId !== chat_id)
            );
            props.socket.emit("remove_notification",{user_id,chat_id})
          } else {
            seton_notify((prevNotify) => {
              if (!prevNotify.includes(chat_id)) {
                return [...prevNotify, chat_id];
              }
              return prevNotify;
            });
          }
          const updatedChats = myChats.filter((item) => item._id !== chat_id); 
          setmyChats([x, ...updatedChats]);
          props.socket.emit("updatechat", chat_id);
        }
      }
    });

    // Clean up event listeners

    return () => {
      props.socket.off("receiveChats");
      props.socket.off("takeChats");
      props.socket.off("receiveMessage");
    };
  }, [user_id, props.socket, myChats]);

  // Scroll to bottom every time `texts` changes (new message)
  useEffect(() => {
    scrollToBottom();
  }, [texts]);

  const selectedchat = (_id) => {
    setpresent_chat(_id);
    seton_notify((prevNotify) =>
      prevNotify.filter((notifyId) => notifyId !== _id)
    );
    props.socket.emit("remove_notification",{user_id,_id})

    let wholechat = myChats.find((obj) => obj._id === _id);
    let name =
      wholechat.users.user1[0] === user_id
        ? wholechat.users.user2[1]
        : wholechat.users.user1[1];
    let id =
      wholechat.users.user1[0] === user_id
        ? wholechat.users.user2[0]
        : wholechat.users.user1[0];
    props.socket.emit("openChat", wholechat.conversation_id);
    setconversation_id(wholechat.conversation_id);
    setpresent_chat_name(name);
    setreceiver_id(id);
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      <div className="w-[25%] mx-5 my-2 rounded-xl shadow-lg bg-white overflow-scroll">
        <div className="font-bold text-center text-2xl text-purple-600 my-5">
          Drive Pool
        </div>
        {myChats.map((chat) => {
          return (
            <div
              onClick={() => {
                selectedchat(chat._id);
              }}
            >
              <div
                className={`flex justify-between my-3 items-center mx-2 ${
                  present_chat === chat._id ? "bg-gray-100" : "bg-white"
                }  rounded-lg py-3 text-xl shadow-sm font-medium hover:bg-gray-100`}
              >
                <p className="mx-2">
                  {chat.users.user1[0] === user_id
                    ? chat.users.user2[1]
                    : chat.users.user1[1]}
                </p>
                {/* <p className="text-sm mx-2 text-gray-600">
                  {new Date(chat.updatedAt).toUTCString().slice(17, 22)}
                </p> */}
                {on_notify.includes(chat._id) && (
                  <GoDotFill className="text-purple-600 mx-2" />
                )}
              </div>
            </div>
          );
        })}
      </div>
      {!present_chat && (
        <div className="flex min-h-screen items-center justify-center w-[70%]">
          <div className="b-2 rounded-lg bg-white p-5 list-disc">
            <li className="my-3">
              Be respectful and polite when chatting with others.
            </li>
            <li className="my-3">
              No harassment, or inappropriate words are allowed.
            </li>
            <li className="my-3">
              Keep the conversation friendly and positive.
            </li>
            <li className="my-3">
              Avoid sharing personal or sensitive information.
            </li>
            <li className="my-3">
              Violations may result in suspension from the platform.
            </li>
          </div>
        </div>
      )}
      {present_chat && (
        <div className="flex flex-col rounded-xl bg-white w-[70%] my-2 h-[97vh] overflow-hidden">
          <div className="h-[10%] rounded-t-xl bg-purple-600 flex items-center justify-between">
            <p className="text-2xl text-white mx-5 font-medium">
              {present_chat_name}
            </p>
          </div>

          <div className="msg min-h-[77%] max-h-[77%] overflow-y-scroll">
            {texts.map((chat, index) => {
              if (chat.user === user_id) {
                return (
                  <div key={index} className="flex justify-end">
                    <p className="bg-purple-600 m-5 text-white rounded-lg flex items-center px-2 py-1 max-w-[430px]">
                      {chat.message}
                    </p>
                  </div>
                );
              } else {
                return (
                  <div key={index} className="flex justify-start">
                    <p className="bg-gray-100 m-5 rounded-lg flex items-center px-2 py-1 max-w-[430px]">
                      {chat.message}
                    </p>
                  </div>
                );
              }
            })}
            {/* Add an invisible div at the bottom for scrolling */}
            <div ref={messagesEndRef} />
          </div>
          <div className="flex bg-gray-100 h-[10%] m-3 rounded-2xl items-center ">
            <input
              type="text"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => {
                setmessage(e.target.value);
              }}
              className="h-8 rounded-xl w-[90%] mx-5 p-3 outline-none"
            />
            <IoSend onClick={handleSend} className="text-2xl text-purple-600" />
          </div>
        </div>
      )}
    </div>
  );
}
//add delete convo and dele chat
//handle notifications
//handle send and  accept req
//responsiveness
