"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Loader from "../../components/Loader";
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import Image from "next/image";
import { FaExclamationTriangle } from "react-icons/fa";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { getEncryptedLocalData } from "@/app/api/auth";
import { appLogin } from "@/app/redux/slices/authSlice";

export default function WelcomeLetter() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const data = useSelector((state) => state.auth.userData);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const auth =  getEncryptedLocalData("authLogin");
      setIsAuth(!!auth);
    }
  }, []);


  const handleSignInClick = async () => {
    const result = await dispatch(appLogin({
      username: data?.authLogin,
      password: data?.authPassword,
    })).unwrap();

    if (result.statusCode === 200) {
      router.push("/pages/dashboard");
    } else {
      toast.error(result.message);
    }
  }

  if (!isAuth) {
    return null;
  }

  return (
    <>
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
          <Loader />
        </div>
      )}
      <div
        className="flex items-center justify-center min-h-screen px-4 py-12 bg-black sm:px-6 lg:px-8"
        style={{
          backgroundImage: "url('https://imagedelivery.net/nq9qT5FHZv9Sg48UUnD1-A/54f54ba6-f365-476f-ce86-cd3e73937000/public')",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="bg-white rounded-2xl shadow-xl max-w-[530px] w-full  p-8 sm:p-10">
          {/* Logo */}
          <div className="mb-2">
            <Link href="https://rentelligence.ai/" className="inline-block">
              <Image
                src="https://imagedelivery.net/nq9qT5FHZv9Sg48UUnD1-A/0a82b98e-48fe-408a-6f05-a1df7f688d00/public"
                alt="Logo"
                width={250}
                height={50}
                className="object-contain"
              />
            </Link>
          </div>

          <h2 className="mb-4 text-2xl font-bold text-gray-800 sm:text-2xl text-start">
            Welcome to Your Smart Earning Journey
          </h2>

          <div className="mb-8 space-y-4 text-start">
            <p className="text-base leading-relaxed text-gray-600">
              Welcome to Rentelligence, {data?.name?.split(" ")[0]}!
              <br />
              We’re thrilled to have you on board.
            </p>
            <p className="text-gray-600">
              The future isn’t coming — it’s already here, and it’s Agentic.
              With Rentelligence, you now have access to a powerful ecosystem
              where AI agents work for you, generate consistent rewards, and
              free up your time for what truly matters — your personal growth,
              strategic planning, family moments, and much more.
            </p>

            <p className="text-base leading-relaxed text-gray-600">
              🤖 Put Your Agents to Work.
              <br></br>
              Let them earn while you live smarter.
            </p>
            <p className="text-gray-600">
              Rentelligence isn’t just a platform — it’s your gateway into the
              Agent Era, where wealth creation meets automation and innovation.
            </p>

            <p className="text-gray-600">
              🛠️ Your Capital. Our Platform. Limitless Potential.
              <br></br>
              Together, we build a future where your money works smarter, and
              you stay ahead.
            </p>

            <p className="text-gray-600">
              Welcome aboard, {data?.name?.split(" ")[0]}. Let’s create recurring income, passive yield, and real freedom — the Rentelligent way
            </p>
          </div>

          <div className="p-5 mb-8 text-left border border-gray-200 rounded-lg bg-gray-50">
            <h3 className="mb-4 text-lg font-bold text-gray-800">
              Sign Into Your Account
            </h3>
            <div className="grid grid-cols-1 text-sm sm:grid-cols-3 gap-y-3 gap-x-16">
              <div className="font-semibold text-gray-700">Full Name</div>
              <div className="text-gray-600 sm:col-span-2">{data?.name}</div>
              <div className="font-semibold text-gray-700">Username</div>
              <div className="text-gray-600 sm:col-span-2">
                {data?.authLogin}
              </div>
              <div className="w-40 font-semibold text-gray-700 ">
                Temporary Password
              </div>
              <div className="text-gray-600 sm:col-span-2">
                {data?.authPassword}
              </div>
            </div>
          </div>

          <p className="mb-8 text-sm leading-relaxed text-gray-600 sm:text-base text-start">
            Congratulations! Your account has been successfully created. Check
            your inbox for an email that includes your login details. Make sure
            to store this email in a secure place. We appreciate your
            registration!
          </p>

          <div className="flex flex-col space-y-1">

          <button
              onClick={handleSignInClick}
            >
              <button className="flex items-center justify-center w-full gap-2 px-6 py-3 font-medium text-white transition-opacity rounded-lg th-btn style2 hover:opacity-90">
                SIGN IN
                <FiArrowRight className="text-xl" />
              </button>
            </button>
            <Link
              href="https://rentelligence.ai/"
            >
              <button className="flex items-center justify-center w-full gap-2 px-6 py-3 font-medium text-white transition-opacity rounded-lg th-btn style2 hover:opacity-90">
                
                <FiArrowLeft className="text-xl" />
                Back to Home
              </button>
            </Link>

            <div className="flex items-start gap-3 p-4 border-l-4 rounded-md bg-amber-50 border-amber-400">
              <FaExclamationTriangle className="text-amber-500 text-xl mt-0.5 flex-shrink-0" />
              <p className="text-sm leading-snug text-gray-600">
                Please change your password after logging in for the first time
                to ensure account security.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
