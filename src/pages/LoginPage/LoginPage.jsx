import { useEffect, useRef } from "react";

import { useNavigate } from "react-router-dom";

function LoginPage() {
  let emailInput = useRef(null);
  let passwordInput = useRef(null);
  let navigator = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("sessionid") != null) {
      navigator("/projects");
    }
  }, []);

  async function login(event) {
    event.preventDefault();
    console.log(emailInput.current.value);
    console.log(passwordInput.current.value);
    const response = await fetch("http://lizard-studios.at:10187/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: emailInput.current.value,
        password: passwordInput.current.value,
      }),
    });
    const responseJSON = await response.json();
    console.log(responseJSON);

    if (response.status === 200) {
      localStorage.setItem("sessionid", responseJSON.sessionid);
      navigator("/projects");
    }
  }

  return (
    <div className="w-full h-screen flex flex-col items-center px-4">
      <div className="rounded-md max-md:w-full xl:border-[1px] xl:shadow-md xl:w-1/4 flex py-8 px-8 h-auto mt-10 bg-white flex-col justify-center">
        <h1 className="font-medium text-2xl mt-3 text-center">Willkommen bei Neuro Label</h1>
        <form name="lastName" onSubmit={login}>
          <div className="mt-4">
            <label
              className="block text-gray-400 text-[15px] mt-4 mb-1"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="border shadow appearance-none rounded w-full py-2 px-3 text-sm text-gray-700 leading-tight focus:outline-none"
              ref={emailInput}
              type="email"
              name="email"
              placeholder="your email"
            />
            <label
              className="block text-gray-400 text-[15px] mt-4 mb-1"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="border shadow appearance-none rounded w-full py-2 px-3 text-sm text-gray-700 leading-tight focus:outline-none"
              ref={passwordInput}
              type="password"
              name="password"
              placeholder="your password"
            />
          </div>
          <button className="duration-300 hover:bg-blue-800 bg-blue-900 text-xl text-white w-full mt-6 py-2 rounded-sm font-semibold" type="submit">Sign In</button>
        </form>
        <div className="flex flex-col items-center mt-4 justify-center">
          <a className="text-blue-700 mb-2">Forgot password?</a>
          <a href="/register" className="text-blue-700">Registrierung</a>
          <a className="text-blue-700 mt-2">Privacy/Impressum</a>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
