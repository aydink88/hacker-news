import { useLayoutEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";
import { useAppContext } from "../context/AppContext";

export default function AuthPage() {
  const [authChecked, setAuthChecked] = useState(false);

  const { user } = useAppContext();
  const navigate = useNavigate();

  useLayoutEffect(() => {
    if (user?._id) {
      navigate("/");
    }
    setAuthChecked(true);
  }, [navigate, user?._id]);

  if (!authChecked) {
    return <h1>Loading</h1>;
  }

  return (
    <div>
      <p>You have to be logged in to submit.</p>
      <LoginForm />
      <br />
      <RegisterForm />
    </div>
  );
}
