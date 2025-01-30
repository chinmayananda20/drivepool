import React from "react";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaLongArrowAltRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import { MdVerified } from "react-icons/md";
import { IoChatbubblesOutline } from "react-icons/io5";
import jwt from "jsonwebtoken";
import { useNavigate } from "react-router-dom";
import { TiTick } from "react-icons/ti";
export default function Ride(props) {
  const navigate = useNavigate();
  const [loader, setloader] = useState(false);
  const { slug } = useParams();
  const [thisride, setthisride] = useState("");
  const [originCity, setoriginCity] = useState("");
  const [destinationCity, setdestinationCity] = useState("");
  const [userid, setuserid] = useState(null);
  const [flag, setflag] = useState(true);
  const [sent_req, setsent_req] = useState(false);
  const [user_name, setuser_name] = useState("")
  const fetchride = async (_id) => {
    let response = await fetch("http://localhost:5000/api/fetchrides", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const res = await response.json();
    // console.log("res", res);
    const flag = res.find((obj) => obj._id === _id);
    // console.log("falg", flag);
    setthisride(flag);
  };
  const decode = (token) => {
    const decodedToken = jwt.decode(token);
    setuserid(decodedToken.user.id);
    setuser_name(decodedToken.user.name)
    const sender = decodedToken.user.id;
    const data = { sender, ride_id: slug };
    props.socket.emit("get_req", data);
  };
  const handlechat = () => {
    setloader(true);
    const data = [userid, thisride.user_id];
    props.socket.emit("createChat", data);
    setTimeout(() => {
      navigate("/chats");
    }, 3000);
  };
  const send_req = (receiver,from ,to) => {
    if(!sent_req){const data = { ride_id: slug, receiver, sender: userid ,sender_name:user_name,from,to};
    props.socket.emit("send_req", data);
    setsent_req(true);}
  };
  useEffect(() => {
    setloader(false);
    fetchride(slug);
    const token = localStorage.getItem("token");
    decode(token);
    props.socket.on("rec_req", (data) => {
      
      if (data) {
        setsent_req(true);
      }
    });
  }, []);
  useEffect(() => {
    setoriginCity(thisride.from);
    setdestinationCity(thisride.to);
    if (userid === thisride.user_id) {
      setflag(false);
    } else {
      setflag(true);
    }
  }, [thisride]);
  const mapUrl =
    originCity && destinationCity
      ? `https://www.google.com/maps?q=${encodeURIComponent(
          originCity
        )}+to+${encodeURIComponent(destinationCity)}&output=embed`
      : null;
  if (loader) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin ease-linear rounded-full w-10 h-10 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }
  return (
    <section className="text-gray-600 body-font overflow-hidden min-h-screen ">
      <div className="container px-5 py-24 mx-auto">
        <div className="lg:w-4/5 mx-auto flex ">
          <div style={{ width: "500px", height: "500px" }}>
            <iframe
              title="MapDirections"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              src={mapUrl}
              allowFullScreen
            ></iframe>
          </div>
          <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
            <h2 className="text-sm title-font text-gray-500 tracking-widest">
              By {thisride.name}
            </h2>
            <h1 className="text-gray-900 text-3xl title-font font-medium mb-1">
              <div className="text-xl font-medium flex items-center flex-col items-center md:flex-row">
                {thisride.from}
                <FaLongArrowAltRight className="text-4xl text-purple-600 mx-10" />
                {thisride.to}
              </div>
            </h1>
            <div className="flex mb-4">
              <span className="flex items-center">
                <span className="text-gray-600 ml-3">+91 {thisride.phone}</span>
              </span>
            </div>

            <div className="font-medium ml-3">
              {thisride.date} {thisride.time}
            </div>
            <div className="font-medium ml-3">
              {thisride.vechileName} {thisride.vechileNumber}
            </div>
            <div className="font-medium ml-3 text-green-600">
              {thisride.persons} persons
            </div>

            <div className="flex font-medium ml-3 text-green-600 my-2 items-center">
              <MdVerified className="text-green-600 mx-2" />
              <Link href={`${thisride.aadhaar}`} className="hover:underline">
                My Aadhaar Card
              </Link>
            </div>
            <div className="flex font-medium ml-3 text-green-600 my-2 items-center">
              <MdVerified className="text-green-600 mx-2" />
              <Link href={`${thisride.DL}`} className="hover:underline">
                My Driving Lisence
              </Link>
            </div>
            <div className="ml-3">
              <Link href={`${thisride.carimg}`} className="hover:underline">
                <img
                  src={`${thisride.carimg}`}
                  alt="image"
                  className=" h-[100px]"
                />
              </Link>
            </div>
            <p className="leading-relaxed">
              Hey {thisride.name} here, Wanna join the ride. Lets go.
            </p>
            <hr />
            <div className="flex my-3 justify-between">
              <span className="title-font font-medium text-2xl text-gray-900">
                ₹{thisride.amount}
              </span>
              {flag && (
                <div className="flex">
                  <button
                    onClick={handlechat}
                    className="flex mx-2 items-center text-white bg-purple-600 border-0 py-2 px-6 focus:outline-none hover:bg-purple-500 rounded"
                  >
                    <IoChatbubblesOutline className="mr-2" />
                    Chat
                  </button>
                  <button
                    onClick={() => send_req(thisride.user_id,thisride.from,thisride.to)}
                    className="flex mx-2 text-white bg-purple-600 border-0 py-2 px-6 focus:outline-none hover:bg-purple-500 rounded"
                  >
                    {!sent_req && <p>Request</p>}
                    {sent_req && (
                      <div className="flex">
                        <TiTick className="text-2xl" />
                        Request sent
                      </div>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
