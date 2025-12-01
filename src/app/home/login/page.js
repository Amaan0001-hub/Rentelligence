"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaEye, FaEyeSlash, FaUser, FaLock } from "react-icons/fa";
import { appLogin } from "@/app/redux/slices/authSlice";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import ClipLoader from "react-spinners/ClipLoader";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import toast from "react-hot-toast";
import Loader from "../../components/Loader";
import { Turnstile } from "@marsidev/react-turnstile";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10,
    },
  },
};

const formItemVariants = {
  hidden: { x: -10, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
};

export default function Login() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [captchaValue, setCaptchaValue] = useState("");
  const [userInput, setUserInput] = useState({ captcha: "" });
  const [turnstileToken, setTurnstileToken] = useState("");

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const generateCaptcha = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ23456789";
    let captcha = "";
    for (let i = 0; i < 6; i++) {
      captcha += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaValue(captcha);
    setUserInput({ captcha: "" });
  };

  const formik = useFormik({
    initialValues: {
      userName: "",
      password: "",
      captcha: "",
    },
    validationSchema: Yup.object({
      userName: Yup.string().required("Username is required"),
      password: Yup.string().required("Password is required"),
      captcha: Yup.string()
        .required("Captcha is required")
        .test("match-captcha", "Captcha does not match", function (value) {
          return value.toUpperCase() === captchaValue;
        }),
    }),
    onSubmit: async (values, { setStatus, setSubmitting, resetForm }) => {
      try {
        setLoading(true);
        const data = {
          username: values.userName,
          password: values.password,
          turnstileToken: turnstileToken,
        };

        const result = await dispatch(appLogin(data)).unwrap();

        if (result.statusCode === 200) {
          router.push("/pages/dashboard");
        } else {
          toast.error(
            result.message || "An unexpected error occurred. Please try again."
          );
          generateCaptcha();
          resetForm();
          setLoading(false);
        }
      } catch (e) {
        setStatus({
          serverError:
            e?.message || "An unexpected error occurred. Please try again.",
        });
        generateCaptcha();
        resetForm();
        setLoading(false);
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleInputChange = (e) => {
    formik.setFieldValue("captcha", e.target.value);
    setUserInput({ ...userInput, captcha: e.target.value.toUpperCase() });
  };

  const speakCaptcha = () => {
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }
    const utterance = new SpeechSynthesisUtterance(
      captchaValue.split("").join(" ")
    );
    utterance.rate = 0.8;
    speechSynthesis.speak(utterance);
  };

  return (
    <>
      {(loading || formik.isSubmitting) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <Loader />
        </div>
      )}
      <div className="hero-2">
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="min-h-screen flex items-center justify-center bg-[url('https://imagedelivery.net/nq9qT5FHZv9Sg48UUnD1-A/54f54ba6-f365-476f-ce86-cd3e73937000/public')] bg-cover bg-center relative px-2 py-8"
        >
          <div className="absolute inset-0 z-0 bg-black/20" />
          <div className="relative z-20 flex justify-center w-full max-w-6xl mx-auto lg:justify-center">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 100 }}
              className="w-full max-w-md overflow-hidden bg-white shadow-2xl rounded-2xl lg:mr-6 backdrop-blur-md"
            >
              <div className="p-6 sm:p-8">
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <motion.div
                    variants={itemVariants}
                    className="text-center md:text-start"
                  >
                    <Link
                      href="https://rentelligence.ai/"
                      className="inline-block"
                    >
                      <Image
                        src="https://imagedelivery.net/nq9qT5FHZv9Sg48UUnD1-A/0a82b98e-48fe-408a-6f05-a1df7f688d00/public"
                        alt="Logo"
                        width={250}
                        height={50}
                        className="w-auto h-auto mx-auto md:mx-0"
                        priority
                      />
                    </Link>
                  </motion.div>

                  <motion.strong
                    variants={itemVariants}
                    className="block text-xl font-medium text-center text-gray-600 md:text-left"
                  >
                    Login into your account
                  </motion.strong>

                  <form autoComplete="off" onSubmit={formik.handleSubmit}>
                    {/* Username */}
                    <motion.div
                      variants={formItemVariants}
                      className="relative"
                    >
                      <label
                        htmlFor="userName"
                        className="block mt-3 mb-2 text-sm font-medium text-gray-600"
                      >
                        Username
                      </label>
                      <div className="relative">
                        <FaUser className="absolute text-gray-400 -translate-y-1/2 left-3 top-1/2" />
                        <input
                          type="text"
                          name="userName"
                          placeholder="Enter your Username"
                          value={formik.values.userName}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          id="userName"
                          className="w-full px-4 py-3 pl-10 bg-white border border-gray-300 rounded-lg focus:outline-none"
                        />
                      </div>
                      {formik.touched.userName && formik.errors.userName && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="absolute mt-2 text-xs text-red-500"
                        >
                          {formik.errors.userName}
                        </motion.div>
                      )}
                    </motion.div>
                    {/* Password */}
                    <motion.div
                      variants={formItemVariants}
                      className="relative mt-6"
                    >
                      <label
                        htmlFor="password"
                        className="block mb-2 text-sm font-medium text-gray-600"
                      >
                        Password
                      </label>
                      <div className="relative">
                        <FaLock className="absolute text-gray-400 -translate-y-1/2 left-3 top-1/2" />
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          placeholder="Enter your password"
                          value={formik.values.password}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          id="password"
                          className="w-full px-4 py-3 pl-10 pr-10 bg-white border border-gray-300 rounded-lg focus:outline-none"
                        />
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          type="button"
                          onClick={togglePasswordVisibility}
                          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 transition-colors hover:text-blue-600"
                          tabIndex={-1}
                        >
                          {showPassword ? <FaEye /> : <FaEyeSlash />}
                        </motion.button>
                      </div>
                      {formik.touched.password && formik.errors.password && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="absolute mt-2 text-xs text-red-500"
                        >
                          {formik.errors.password}
                        </motion.div>
                      )}
                    </motion.div>
                    {/* Captcha */}
                    <motion.div variants={formItemVariants} className="mt-6">
                      <label
                        htmlFor="captcha"
                        className="block mb-2 text-sm font-medium text-gray-600"
                      >
                        Captcha
                      </label>
                      <div className="flex flex-col items-center w-full gap-2 sm:flex-row">
                        <div className="relative flex-1 w-full">
                          <input
                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none"
                            name="captcha"
                            placeholder="Enter Captcha"
                            type="text"
                            value={formik.values.captcha}
                            onChange={handleInputChange}
                            onBlur={formik.handleBlur}
                          />
                          {formik.touched.captcha && formik.errors.captcha && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              className="absolute mt-1 text-xs text-red-500"
                            >
                              {formik.errors.captcha}
                            </motion.div>
                          )}
                        </div>

                        <div className="flex flex-row justify-between w-full gap-2 mt-4 sm:w-52 sm:justify-between md:justify-between lg:justify-between lg:mt-0 md:mt-0 sm:mt-0">
                          <div className="relative z-10 flex items-center justify-center w-full h-12 overflow-hidden bg-gray-100 rounded-md sm:w-32">
                            <div className="absolute inset-0 bg-[url('https://imagedelivery.net/nq9qT5FHZv9Sg48UUnD1-A/daea94aa-2acf-49d3-905f-50cef310d800/public')] opacity-40"></div>

                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200 to-transparent opacity-20"></div>
                            <motion.span
                              className="relative z-10 flex gap-1 text-2xl font-bold tracking-wider text-gray-800"
                              initial={{ scale: 0.8 }}
                              animate={{ scale: [1, 1.1, 1] }}
                              transition={{
                                repeat: Infinity,
                                repeatType: "loop",
                                duration: 2,
                              }}
                            >
                             <div className="select-none">
  {captchaValue.split("").map((char, idx) => (
    <motion.span
      key={idx}
      initial={{ rotate: 0 }}
      animate={{ rotate: [0, 5, -10, 0] }}
      transition={{
        repeat: Infinity,
        repeatType: "loop",
        duration: 3,
        delay: idx * 0.2,
      }}
      className="inline-block"
    >
      {char}
    </motion.span>
  ))}
