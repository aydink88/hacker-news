import axios from "axios";
import { type FormEventHandler, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

export default function LoginForm() {
  const register_username_ref = useRef<HTMLInputElement>(null);
  const register_email_ref = useRef<HTMLInputElement>(null);
  const register_password_ref = useRef<HTMLInputElement>(null);

  const { setUser } = useAppContext();
  const navigate = useNavigate();

  const handleRegister: FormEventHandler = (e) => {
    e.preventDefault();
    const uname = register_username_ref.current?.value;
    const pw = register_password_ref.current?.value;
    const email = register_email_ref.current?.value;
    if (!uname || !email || !pw) {
      return;
    }
    axios
      .post("/api/v1/auth/signup", { username: uname, password: pw, email })
      .then(({ data }) => {
        setUser(data);
        navigate("/");
      })
      .catch((e) => console.log(e));
  };

  return (
    <>
      <strong>Create Account</strong>
      <form className="auth-form" onSubmit={handleRegister}>
        <div className="form-control">
          <label htmlFor="register_username">username: </label>
          <input
            ref={register_username_ref}
            type="text"
            name="register_username"
            size={20}
            autoCorrect="off"
            spellCheck="false"
            autoCapitalize="none"
            autoFocus={true}
          />
        </div>
        <div className="form-control">
          <label htmlFor="register_email">email: </label>
          <input
            ref={register_email_ref}
            type="email"
            name="register_email"
            size={20}
            autoCorrect="off"
            spellCheck="false"
            autoCapitalize="none"
            autoFocus={true}
          />
        </div>
        <div className="form-control">
          <label htmlFor="register_password">password: </label>
          <input ref={register_password_ref} type="password" name="register_password" size={20} />
        </div>
        <button type="submit">Login</button>
      </form>
    </>
  );
}
