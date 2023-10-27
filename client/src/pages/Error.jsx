import { useContext, useEffect, useRef } from "react";
import { UserContext } from "../userContext";
import Lottie from "lottie-react";
import errorAnimation from "../assets/error.json";
import loginErrorAnimation from "../assets/loginError.json";

export default function Error() {
  const { user, setUser } = useContext(UserContext);
  const container = useRef(null);

  const animationData = !!user ? errorAnimation : loginErrorAnimation;
  return (
    <div className="h-screen flex justify-center items-center">
      <div className="">
        {!!user ? (
          <Lottie animationData={errorAnimation} />
        ) : (
          <Lottie animationData={loginErrorAnimation} />
        )}
      </div>
    </div>
  );
}
