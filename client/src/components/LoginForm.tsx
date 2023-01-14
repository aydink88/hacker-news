import axios from "axios";
import { type FormEventHandler, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

export default function LoginForm() {
  const login_username_ref = useRef<HTMLInputElement>(null);
  const login_password_ref = useRef<HTMLInputElement>(null);

  const { setUser } = useAppContext();
  const navigate = useNavigate();

  const handleLogin: FormEventHandler = (e) => {
    e.preventDefault();
    const uname = login_username_ref.current?.value;
    const pw = login_password_ref.current?.value;
    if (!uname || !pw) {
      return;
    }
    axios
      .post("/api/v1/auth/signin", { username: uname, password: pw })
      .then(({ data }) => {
        setUser(data);
        navigate("/");
      })
      .catch((e) => console.log(e));
  };

  return (
    <>
      <strong>Login</strong>
      <form className="auth-form" onSubmit={handleLogin}>
        <div className="form-control">
          <label htmlFor="login_username">username: </label>
          <input
            ref={login_username_ref}
            type="text"
            name="login_username"
            size={20}
            autoCorrect="off"
            spellCheck="false"
            autoCapitalize="none"
            autoFocus={true}
          />
        </div>
        <div className="form-control">
          <label htmlFor="login_password">password: </label>
          <input ref={login_password_ref} type="password" name="login_password" size={20} />
        </div>
        <button type="submit">Login</button>
      </form>
    </>
  );
}
