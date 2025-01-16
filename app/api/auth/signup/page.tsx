"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signUp } from "@/app/action/signUp";

const Page = () => {
  const router = useRouter();
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    cpassword: "",
  });

  const [error, setError] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const handleGoogleLogin = () => {
    signIn("google", { callbackUrl: "/" });
  };

  const signup = async () => {
    setError(false);

    if (userData.password !== userData.cpassword) {
      setError(true);
      setErrMsg("Passwords do not match");
      return;
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(userData.email)) {
      setError(true);
      setErrMsg("Please enter a valid email address");
      return;
    }

    try {
      const res = await signUp(userData);

      console.log(res);

      //@ts-ignore
      if (res.id) {
        const signInResult = await signIn("credentials", {
          email: userData.email,
          password: userData.password,
          redirect: false, // Prevent redirect
        });

        if (signInResult?.ok) {
          router.push("/");
        }
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(error.message);
        throw new Error(error.message);
      } else {
        console.log("Unknown error", error);
        throw new Error("An unknown error occurred");
      }
    }
  };

  return (
    <div className="flex flex-col justify-center font-[sans-serif] sm:h-screen p-4">
      <div className="max-w-md w-full mx-auto border border-gray-300 rounded-2xl p-8">
        <div className="text-center mb-12">
          <a href="javascript:void(0)">
            <img
              src="/logo.png"
              alt="logo"
              className="w-20 inline-block rounded-lg"
            />
          </a>
        </div>

        {error && <div className="text-center text-red-500">* {errMsg}</div>}

        <form>
          <div className="space-y-6">
            <div>
              <label className="text-gray-800 text-sm mb-2 block">Name</label>
              <input
                name="name"
                type="text"
                className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-3 rounded-md outline-blue-500"
                placeholder="Enter name"
                value={userData.name}
                onChange={(e) =>
                  setUserData({ ...userData, name: e.target.value })
                }
              />
            </div>
            <div>
              <label className="text-gray-800 text-sm mb-2 block">
                Email Id
              </label>
              <input
                name="email"
                type="text"
                className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-3 rounded-md outline-blue-500"
                placeholder="Enter email"
                value={userData.email}
                onChange={(e) =>
                  setUserData({ ...userData, email: e.target.value })
                }
              />
            </div>
            <div>
              <label className="text-gray-800 text-sm mb-2 block">
                Password
              </label>
              <input
                name="password"
                type="password"
                className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-3 rounded-md outline-blue-500"
                placeholder="Enter password"
                value={userData.password}
                onChange={(e) =>
                  setUserData({ ...userData, password: e.target.value })
                }
              />
            </div>
            <div>
              <label className="text-gray-800 text-sm mb-2 block">
                Confirm Password
              </label>
              <input
                name="cpassword"
                type="password"
                className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-3 rounded-md outline-blue-500"
                placeholder="Enter confirm password"
                value={userData.cpassword}
                onChange={(e) =>
                  setUserData({ ...userData, cpassword: e.target.value })
                }
              />
            </div>
          </div>

          <div className="!mt-8">
            <button
              type="button"
              onClick={signup}
              className="w-full py-3 px-4 text-sm tracking-wider font-semibold rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
            >
              Create an account
            </button>
          </div>

          <div className="p-2 border mt-2 rounded-md hover:shadow-md">
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full px-4 text-md tracking-wider font-semibold rounded-md text-black  focus:outline-none flex items-center justify-center gap-10 "
            >
              <img
                src="https://cdn2.hubspot.net/hubfs/53/image8-2.jpg"
                className="w-14 rounded-full"
              />
              Google
            </button>
          </div>

          <p className="text-gray-800 text-sm mt-6 text-center">
            Already have an account?{" "}
            <a
              onClick={() => router.push("/api/auth/signin")}
              className="text-blue-600 font-semibold hover:underline ml-1 cursor-pointer"
            >
              Login here
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Page;
