import React from "react";
import { useNavigate } from "react-router-dom";
import { useState,useEffect } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
export default function Forgotpassword() {
  const [email, setemail] = useState("");
  const [flag, setflag] = useState(false);
  const [inputotp, setinputotp] = useState();
  const [otp, setotp] = useState(0);
  const [flag2, setflag2] = useState(false);
  const [newpassword, setnewpassword] = useState("");
  const [loader, setloader] = useState(false);
  const navigate = useNavigate();
  
  
  const handleOnChange = (e) => {
    if (e.target.name === "email") {
      setemail(e.target.value);
    } else if (e.target.name === "inputotp") {
      setinputotp(e.target.value);
    } else if (e.target.name === "newpassword") {
      setnewpassword(e.target.value);
    }
  };
  const sendmail = async (e) => {
    e.preventDefault();
    console.log("entered")
    const random = Math.floor(Math.random() * 9000) + 1000;
    setotp(random);
    const data = { email, otp: random };
    setloader(true);
    let response = await fetch("http://localhost:5000/api/forgotpassword", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const res = await response.json();
    console.log(res);
    if (res.error) {
      setloader(false);
      toast.error("Error!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } else if (res.message) {
        toast.success("Email sent", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
      setloader(false);
      setflag(true);
    }
  };
  const verify = async (e) => {
    e.preventDefault();

    if (otp === parseInt(inputotp)) {
      setflag2(true);
      setflag(false);
      console.log("yes");
      toast.success("Verified Successfully", {
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
      console.log("no");

      setflag(false);
      setemail("");
      setinputotp();
      toast.error("Error!", {
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
  const updatePassword = async () => {
    const data = { email,password: newpassword };
    let response = await fetch("http://localhost:5000/api/resetpassword", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const res = await response.json();

    if (res.error) {
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
    } else if (res.success) {
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
      setInterval(() => {
        navigate("/login");
      }, 4000);
    }
  };
  return (
    <div>
      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <Link
            href="#"
            className="flex flex-col items-center mb-6 text-2xl font-semibold text-purple-600 dark:text-white"
          >
            
            Drive Pool
          </Link>
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Forgot Password?
              </h1>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                or{" "}
                <Link
                  href="/login"
                  className="font-medium text-purple-600 hover:underline dark:text-purple-500"
                >
                  Log in
                </Link>
              </p>
              <div className="space-y-4 md:space-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Your email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={email}
                    onChange={handleOnChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-purple-600 focus:border-purple-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="name@company.com"
                    required=""
                  />
                </div>
                {loader && (
                  <div className="flex justify-center items-center h-screen">
                    <div className="animate-spin ease-linear rounded-full w-10 h-10 border-t-2 border-b-2 border-purple-500"></div>
                  </div>
                )}

                {!flag && !flag2 && !loader && (
                  <button
                    type="submit"
                    onClick={sendmail}
                    className="w-full text-white bg-purple-500 hover:bg-purple-700 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-800"
                  >
                    Continue
                  </button>
                )}

                {flag && (
                  <>
                    <div>
                      <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                        OTP has been sent to your email
                      </p>
                      <label
                        htmlFor="inputotp"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Enter your OTP
                      </label>
                      <input
                        type="password"
                        name="inputotp"
                        id="inputotp"
                        value={inputotp}
                        onChange={handleOnChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-purple-600 focus:border-purple-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="••••"
                        required=""
                      />
                    </div>
                    <button
                      type="submit"
                      onClick={verify}
                      className="w-full text-white bg-purple-500 hover:bg-purple-700 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-800"
                    >
                      Verify
                    </button>
                  </>
                )}

                {flag2 && (
                  <>
                    <div>
                      <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                        Reset Your Password
                      </p>
                      <label
                        htmlFor="inputotp"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Enter your New Password
                      </label>
                      <input
                        type="password"
                        name="newpassword"
                        id="newpassword"
                        value={newpassword}
                        onChange={handleOnChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-purple-600 focus:border-purple-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="••••••••"
                        required=""
                      />
                    </div>
                    <button
                      type="submit"
                      onClick={updatePassword}
                      className="w-full text-white bg-purple-500 hover:bg-purple-700 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-800"
                    >
                      Continue
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