</div>

                            </motion.span>
                          </div>

                          <div className="flex justify-center w-full gap-2 sm:w-auto sm:justify-start">
                            <button
                              type="button"
                              onClick={generateCaptcha}
                              className="px-3 py-2 text-sm text-gray-600 transition-colors bg-gray-200 rounded-md hover:bg-gray-300"
                              title="Regenerate Captcha"
                            >
                              ↻
                            </button>

                            <button
                              type="button"
                              onClick={speakCaptcha}
                              className="px-3 py-2 text-sm transition-colors bg-gray-200 rounded-md hover:bg-gray-300"
                              title="Play captcha audio"
                            >
                              🔊
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                    {/* Remember me */}
                    <div className="pt-4">
                      <motion.div variants={formItemVariants} className="mt-2">
                        <div className="flex flex-row items-center justify-between gap-2 whitespace-nowrap sm:flex-row">
                          <div className="flex items-center">
                            {/* <input
                              name="remember-me"
                              type="checkbox"
                              className="w-4 h-4 text-blue-600 transition border-gray-300 rounded focus:ring-blue-500"
                              checked={keepLoggedIn}
                              onChange={(e) => setKeepLoggedIn(e.target.checked)}
                            />
                            <label
                              htmlFor="remember-me"
                              className="block ml-2 text-sm text-gray-600 select-none"
                            >
                              Keep me logged in
                            </label> */}
                          </div>
                          <div className="text-sm">
                            <Link
                              href="/home/forgot-password"
                              className="font-semibold text-gray-600 transition-colors"
                            >
                              Forgot Password?
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    </div>

                    {/* Turnstile */}
                    <motion.div variants={formItemVariants} className="mt-4 ">
                      <Turnstile
                        siteKey="0x4AAAAAAB0Mb45P-iClKMI0"
                        onSuccess={(token) => {
                          setTurnstileToken(token);
                        }}
                        className="login-turnstile"
                      />
                    </motion.div>

                    {/* Submit */}
                    <motion.div variants={formItemVariants} className="mt-4">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="flex items-center justify-center w-full gap-2 th-btn style2"
                        disabled={formik.isSubmitting}
                      >
                        {formik.isSubmitting ? (
                          <>
                            <ClipLoader color="#ffffff" size={20} />
                            <span className="ml-2">Logging in...</span>
                          </>
                        ) : (
                          <>
                            Log in
                            <FiArrowRight className="text-lg" />
                          </>
                        )}
                      </motion.button>
                    </motion.div>
                  </form>

                  <motion.div
                    variants={itemVariants}
                    className="mt-4 text-center"
                  >
                    <Link
                      href="/home/register"
                      className="text-gray-600 cursor-pointer hover:underline"
                    >
                      Don&apos;t have an account?{" "}
                      <span className="font-bold transition-colors ">
                        Register
                      </span>
                    </Link>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.section>
      </div>
    </>
  );
}
