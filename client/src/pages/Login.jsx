import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useGoogleLogin } from "@react-oauth/google";
import { toast } from "react-hot-toast";
import { UserContext } from "../userContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";

const fixedInputClass =
  "rounded-md appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm";

export default function Login() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const [googleLogin, setGoogleLogin] = useState(false);

  const [data, setData] = useState({
    username: "",
    password: "",
  });

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const userInfoResponse = await fetch(
        import.meta.env.VITE_GOOGLE_AUTH_URL,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        }
      );
      const userInfo = await userInfoResponse.json();
      localStorage.setItem("userinfo", JSON.stringify(userInfo));
      setUser(userInfo);
      navigate("/market");
    },
  });

  const handleValidation = () => {
    const { username, password } = data;
    if (!googleLogin && (username === "" || password === "")) {
      toast.error("All fields are required");
      return false;
    } else {
      return true;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (handleValidation()) {
      const { username, password } = data;
      try {
        const { data } = await axios.post("/login", {
          username,
          password,
        });
        if (data.status) {
          setData({
            username: "",
            password: "",
          });
          setUser(data.user);
          navigate("/market");
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
    <div className="min-h-full h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full items-center mt-10">
        <div className="mb-10">
          <div className="flex justify-center">
            <img
              alt=""
              className="h-14 w-14"
              src="https://ik.imagekit.io/pibjyepn7p9/Lilac_Navy_Simple_Line_Business_Logo_CGktk8RHK.png?ik-sdk-version=javascript-1.4.3&updatedAt=1649962071315"
            />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Login to your account
          </h2>
          <p className="mt-5 text-center text-sm text-gray-600 ">
            Don't have an account yet?{" "}
            <Link
              to="/register"
              className="font-medium text-blue-700 hover:text-blue-600"
            >
              Register
            </Link>
          </p>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="-space-y-px">
            <div className="my-5">
              <label
                htmlFor="username"
                className="block text-sm font-medium leading-6 text-gray-900 mb-1"
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
              />
            </div>
            <div className="my-5">
              <label
                htmlFor="username"
                className="block text-sm font-medium leading-6 text-gray-900 mb-1"
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
          </div>
          <button
            type="submit"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-700 hover:bg-blue-800"
          >
            Login
          </button>
          <button
            onClick={() => {
              setGoogleLogin(true);
              login();
            }}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#DB4437] hover:bg-[#AE2B1F]"
          >
            <FontAwesomeIcon icon={faGoogle} className="py-1 pe-3" />
            Google Login
          </button>
        </form>
      </div>
    </div>
  );
}
