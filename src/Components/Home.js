import React, { useEffect, useState } from "react";
import jwt from "jsonwebtoken";
import "./styles/home.css";
import { Link } from "react-router-dom";
import { IoChatbubbleEllipses } from "react-icons/io5";
import { LuGitPullRequest } from "react-icons/lu";
import { IoIosNotifications } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import { MdCancel } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import img1 from "./images/search.jpg";
import img2 from "./images/publish.jpg";
import { FaLongArrowAltRight } from "react-icons/fa";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { MdClose } from "react-icons/md";
import img3 from "./images/myride.jpeg";

export default function Home(props) {
  const [loader, setloader] = useState(false);
  const [notifications, setnotifications] = useState(false);
  const [options, setoptions] = useState(false);
  const [delete_modal, setdelete_modal] = useState(false);
  const [delete_ride, setdelete_ride] = useState(false);
  const navigate = useNavigate();
  const [user_id, setuser_id] = useState(null);
  const [user_name, user_setname] = useState(null);
  const [myridepresent, setmyridepresent] = useState(false);
  const [mydrive, setmydrive] = useState([]);
  const [editmodal, seteditmodal] = useState(false);
  const [formname, setformname] = useState("");
  const [date, setdate] = useState("");
  const [from, setfrom] = useState("");
  const [to, setto] = useState("");
  const [on_notify, seton_notify] = useState([]);
  const [phone, setphone] = useState("");
  const [vechileNumber, setvechileNumber] = useState("");
  const [vechileName, setvechileName] = useState("");
  const [time, settime] = useState("");
  const [persons, setpersons] = useState("");
  const [amount, setamount] = useState("");
  const [DL, setDL] = useState("");
  const [aadhaar, setaadhaar] = useState("");
  const [carimg, setcarimg] = useState("");
  const [editingid, seteditingid] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [deleting_ride_id, setdeleting_ride_id] = useState("");
  const [contact_email, setcontact_email] = useState("");
  const [contact_message, setcontact_message] = useState("");
  const [contact_name, setcontact_name] = useState("");
  const [contact_section, setcontact_section] = useState(false);
  const [my_notificatins, setmy_notificatins] = useState([]);
  const [flag, setflag] = useState(false);
  const render_page = async (token) => {
    setloader(true);
    if (token) {
      const decodedToken =  jwt.decode(token);
      setuser_id(decodedToken.user.id);
      user_setname(decodedToken.user.name);
      fetchrides(decodedToken.user.id);
      getmynotifications(decodedToken.user.id);
    }
    setloader(false);
  };
  const getmynotifications = (_id) => {
    props.socket.emit("getmynotifications", _id);
  };
  useEffect(() => {
    if (user_id) {
      props.socket.emit("get_notifications_array", user_id);
    }
  }, [user_id]);
  const handlecontact_submit = async () => {
    const data = {
      email: contact_email,
      message: contact_message,
      name: contact_name,
    };
    setcontact_section(true);
    let response = await fetch("http://localhost:5000/api/addUserMessage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const res = await response.json();
    console.log(res);
    if ("success" in res) {
      toast.success(res.success, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
    setcontact_email("");
    setcontact_message("");
    setcontact_name("");
    setcontact_section(false);
  };
  const fetchrides = async (_id) => {
    setloader(true);
    try {
      let response = await fetch("http://localhost:5000/api/fetchrides", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const res = await response.json();
      const flag = res.some((obj) => obj.user_id === _id);
      setmyridepresent(flag);
      if (flag) {
        const object = res.filter((obj) => obj.user_id === _id);
        setmydrive(object);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error!cannot fetch rides", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
    setloader(false);
  };
  const reject_ride = (_id) => {
    const n = my_notificatins.find((obj) => obj._id === _id);
    n.message = "You Rejected This Ride";
    setmy_notificatins((prevNotify) =>
        prevNotify.filter((notifyId) => notifyId === n)) 
    
    props.socket.emit("reject_ride",{_id,user_name})
  };
  const accept_ride = (_id,name)=>{
    const n = my_notificatins.find((obj) => obj._id === _id);
    n.message = `Enjoy The Ride with ${name}`;
    setmy_notificatins((prevNotify) =>
      prevNotify.filter((notifyId) => notifyId === n)) 
    props.socket.emit("accept_ride",{_id,user_name,name})
  }
  useEffect(() => {
    props.socket.on("receive_notifications", (data) => {
      console.log("hit");
      const { id, chat_id } = data;
      console.log(id);
      console.log(user_id);
      if (id === user_id) {
        seton_notify((prevNotify) => {
          if (!prevNotify.includes(chat_id)) {
            return [...prevNotify, chat_id];
          }
          return prevNotify;
        });
      }
    });
    props.socket.on("rec_urnotifications", (data) => {
      if(data){

        setmy_notificatins(data);
      }
    });
    props.socket.on("receive_req", (data) => {
      const { receiver, sender, ride_id, from, to, sender_id } = data;
      if (receiver === user_id) {
        if (!my_notificatins.includes(data)) {

          setmy_notificatins((prev_my_notificatins)=>[...prev_my_notificatins, data]);
        }
        if (!notifications) {
          setflag(true);
        }
      }
    });
  }, [user_id]);
  const handlechat = (receiver_id) => {
    const data = [user_id, receiver_id];
    props.socket.emit("createChat", data);
    setTimeout(() => {
      navigate("/chats");
    }, 3000);
  };
  useEffect(() => {
    const token = localStorage.getItem("token");
    render_page(token);
  }, [refresh]);
  const deleteRide = async (_id) => {
    const data = { _id };
    try {
      setloader(true);
      let response = await fetch("http://localhost:5000/api/deleteride", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const res = await response.json();
      if ("success" in res) {
        toast.success(res.success, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    } catch (error) {
      toast.error("Error!cannot delete ride", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
    setdelete_ride(false);
    setRefresh((prev) => !prev);
  };

  const updateride = async (e) => {
    e.preventDefault();
    const data = {
      _id: editingid,
      name: formname,
      date,
      from,
      to,
      vechileName,
      vechileNumber,
      phone,
      time,
      persons,
      aadhaar,
      DL,
      amount,
      carimg,
    };
    try {
      let response = await fetch("http://localhost:5000/api/updateride", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const res = await response.json();
      if ("success" in res) {
        toast.success(res.success, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        closemodal();
        setRefresh((prev) => !prev);
      } else {
        toast.error("Error!Cannot update a ride", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    } catch (error) {
      toast.error("Error!!Cannot update a ride", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  const closemodal = () => {
    seteditmodal(false);
  };
  const handleOnchange = (e) => {
    if (e.target.name === "formname") {
      setformname(e.target.value);
    } else if (e.target.name === "date") {
      setdate(e.target.value);
    } else if (e.target.name === "from") {
      setfrom(e.target.value);
    } else if (e.target.name === "to") {
      setto(e.target.value);
    } else if (e.target.name === "phone") {
      setphone(e.target.value);
    } else if (e.target.name === "vechileNumber") {
      setvechileNumber(e.target.value);
    } else if (e.target.name === "time") {
      settime(e.target.value);
    } else if (e.target.name === "persons") {
      setpersons(e.target.value);
    } else if (e.target.name === "amount") {
      setamount(e.target.value);
    } else if (e.target.name === "DL") {
      setDL(e.target.value);
    } else if (e.target.name === "aadhaar") {
      setaadhaar(e.target.value);
    } else if (e.target.name === "carimg") {
      setcarimg(e.target.value);
    } else if (e.target.name === "vechileName") {
      setvechileName(e.target.value);
    } else if (e.target.name === "contact_name") {
      setcontact_name(e.target.value);
    } else if (e.target.name === "contact_email") {
      setcontact_email(e.target.value);
    } else if (e.target.name === "contact_message") {
      setcontact_message(e.target.value);
    }
  };
  const edit = (
    _id,
    name,
    date,
    from,
    to,
    vechileName,
    vechileNumber,
    phone,
    time,
    persons,
    aadhaar,
    DL,
    amount,
    carimg
  ) => {
    seteditmodal(true);
    setformname(name);
    setdate(date);
    setfrom(from);
    setto(to);
    setphone(phone);
    setvechileNumber(vechileNumber);
    setvechileName(vechileName);
    settime(time);
    setpersons(persons);
    setamount(amount);
    setDL(DL);
    setaadhaar(aadhaar);
    setcarimg(carimg);
    seteditingid(_id);
  };
  const closenotifications = () => {
    setnotifications(false);
  };
  const togglenotifications = () => {
    if (notifications) {
      setnotifications(false);
    } else {
      setflag(false);
      setnotifications(true);
      setoptions(false);
    }
  };
  const toggleOptions = () => {
    if (options) {
      setoptions(false);
    } else {
      setoptions(true);
      setnotifications(false);
    }
  };
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    toast.success("Logged out successfully", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };
  const deleteConfirmation = () => {
    setdelete_modal(true);
  };
  const closeDeleteModal = () => {
    setdelete_modal(false);
  };
  const deleteaccount = async () => {
    try {
      let response = await fetch("http://localhost:5000/api/deleteuser", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ _id: user_id }),
      });
      const res = await response.json();
      if ("success" in res) {
        localStorage.removeItem("token");
        navigate("/login");
        toast.success(res.success, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } else {
        toast.error(res.error, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    } catch (error) {
      toast.error(error.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };
  const delete_ride_confirm = (_id) => {
    setdelete_ride(true);
    setdeleting_ride_id(_id);
  };
  const handlepublish = () => {
    if (user_id) {
      navigate("/publishride");
    } else {
      navigate("/login");
    }
  };

  const handlefind = () => {
    if (user_id) {
      navigate("/findride");
    } else {
      navigate("/login");
    }
  };
  useEffect(() => {
    
  
    console.log(my_notificatins)
  }, [my_notificatins])
  
  if (loader) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin ease-linear rounded-full w-10 h-10 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }
  return (
    <>
      <div className="box ">
        <div className="w-full flex justify-center text-4xl text-white font-bold text-center  h-[620px] items-end">
          Unlock Savings on Your Ride and Earn as You Share – Drive Smart and
          Profit!
        </div>
      </div>

      {!user_id && (
        <div className="w-[100%] mt-14	 flex  justify-center">
          <div className="border-2 w-[40%] flex rounded-lg items-center p-2 justify-between flex-col md:flex-row">
            <p className="text-lg mx-5">Don't have an account?</p>

            <div className="flex flex-col items-center md:flex-row">
              <Link to="/signup">
                <button className="flex mx-2 my-2 md:my-0 text-white bg-purple-500 p-2 px-4 hover:bg-purple-600 rounded">
                  Signup
                </button>
              </Link>
              <Link to="/login">
                <button className="flex mx-2 my-2 md:my-0 text-purple-600 bg-white border border-purple-600 p-2 px-4 hover:bg-purple-600  hover:text-white rounded">
                  login
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {user_id && (
        <div className="w-[100%] mt-14	 flex flex-col items-center ">
          <div className=" border-b-2 border-purple-400 flex-col  md:flex-row w-[90%] flex rounded-lg items-center p-2 justify-end shadow-lg">
            <a href={"http://localhost:3000/chats"}>
              <div className="flex items-center  text-purple-600 mx-3 cursor-pointer  hover:text-gray-600 ">
                <IoChatbubbleEllipses className="text-3xl mx-2" />
                <p className="text-lg">Chats </p>
                {on_notify.length !== 0 && (
                  <div className="bg-red-600 w-3 h-3 rounded-lg mx-2"></div>
                )}
              </div>
            </a>
            <div
              className="flex items-center mt-3  text-purple-600 mx-3 cursor-pointer  hover:text-gray-600 "
              onClick={togglenotifications}
            >
              <IoIosNotifications className="text-3xl mx-2" />
              <p className="text-lg">Notifications </p>
              {flag && (
                <div className="bg-red-600 w-3 h-3 rounded-lg mx-2"></div>
              )}
            </div>
            <div
              className="flex items-center mt-3 text-purple-600 mx-3 cursor-pointer hover:text-gray-600 "
              onClick={toggleOptions}
            >
              <CgProfile className="text-3xl mx-2" />
              <p className="text-lg">Options </p>
            </div>
          </div>

          {options && (
            <div className="  w-[80%] flex p-2 justify-end  absolute top-[730px]  ">
              <div className=" w-[50%] md:w-[20%] shadow-lg  bg-white rounded-lg ">
                <div
                  onClick={logout}
                  className="p-2 rounded-lg text-purple-600 hover:bg-gray-200 w-[100%] text-center cursor-pointer"
                  type="button"
                >
                  Logout <b>{user_name}</b>
                </div>
                <hr />
                <div
                  onClick={deleteConfirmation}
                  className="p-2 rounded-lg text-purple-600 hover:bg-gray-200 w-[100%] text-center cursor-pointer"
                >
                  Delete Account
                </div>
              </div>
            </div>
          )}

          {notifications && (
            <div className="  w-[80%] flex p-2 justify-end  absolute top-[730px] md:right-[250px] max-h-[500px]">
              <div className=" w-[80%] md:w-[40%] shadow-lg  bg-white rounded-lg ">
                <div className="flex justify-between m-3 items-center text-purple-600 p-2 font-bold border-b-2 border-purple-400  ">
                  <p>Notifications</p>
                  <MdCancel
                    className="text-lg cursor-pointer"
                    onClick={closenotifications}
                  />
                </div>
                <div className="overflow-y-scroll">
                {my_notificatins.length === 0 && (
                  <div className="flex m-5">
                    <p>No Notification to show</p>
                  </div>
                )}
                {my_notificatins.length !== 0 &&
                  my_notificatins.map((noti) => {
                    return (
                      <div className="flex shadow-lg m-5 p-4 rounded flex-col  ">
                        <div className="flex items-center">
                          <div className="bg-purple-600 rounded-[50%] text-white w-16 h-16 rounded-[50%] p-3 flex justify-center items-center  ">
                            <LuGitPullRequest className="text-3xl" />
                          </div>
                          <div className="mx-3">
                            <div className="text-lg font-medium flex items-center flex-col items-center md:flex-row">
                              {noti.from}
                              <FaLongArrowAltRight className="text-4xl text-purple-600 mx-10" />
                              {noti.to}
                            </div>
                            <p>from {noti.sender_name}</p>
                          </div>
                        </div>
                        <hr className="my-3" />
                        {!noti.message && (
                          <div className="flex">
                            <button
                              onClick={() => reject_ride(noti._id)}
                              className="bg-red-600 rounded text-white mx-2 p-1 w-[150px] flex items-center justify-center"
                            >
                              Reject Ride
                            </button >
                            <button onClick={()=>accept_ride(noti._id,noti.sender_name)} className="bg-purple-600 rounded text-white mx-2 p-1 w-[150px] flex items-center justify-center">
                              Accept Ride
                            </button>
                          </div>
                        )}
                        {noti.message && <div className="flex items-center justify-between"><p>{noti.message} </p> 
                          <button onClick ={()=>handlechat(noti.sender)}className="bg-purple-600 rounded text-white mx-2 p-1 px-3 flex items-center justify-center">
                          Chat
                        </button>
                       </div> }
                      </div>
                    );
                  })}
              </div>
              </div>
            </div>
          )}
        </div>
      )}

      {delete_modal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className=" bg-white  m-2 rounded-lg shadow-xl w-[60%] md:w-[40%] bg-white p-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center">
              <p className="text-purple-600 md:text-2xl font-bold">
                Delete Acccount?
              </p>
              <MdCancel
                onClick={closeDeleteModal}
                className="text-purple-600 md:text-2xl cursor-pointer"
              />
            </div>
            <hr className="my-2 " />
            <p>Are you sure want to delete account?</p>
            <div className="flex justify-end">
              <button
                onClick={closeDeleteModal}
                className="  bg-purple-600 m-2 text-white rounded px-4 py-2"
              >
                Cancel
              </button>

              <button
                onClick={deleteaccount}
                className="bg-red-600 m-2 text-white rounded px-4 py-2"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {delete_ride && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className=" bg-white  m-2 rounded-lg shadow-xl w-[60%] md:w-[40%] bg-white p-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center">
              <p className="text-purple-600 md:text-2xl font-bold">
                Delete Ride?
              </p>
              <MdCancel
                onClick={closeDeleteModal}
                className="text-purple-600 md:text-2xl cursor-pointer"
              />
            </div>
            <hr className="my-2 " />
            <p>Are you sure want to delete Ride?</p>
            <div className="flex justify-end">
              <button
                onClick={closeDeleteModal}
                className="  bg-purple-600 m-2 text-white rounded px-4 py-2"
              >
                Cancel
              </button>

              <button
                onClick={() => deleteRide(deleting_ride_id)}
                className="bg-red-600 m-2 text-white rounded px-4 py-2"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {editmodal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="flex items-center bg-white flex-col m-2 rounded-lg shadow-xl w-[90%] md:w-[60%] bg-white p-4 max-h-[90vh] overflow-y-auto">
            <div className="text-3xl my-2 text-purple-600 font-bold w-[100%] flex justify-between items-center ">
              <p className="mx-16"> Edit Ride</p>
              <MdClose
                className="text-4xl cursor-pointer font-bold mx-6"
                onClick={closemodal}
              />
            </div>
            <form className="w-[80%] my-2">
              <div className="grid gap-6 mb-6 md:grid-cols-2 ">
                <div>
                  <label
                    htmlhtmlFor="formname"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    onChange={handleOnchange}
                    value={formname}
                    name="formname"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-500 dark:focus:border-purple-500"
                    placeholder="John"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlhtmlFor="date"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Date
                  </label>
                  <input
                    type="date"
                    onChange={handleOnchange}
                    name="date"
                    value={date}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-500 dark:focus:border-purple-500"
                    placeholder="Doe"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlhtmlFor="from"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Starting from
                  </label>
                  <input
                    type="text"
                    onChange={handleOnchange}
                    value={from}
                    name="from"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-500 dark:focus:border-purple-500"
                    placeholder="Enter starting city"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlhtmlFor="to"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Destination
                  </label>
                  <input
                    type="text"
                    onChange={handleOnchange}
                    name="to"
                    value={to}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-500 dark:focus:border-purple-500"
                    placeholder="Enter drop location"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlhtmlFor="vechileName"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Vechile Name
                  </label>
                  <input
                    type="text"
                    onChange={handleOnchange}
                    value={vechileName}
                    name="vechileName"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-500 dark:focus:border-purple-500"
                    placeholder="Swift Dzire"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlhtmlFor="phone"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Phone number
                  </label>
                  <input
                    type="tel"
                    onChange={handleOnchange}
                    name="phone"
                    value={phone}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-500 dark:focus:border-purple-500"
                    placeholder="123-45-678"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlhtmlFor="vechileNumber"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Vechicle Number
                  </label>
                  <input
                    type="text"
                    onChange={handleOnchange}
                    name="vechileNumber"
                    value={vechileNumber}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-500 dark:focus:border-purple-500"
                    placeholder="123-45-678"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlhtmlFor="time"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Time [24hrs]
                  </label>
                  <input
                    type="text"
                    onChange={handleOnchange}
                    name="time"
                    value={time}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-500 dark:focus:border-purple-500"
                    placeholder="13:45"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlhtmlFor="persons"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Number of Persons
                  </label>
                  <input
                    type="text"
                    onChange={handleOnchange}
                    name="persons"
                    value={persons}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-500 dark:focus:border-purple-500"
                    placeholder="Sharing seat availibility"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlhtmlFor="aadhaar"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Aadhaar Card (Upload drive link)
                  </label>
                  <input
                    type="text"
                    onChange={handleOnchange}
                    name="aadhaar"
                    value={aadhaar}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-500 dark:focus:border-purple-500"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlhtmlFor="DL"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Driving Lisence (Upload drive link)
                  </label>
                  <input
                    type="text"
                    onChange={handleOnchange}
                    name="DL"
                    value={DL}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-500 dark:focus:border-purple-500"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlhtmlFor="amount"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Amount
                  </label>
                  <input
                    type="text"
                    onChange={handleOnchange}
                    name="amount"
                    value={amount}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-500 dark:focus:border-purple-500"
                    placeholder="500/-"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlhtmlFor="carimg"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Car Images(Optional) (Upload drive link)
                  </label>
                  <input
                    type="text"
                    onChange={handleOnchange}
                    value={carimg}
                    name="carimg"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-500 dark:focus:border-purple-500"
                  />
                </div>
              </div>

              <button
                onClick={updateride}
                type="Publish Ride"
                className="text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-800"
              >
                Update
              </button>
            </form>
          </div>
        </div>
      )}
      {myridepresent &&
        mydrive.map((ride) => {
          return (
            <div className="flex flex-col items-center my-10" key={ride.id}>
              <h2 className="text-purple-600 text-2xl font-bold">My Rides</h2>
              <div className="rounded-lg shadow-lg w-[90%] my-5 flex flex-col items-center md:flex-row">
                <div className="w-[50%] flex justify-center items-center">
                  <img
                    src={img3}
                    className="w-[200px] h-[200px] rounded-full m-5"
                    alt=""
                  />
                </div>
                <div className="w-[50%] m-5">
                  <div className="text-xl font-medium flex items-center flex-col items-center md:flex-row">
                    {ride.from}
                    <FaLongArrowAltRight className="text-4xl text-purple-600 mx-10" />
                    {ride.to}
                  </div>
                  <div className="text-sm font-medium text-gray-600">
                    By {ride.name}
                  </div>
                  <div className="font-medium">
                    Starts on : {ride.date} {ride.time}
                  </div>
                  <div className="font-medium">
                    {ride.vechileName} {ride.vechileNumber}
                  </div>
                  <div className="font-medium">
                    Available for : {ride.persons} persons
                  </div>
                  <div className="font-medium">Rs.{ride.amount} / person</div>
                  <div className="flex my-5 flex-col items-center md:flex-row">
                    <button
                      className="bg-purple-600 rounded text-white m-3 p-2 w-[150px] flex items-center justify-center"
                      onClick={() =>
                        edit(
                          ride._id,
                          ride.name,
                          ride.date,
                          ride.from,
                          ride.to,
                          ride.vechileName,
                          ride.vechileNumber,
                          ride.phone,
                          ride.time,
                          ride.persons,
                          ride.aadhaar,
                          ride.DL,
                          ride.amount,
                          ride.carimg
                        )
                      }
                    >
                      <FaRegEdit className="text-lg mx-2" />
                      Edit Ride
                    </button>
                    <button
                      className="bg-red-600 rounded text-white m-3 p-2 w-[150px] flex items-center justify-center"
                      onClick={() => delete_ride_confirm(ride._id)}
                    >
                      <MdDelete className="text-lg mx-2" />
                      Delete Ride
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      <section className="text-gray-600 body-font m-14">
        <div className="container px-5 py-16 mx-auto">
          <div className="flex flex-wrap -mx-4 -mb-10 text-center">
            <div className="sm:w-1/2 mb-10 px-4">
              <div className="rounded-lg h-64 overflow-hidden">
                <img
                  alt="content"
                  className="object-cover object-center h-full w-full"
                  src={img1}
                />
              </div>
              <h2 className="title-font text-2xl font-medium text-purple-900 mt-6 mb-3">
                Search for a Ride
              </h2>
              <p className="leading-relaxed text-base">
                Search for the rides with the same destination on the same day
                to share the ride
              </p>
              <button
                onClick={handlefind}
                className="flex mx-auto mt-6 text-white bg-purple-500 border-0 py-2 px-5 focus:outline-none hover:bg-purple-600 rounded"
              >
                Search
              </button>
            </div>
            <div className="sm:w-1/2 mb-10 px-4">
              <div className="rounded-lg h-64 overflow-hidden">
                <img
                  alt="content"
                  className="object-cover object-center h-full w-full"
                  src={img2}
                />
              </div>
              <h2 className="title-font text-2xl font-medium text-purple-900 mt-6 mb-3">
                Publish a Ride
              </h2>
              <p className="leading-relaxed text-base">
                Publish a ride to share and earn money
              </p>
              <button
                onClick={handlepublish}
                className="flex mx-auto mt-6 text-white bg-purple-500 border-0 py-2 px-5 focus:outline-none hover:bg-purple-600 rounded"
              >
                Publish
              </button>
            </div>
          </div>
        </div>
      </section>
      {contact_section && (
        <div className="flex bg-purple-600 h-[500px] flex-col">
          <div className="text-2xl white">Submitting</div>
        </div>
      )}
      {!contact_section && (
        <div className="flex bg-purple-600 h-[500px] flex-col">
          <div className="flex justify-center w-[100%] text-5xl mt-5 font-bold text-white ">
            Contact Us
          </div>
          <div className="lg:w-1/2 md:w-2/3 mx-auto mt-10">
            <div className="flex flex-wrap -m-2">
              <div className="p-2 w-1/2">
                <div className="relative">
                  <label htmlFor="name" className="leading-7 text-white">
                    Name
                  </label>
                  <input
                    type="text"
                    onChange={handleOnchange}
                    value={contact_name}
                    id="name"
                    name="contact_name"
                    className="w-full bg-white  rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  />
                </div>
              </div>
              <div className="p-2 w-1/2">
                <div className="relative">
                  <label htmlFor="email" className="leading-7 text-white ">
                    Email
                  </label>
                  <input
                    type="email"
                    value={contact_email}
                    id="email"
                    onChange={handleOnchange}
                    name="contact_email"
                    className="w-full bg-white  rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  />
                </div>
              </div>
              <div className="p-2 w-full">
                <div className="relative">
                  <label htmlFor="message" className="leading-7 text-white ">
                    Message
                  </label>
                  <textarea
                    id="message"
                    onChange={handleOnchange}
                    value={contact_message}
                    name="contact_message"
                    className="w-full bg-white  rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
                  ></textarea>
                </div>
              </div>
              <div className="p-2 w-full">
                <button
                  onClick={handlecontact_submit}
                  className="flex mx-auto text-gray-600 bg-white border-0 py-2 px-8 focus:outline-none hover:bg-gray-200 rounded text-lg"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
