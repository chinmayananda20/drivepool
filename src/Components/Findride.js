import React from 'react'
import './styles/findride.css'
import { FaLocationArrow } from "react-icons/fa";
import { useState } from "react";
import { FaLocationDot } from "react-icons/fa6";
import { IoMdPersonAdd } from "react-icons/io";
import { FaLongArrowAltRight } from "react-icons/fa";
import { MdKeyboardArrowRight } from "react-icons/md";
export default function Findride ()  {
    const [from, setfrom] = useState("");
    const [to, setto] = useState("");
    const [date, setdate] = useState("");
    const [persons, setpersons] = useState("");
    const [exact_result, setexact_result] = useState(null);
    const [relevant_result, setrelevant_result] = useState([]);
    const handleChange = (e) => {
        if (e.target.name === "from") {
          setfrom(e.target.value);
        } else if (e.target.name === "to") {
          setto(e.target.value);
        } else if (e.target.name === "date") {
          setdate(e.target.value);
        } else if (e.target.name === "persons") {
          setpersons(e.target.value);
        }
      };

      const handleSearch = async (e) => {
        e.preventDefault();
        const data = { from };
        let response = await fetch("http://localhost:5000/api/searchresults", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        const res = await response.json();
       
    

        let x = persons;
        setpersons("");
        const p = parseInt(x, 10);
        const exact_response =await res.filter(
          (obj) =>
            obj.from === from.toLowerCase() &&
            obj.to === to &&
            obj.persons === p &&
            obj.date === date
        );
        console.log(exact_response)
        setexact_result(exact_response);
        let relevant_response =await res.filter((obj) => obj.from === from.toLowerCase());
        relevant_response = relevant_response.filter(
          (item) => !exact_response.includes(item)
        );
        console.log("relevant",relevant_response)
        setrelevant_result(relevant_response);
        setfrom("");
        setto("");
        setdate("");
      };
  return (
    <div className='min-h-screen'>
         <div className="banner4 h-[600px] flex justify-center xl:block">
        <div className="rounded bg-white w-[80%] xl:w-[30%] m-10 xl:m-16 flex flex-col items-center">
          <div className="text-3xl p-6 text-purple-600 font-bold text-center">
            Find Your Ride
          </div>
          <div className="my-2 flex flex-col w-full items-center">
            <div className="flex items-center my-2 xl:w-[350px] xl:justify-start">
              <p className="text-lg font-medium ">Starting from </p>
              <FaLocationArrow className="mx-2" />
            </div>
            <input
              type="text"
              onChange={handleChange}
              value={from}
              id="from"
              name="from"
              className="bg-white  rounded w-[200px] xl:w-[350px] mx-2 border  border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 text-base outline-none text-gray-700 py-1 px-5 "
            />
          </div>
          <div className="my-2 flex flex-col w-full items-center">
            <div className="flex items-center my-2 xl:w-[350px] xl:justify-start">
              <p className="text-lg font-medium">Destination</p>
              <FaLocationDot className="mx-2" />
            </div>
            <input
              type="text"
              onChange={handleChange}
              id="to"
              name="to"
              value={to}
              className="bg-white rounded w-[200px] xl:w-[350px] mx-2 border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 text-base outline-none text-gray-700 py-1 px-3 "
            />
          </div>
          <div className="my-2 flex flex-col w-full items-center">
            <div className="flex items-center my-2 xl:w-[350px] xl:justify-start">
              <p className="text-lg font-medium">Persons</p>
              <IoMdPersonAdd className="mx-2 text-xl" />
            </div>
            <input
              type="text"
              onChange={handleChange}
              id="persons"
              name="persons"
              value={persons}
              className="bg-white rounded w-[200px] xl:w-[350px] mx-2 border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 text-base outline-none text-gray-700 py-1 px-3 "
            />
          </div>
          <div className="my-2 flex flex-col w-full items-center">
            <div className="flex items-center my-2 xl:w-[350px] xl:justify-start">
              <p className="text-lg font-medium">Date</p>
            </div>
            <input
              type="date"
              id="date"
              name="date"
              value={date}
              onChange={handleChange}
              className="bg-white rounded w-[200px] xl:w-[350px] mx-2 border border-gray-300  py-1 px-3 "
            />
          </div>
          <button
            onClick={handleSearch}
            className="rounded bg-purple-600 m-6  py-2 px-10 text-white"
          >
            Search
          </button>
        </div>
      </div>

      {exact_result && exact_result.length === 0 && (
        <div className="w-full flex flex-col items-center">
          <div className="text-3xl text-center text-purple-600 font-bold ">
            Results
          </div>
          Sorry! No rides available.
        </div>
      )}
      {exact_result &&
        exact_result.length > 0 &&
        exact_result.map((ride) => {
          return (
            <div className="w-full flex flex-col items-center">
              <div className="text-3xl text-center text-purple-600 font-bold ">
                Results
              </div>
              <a className="rounded-lg  shadow-lg w-[80%] hover:bg-gray-100" href={`http://localhost:3000/ride/${ride._id}`}>
                <div >
                  <div className="flex justify-between">
                    <div className="mt-10 mb-2 mx-10 w-full">
                      <div className="text-2xl font-medium flex items-center flex-col items-center md:flex-row">
                        {ride.from}
                        <FaLongArrowAltRight className="text-4xl text-purple-600 mx-10" />
                        {ride.to}
                      </div>
                      <div className="font-medium my-2">{ride.date}</div>
                      <div className="font-medium my-2">{ride.persons}</div>
                    </div>
                    <div>
                      <MdKeyboardArrowRight className=" font-bold m-5 text-3xl" />
                      <div className="text-3xl mr-8 mt-16 text-purple-600">
                        {ride.amount}
                      </div>
                    </div>
                  </div>
                  <hr />
                  <div className="flex justify-between">
                    <div className="mx-10 my-2">
                      <div className="text-sm my-2 font-medium text-gray-600">
                        By {ride.name}
                      </div>
                      <div className="font-medium">
                        {ride.vechileName} {ride.vechileNumber}
                      </div>
                    </div>
                    <button className="rounded bg-purple-600 m-6  py-2 px-10 text-white">
                      More info.
                    </button>
                  </div>
                </div>
              </a>
            </div>
          );
        })}
      {relevant_result && relevant_result.length > 0 && (
        <div className="text-3xl text-center text-purple-600 font-bold ">
          Relevant Results
        </div>
      )}
      {relevant_result &&
        relevant_result.length > 0 &&
        relevant_result.map((ride) => {
          return (
            <div className="w-full flex flex-col items-center mt-16">
              <a className="rounded-lg  shadow-lg w-[80%] hover:bg-gray-100" href={`http://localhost:3000/ride/${ride._id}`}>
                <div >
                  <div className="flex justify-between">
                    <div className="mt-10 mb-2 mx-10 w-full">
                      <div className="text-2xl font-medium flex items-center flex-col items-center md:flex-row">
                        {ride.from}
                        <FaLongArrowAltRight className="text-4xl text-purple-600 mx-10" />
                        {ride.to}
                      </div>
                      <div className="font-medium my-2">{ride.date}</div>
                      <div className="font-medium my-2">{ride.persons}</div>
                    </div>
                    <div>
                      <MdKeyboardArrowRight className=" font-bold m-5 text-3xl" />
                      <div className="text-3xl mr-8 mt-16 text-purple-600">
                        {ride.amount}
                      </div>
                    </div>
                  </div>
                  <hr />
                  <div className="flex justify-between">
                    <div className="mx-10 my-2">
                      <div className="text-sm my-2 font-medium text-gray-600">
                        By {ride.name}
                      </div>
                      <div className="font-medium">
                        {ride.vechileName} {ride.vechileNumber}
                      </div>
                    </div>
                    <button className="rounded bg-purple-600 m-6  py-2 px-10 text-white">
                      More info.
                    </button>
                  </div>
                </div>
              </a>
            </div>
          );
        })}
    </div>
  )
}
