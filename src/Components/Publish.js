import React from "react";
import "./styles/publish.css";
import { useState, useEffect } from "react";
import jwt from "jsonwebtoken";
import { toast } from "react-toastify";
export default function Publish() {
  const [loader, setloader] = useState(false);
  const [user_id, setuser_id] = useState(null);
  const [user_name, user_setname] = useState(null);
  const [name, setname] = useState(user_name);
  const [date, setdate] = useState("");
  const [from, setfrom] = useState("");
  const [to, setto] = useState("");
  const [phone, setphone] = useState("");
  const [vechileNumber, setvechileNumber] = useState("");
  const [vechileName, setvechileName] = useState("");
  const [time, settime] = useState("");
  const [persons, setpersons] = useState("");
  const [amount, setamount] = useState("");
  const [DL, setDL] = useState("");
  const [aadhaar, setaadhaar] = useState("");
  const [carimg, setcarimg] = useState("");

  const render_page = async (token) => {
    setloader(true);
    if (token) {
      const decodedToken = await jwt.decode(token);
      setuser_id(decodedToken.user.id);
      user_setname(decodedToken.user.name);
    }
    setloader(false);
  };
  useEffect(() => {
    if (user_name) {
      setname(user_name);
    }
  }, [user_name]);
  useEffect(() => {
    const token = localStorage.getItem("token");
    render_page(token);
  },[]);
  const handleOnchange = (e) => {
    if (e.target.name === "name") {
      setname(e.target.value);
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
    }
  };

  const submit = async (e) => {
    setloader(true);
    e.preventDefault();
    const data = {
      id: user_id,
      name,
      date,
      from,
      to,
      phone,
      vechileNumber,
      vechileName,
      time,
      persons,
      amount,
      DL,
      aadhaar,
      carimg,
    };
    try {
      let response = await fetch("http://localhost:5000/api/addride", {
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
    setname(user_name);
    setdate("");
    setfrom("");
    setto("");
    setphone("");
    setvechileNumber("");
    setvechileName("");
    settime("");
    setpersons("");
    setamount("");
    setDL("");
    setaadhaar("");
    setcarimg("");
    setloader(false);
  };
  if (loader) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin ease-linear rounded-full w-10 h-10 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }
  return (
    <div>
      <div className="banner3 h-[380px] flex justify-center items-center text-4xl font-bold text-white">
        Earn by sharing your journey now!
      </div>
      <div className="flex items-center flex-col">
        <div className="text-3xl my-4 text-purple-600 font-bold">
          Ride Details
        </div>
        <form className="w-[80%] my-2" onSubmit={submit}>
          <div className="grid gap-6 mb-6 md:grid-cols-2 ">
            <div>
              <label
                htmlFor="name"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Name
              </label>
              <input
                type="text"
                onChange={handleOnchange}
                value={name}
                name="name"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-500 dark:focus:border-purple-500"
                placeholder="John"
                required
              />
            </div>
            <div>
              <label
                htmlFor="date"
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
                htmlFor="from"
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
                htmlFor="to"
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
                htmlFor="vechileName"
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
                htmlFor="phone"
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
                htmlFor="vechileNumber"
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
                htmlFor="time"
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
                htmlFor="persons"
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
                htmlFor="aadhaar"
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
                htmlFor="DL"
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
                htmlFor="amount"
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
                htmlFor="carimg"
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
            type="Publish Ride"
            className="text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-800"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
