import { useContext, useEffect, useRef } from "react";
import { UserContext } from "../userContext";
import { Link } from "react-router-dom";
import { Typography } from "@material-tailwind/react";
import Lottie from "lottie-react";
import errorAnimation from "../assets/error.json";
import loginErrorAnimation from "../assets/loginError.json";

export default function Error() {
  const { user, setUser } = useContext(UserContext);
  return (
    <div className="h-screen flex justify-center items-center">
      <div className="grid grid-cols-1 w-2/5">
        {!!user ? (
          <>
            <Lottie animationData={errorAnimation} />
            <div className="mx-auto">
              <Typography className="">
                <div className="mx-auto">
                  <Typography className="mb-2 text-gray-900 font-Poppins font-medium text-2xl">
                    Oops, something went wrong!{" "}
                    <Link
                      to="/"
                      className="hover:underline hover:underline-offset-4"
                    >
                      Go back?
                    </Link>
                  </Typography>
                </div>
              </Typography>
            </div>
          </>
        ) : (
          <>
            <Lottie animationData={loginErrorAnimation} loop={true} />
            <div className="mx-auto">
              <Typography className="mb-2 text-gray-900 font-Poppins font-medium text-xl">
                Oops, something went wrong!{" "} 
                <Link
                  to="/login"
                  className="hover:underline hover:underline-offset-4"
                >
                  Maybe try logging in first?
                </Link>
              </Typography>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
