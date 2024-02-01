import { useNavigate } from "react-router-dom";
import { useRef, useEffect } from "react";
import { API_HOST } from "../../utils/api";

function RegisterPage() {
  useEffect(() => {
    if (localStorage.getItem("sessionid") != null) {
      navigator("/projects");
    }
  }, []);

  let emailInput = useRef(null);
  let firstnameInput = useRef(null);
  let lastnameInput = useRef(null);
  let passwordInput = useRef(null);
  let navigator = useNavigate();

  async function register(event) {
    event.preventDefault();
    const response = await fetch(`${API_HOST}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        first_name: firstnameInput.current.value,
        last_name: lastnameInput.current.value,
        password: passwordInput.current.value,
        email: emailInput.current.value,
      }),
    });
    const responseJSON = await response.json();
    console.log(responseJSON);

    if (response.statusCode === 200) {
      navigator("/login");
    }
  }

  return (
    <div className="min-w-full h-screen flex flex-col items-center">
      <div className="rounded-md max-md:w-full xl:border-[1px] xl:shadow-md xl:w-1/4 flex py-8 px-8 h-auto mt-10 bg-white flex-col justify-center">
        <h1 className="text-center font-medium text-2xl mt-3">Registrierung</h1>
        <form name="lastName" onSubmit={register}>
          <div className="flex flex-col ">
            <label
              className="block text-gray-400 text-[15px] mt-4 mb-1"
              htmlFor="lastName"
            >
              Last Name
            </label>
            <input
              className="text-sm border shadow appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none"
              ref={lastnameInput}
              type="text"
              placeholder="Last Name"
            />
            <label
              className="block text-gray-400 text-[15px] mt-4 mb-1"
              htmlFor="lastName"
            >
              First Name
            </label>
            <input
              className="text-sm border shadow appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none"
              ref={firstnameInput}
              type="text"
              placeholder="First Name"
            />
          </div>
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
          <button
            className="duration-300 hover:bg-blue-800 bg-blue-900 text-xl text-white w-full mt-4 py-2 rounded-sm font-semibold"
            type="submit"
          >
            Sign up
          </button>
        </form>
        <div className="flex items-center mt-4 justify-center">
          <p>
            Already have an Account?{" "}
            <a
              className="hover:border-b border-blue-500 text-blue-500"
              href="/login"
            >
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
