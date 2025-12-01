"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import Loader from "../../components/Loader";
import { useRouter } from "next/navigation";
import { forgotPassword } from "@/app/redux/slices/authSlice";
import { useDispatch } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FaUser, FaEnvelope } from "react-icons/fa";
import toast from "react-hot-toast";
import ClipLoader from "react-spinners/ClipLoader";
import { FiArrowRight } from "react-icons/fi";
import { motion } from "framer-motion";
import { Turnstile } from "@marsidev/react-turnstile";

export default function ForgotPassword() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [captchaValue, setCaptchaValue] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const router = useRouter();

  const generateCaptcha = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ23456789";
    let captcha = "";
    for (let i = 0; i < 6; i++) {
      captcha += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaValue(captcha);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const validationSchema = Yup.object({
    username: Yup.string()
      .required("Username is required")
      .min(3, "Username must be at least 3 characters")
      .max(30, "Username cannot exceed 30 characters")
      .matches(
        /^[a-zA-Z0-9_-]+$/,
        "Username can only contain letters, numbers, underscores, and hyphens"
      ),
    email: Yup.string()
      .required("Email address is required")
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Please enter a valid email address"
      )
      .test(
        "valid-domain",
        "Please use a valid email domain (e.g., gmail.com, yahoo.com, outlook.com)",
        (value) => {
          if (!value) return true;
          const domain = value.split("@")[1]?.toLowerCase();
          const validDomains = [
            "gmail.com",
            "yahoo.com",
            "outlook.com",
            "hotmail.com",
            "aol.com",
            "icloud.com",
            "protonmail.com",
            "zoho.com",
            "mail.com",
            "gmx.com",
          ];
          // Allow valid domains regardless of whether they're in the common list
          return domain && domain.includes(".");
        }
      )
      .test(
        "no-typos",
        "Please check for typos in your email address",
        (value) => {
          if (!value) return true;
          const typos = ["gmial.com", "yahooo.com", "outlok.com", "hotmial.com"];
          const domain = value.split("@")[1]?.toLowerCase();
          return !typos.includes(domain);
        }
      ),
    captcha: Yup.string()
      .required("Captcha is required")
      .test("match-captcha", "Captcha does not match", function (value) {
        return value?.trim().toUpperCase() === captchaValue.toUpperCase();
      }),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    // if (!turnstileToken) {
    //   toast.error("Please complete the CAPTCHA");
    //   return;
    // }

    const data = {
      userId: values.username,
      email: values.email,
      turnstileToken: turnstileToken,
    };

    try {
      setLoading(true);
      const result = await dispatch(forgotPassword(data)).unwrap();
      if (result.statusCode === 200) {
        resetForm();
        setEmailSent(true);
        toast.success("Your password has been sent to your email.");
      } else if (result.statusCode === 401) {
        toast.error(result.message || "User not found");
        generateCaptcha();
      }
    } catch (e) {
      toast.error("Failed to send reset email. Please try again.");
      generateCaptcha();
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  const handleNav = (href) => {
    setLoading(true);
    router.push(href);
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
      {loading && (
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
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
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



                {emailSent ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <button
                      onClick={() => handleNav("/home/login")}
                      className="w-full px-4 pb-3 pt-4 font-semibold text-white transition duration-300 rounded-lg shadow-md th-btn style2"
                    >
                      Back to Login {"  "}  <FiArrowRight className="text-lg" />
                    </button>
                  </motion.div>
                ) : (

                  <Formik
                    initialValues={{ username: "", email: "", captcha: "" }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                    validateOnChange={true}
                    validateOnBlur={true}
                  >
                    {({ isSubmitting, errors, touched }) => (
                      <Form className="space-y-4">
                        <motion.strong
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="block text-xl font-medium text-center text-gray-600 md:text-left"
                        >
                          Forgot Your Password?
                        </motion.strong>
                        <motion.p
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-2 mb-4 text-sm tracking-tight text-gray-600 text-start"
                        >
                          Enter your username and email address to receive password .
                        </motion.p>
                        {/* Username Input */}
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ type: "spring", stiffness: 100 }}
                        >
                          <label
                            htmlFor="username"
                            className="block mb-2 text-sm font-medium text-gray-600"
                          >
                            Username
                          </label>
                          <div className="relative">
                            <FaUser className="absolute text-gray-400 -translate-y-1/2 left-3 top-1/2" />
                            <Field
                              type="text"
                              id="username"
                              name="username"
                              className="w-full px-4 py-3 pl-10 placeholder-gray-400 bg-white border border-gray-300 rounded-lg focus:outline-none"
                              placeholder="Enter your username"
                              autoComplete="username"
                            />
                          </div>
                          <ErrorMessage
                            name="username"
                            component="span"
                            className="block mt-1 text-xs text-red-500"
                          />
                        </motion.div>

                        {/* Email Input */}
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ type: "spring", stiffness: 100 }}
                        >
                          <label
                            htmlFor="email"
                            className="block mb-2 text-sm font-medium text-gray-600"
                          >
                            Email Address
                          </label>
                          <div className="relative">
                            <FaEnvelope className="absolute text-gray-400 -translate-y-1/2 left-3 top-1/2" />
                            <Field
                              type="email"
                              id="email"
                              name="email"
                              className="w-full px-4 py-3 pl-10 placeholder-gray-400 bg-white border border-gray-300 rounded-lg focus:outline-none"
                              placeholder="Enter your email address"
                              autoComplete="email"
                            />
                          </div>
                          <ErrorMessage
                            name="email"
                            component="span"
                            className="block mt-1 text-xs text-red-500"
                          />
                        </motion.div>

                        {/* Captcha */}
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ type: "spring", stiffness: 100 }}
                        >
                          <label className="block mb-2 text-sm font-medium text-gray-600">
                            Captcha
                          </label>
                          <div className="flex flex-col items-center w-full gap-2 sm:flex-row">
                            <div className="relative flex-1 w-full">
                              <Field
                                type="text"
                                id="captcha"
                                name="captcha"
                                className="w-full px-4 py-3 placeholder-gray-400 bg-white border border-gray-300 rounded-md focus:outline-none"
                                placeholder="Enter Captcha"
                                maxLength="6"
                              />
                              <ErrorMessage
                                name="captcha"
                                component="span"
                                className="absolute block mt-1 text-xs text-red-500"
                              />
                            </div>

                            <div className="flex flex-row justify-between w-full gap-2 sm:w-52 sm:justify-between">
                              <div className="relative z-10 flex items-center justify-center w-full h-12 overflow-hidden bg-gray-100 rounded-md sm:w-32">
                                {/* <div className="absolute inset-0 bg-[url('/cross-pattern.png')] opacity-40"></div> */}
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
                                    >
                                      {char}
                                    </motion.span>
                                  ))}
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

                        {/* Turnstile */}
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ type: "spring", stiffness: 100 }}
                          className="w-full mt-4 turnstile"
                        >
                          <Turnstile
                            siteKey="0x4AAAAAAB0Mb45P-iClKMI0"
                            onSuccess={(token) => {
                              setTurnstileToken(token);
                            }}
                          />
                        </motion.div>

                        <div className="mt-4">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            className="flex items-center justify-center w-full gap-2 th-btn style2"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? (
                              <>
                                <ClipLoader
                                  color="#ffffff"
                                  loading={isSubmitting}
                                  size={20}
                                  className="mr-2"
                                />
                                Sending...
                              </>
                            ) : (
                              <>
                                Submit
                                <FiArrowRight className="ml-2 text-lg" />
                              </>
                            )}
                          </motion.button>
                        </div>
                      </Form>
                    )}
                  </Formik>
                )}

                {!emailSent && (
                  <div
                    className="text-center text-[#000000] mt-4 hover:underline cursor-pointer"
                  >
                    <p className="text-gray-600">
                      Remember your password?{" "}
                      <span
                        className="font-bold text-gray-600 cursor-pointer hover:underline"
                        onClick={() => handleNav("/home/login")}
                      >
                        Login
                      </span>
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </motion.section>
      </div>
    </>
  );
}
