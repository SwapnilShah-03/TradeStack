//If you get a duplicate key error, delete the index of the collection in MongoDB Atlas
import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const fixedInputClass =
  "rounded-md appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 sm:text-md";

export default function Register() {
  const navigate = useNavigate();

  const [data, setData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    age: 18,
    gender: "",
    nationality: "",
    address: "",
    phone: 9999999999,
  });

  const handleValidation = () => {
    const {
      username,
      email,
      password,
      confirmPassword,
      age,
      gender,
      nationality,
      address,
      phone,
    } = data;
    if (
      username === "" ||
      email === "" ||
      password === "" ||
      confirmPassword === "" ||
      nationality === "" ||
      address === ""
    ) {
      toast.error("All fields are required");
      return false;
    } else if (username.length < 3) {
      toast.error("Username must be at least 3 characters long");
      return false;
    } else if (!email.includes("@")) {
      toast.error("Email must be valid");
      return false;
    } else if (age < 18) {
      toast.error("You must be atleast 18 years old to register");
    } else if (phone.length < 10) {
      toast.error("Invalid phone number entered");
    } else if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return false;
    } else if (password !== confirmPassword) {
      toast.error("Passwords must match");
      return false;
    } else {
      return true;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (handleValidation()) {
      const {
        username,
        email,
        password,
        age,
        gender,
        nationality,
        address,
        phone,
      } = data;
      try {
        const { data } = await axios.post("/register", {
          username,
          email,
          password,
          age,
          gender,
          nationality,
          address,
          phone,
        });
        if (data.status) {
          setData({
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
            age: 18,
            gender: "",
            nationality: "",
            address: "",
            phone: 9999999999,
          });
          toast.success("Registration successful, welcome!");
          navigate("/login");
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  return (
    <div className="h-full my-[3.7rem] flex items-center justify-center px-4 sm:px-6 lg:px-8 font-Outfit">
      <div className="max-w-md w-full items-center">
        <div className="mb-10">
          <div className="flex justify-center">
            <img
              alt="logo"
              className="h-[4rem] w-[4rem]"
              src="../../src/assets/images/logo.png"
            />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Signup to create an account
          </h2>
          <p className="mt-5 text-center text-md text-gray-600 ">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-blue-700 hover:text-blue-800"
            >
              Login
            </Link>
          </p>
        </div>
        <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-6">
          <div className="my-5">
            <label
              htmlFor="username"
              className="block text-md font-medium leading-6 text-gray-900 mb-1"
            >
              Username
            </label>
            <input
              type="text"
              onChange={handleChange}
              placeholder="Username"
              id="username"
              name="username"
              value={data.username}
              className={fixedInputClass}
              autoComplete="off"
            />
          </div>
          <div className="my-5">
            <label
              htmlFor="email"
              className="block text-md font-medium leading-6 text-gray-900 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              onChange={handleChange}
              placeholder="Email"
              id="email"
              name="email"
              value={data.email}
              className={fixedInputClass}
              autoComplete="off"
            />
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="my-0">
              <label
                htmlFor="age"
                className="block text-md font-medium leading-6 text-gray-900 mb-1"
              >
                Age
              </label>
              <input
                type="number"
                onChange={handleChange}
                placeholder="Age"
                id="age"
                name="age"
                value={data.age}
                className={fixedInputClass}
                autoComplete="off"
              />
            </div>
            <div className="my-0">
              <label
                htmlFor="gender"
                className="block text-md font-medium leading-6 text-gray-900 mb-1"
              >
                Gender
              </label>
              <div className="relative">
                <select
                  type="text"
                  onChange={handleChange}
                  placeholder="Gender"
                  id="gender"
                  name="gender"
                  value={data.gender}
                  className={fixedInputClass}
                >
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
            </div>
          </div>
          <div className="my-5">
            <label
              htmlFor="nationality"
              className="block text-md font-medium leading-6 text-gray-900 mb-1"
            >
              Nationality
            </label>
            <input
              type="text"
              onChange={handleChange}
              placeholder="Nationality"
              id="nationality"
              name="nationality"
              value={data.nationality}
              className={fixedInputClass}
              autoComplete="off"
            />
          </div>
          <div className="my-5">
            <label
              htmlFor="address"
              className="block text-md font-medium leading-6 text-gray-900 mb-1"
            >
              Address
            </label>
            <textarea
              type="text"
              onChange={handleChange}
              placeholder="Address"
              id="address"
              name="address"
              value={data.address}
              rows="4"
              className={fixedInputClass}
              autoComplete="off"
            />
          </div>
          <div className="my-5">
            <label
              htmlFor="phone"
              className="block text-md font-medium leading-6 text-gray-900 mb-1"
            >
              Phone Number
            </label>
            <input
              type="number"
              onChange={handleChange}
              placeholder="Phone Number"
              id="phone"
              name="phone"
              value={data.phone}
              className={fixedInputClass}
              autoComplete="off"
            />
          </div>
          <div className="my-5">
            <label
              htmlFor="password"
              className="block text-md font-medium leading-6 text-gray-900 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              onChange={handleChange}
              placeholder="Password"
              id="password"
              name="password"
              value={data.password}
              className={fixedInputClass}
            />
          </div>
          <div className="my-5">
            <label
              htmlFor="confirmPassword"
              className="block text-md font-medium leading-6 text-gray-900 mb-1"
            >
              Confirm Password
            </label>
            <input
              type="password"
              onChange={handleChange}
              placeholder="Confirm Password"
              id="confirmPassword"
              name="confirmPassword"
              value={data.confirmPassword}
              className={fixedInputClass}
            />
          </div>
          <button
            type="submit"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-md font-medium rounded-md text-white bg-blue-700 hover:bg-blue-800"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
