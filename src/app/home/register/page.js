"use client";

import { useState, useEffect, Suspense } from "react";


import {
  getAllCountry,
  getRefreralIdByUserEmail,
} from "@/app/redux/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { sendOtp, userRegistration } from "@/app/redux/slices/authSlice";
import { useRouter } from "next/navigation";
import { FiArrowRight } from "react-icons/fi";
import Select from "react-select";
import {
  FaHashtag,
  FaUserFriends,
  FaRegUser,
  FaUser,
  FaEnvelope,
  FaGlobe,
  FaMobileAlt,
  FaEye,
  FaEyeSlash,
  FaLock,
  FaShieldAlt,
} from "react-icons/fa";
import { KeyRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useFormik } from "formik";
import * as Yup from "yup";
import ClipLoader from "react-spinners/ClipLoader";
import toast from "react-hot-toast";
import Loader from "../../components/Loader";
import { useSearchParams } from "next/navigation";
import {  encryptData } from "@/app/utils/encryption";
import { Turnstile } from "@marsidev/react-turnstile";
// Custom Option for react-select to show flag and name
const CountryOption = (props) => (
  <div
    {...props.innerProps}
    className="flex items-center px-2 py-1 cursor-pointer"
  >
    {props.data.countryFlag && (
      <img
        src={props.data.countryFlag}
        alt={`${props.data.label} flag`}
        className="w-5 h-5 mr-2"
      />
    )}
    <span>{props.data.label}</span>
  </div>
);

// Custom SingleValue for react-select to show flag and name
const CountrySingleValue = (props) => (
  <div className="absolute flex items-center justify-center text-gray-600 ">
    {props.data.countryFlag && (
      <img
        src={props.data.countryFlag}
        alt={`${props.data.label} flag`}
        className="w-5 h-5 "
      />
    )}
    <span className="ml-3 whitespace-nowrap">{props.data.label}</span>
  </div>
);

function Registration() {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [urid, setUrid] = useState("");
  const [hasReferral, setHasReferral] = useState(false);
  const [referralId, setReferralId] = useState("");
  const [referralName, setReferralName] = useState("");
  const [isCheckingReferral, setIsCheckingReferral] = useState(false);
  const [isAutoFilled, setIsAutoFilled] = useState(false);
  const [sentOtp, setSentOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [isAutoReferral, setIsAutoReferral] = useState(false);

  const [referralError, setReferralError] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const { getAllCountryData } = useSelector((state) => state.auth);

  const validationSchema = Yup.object({
    ReferralId: Yup.string().notRequired(),
    CountryId: Yup.string().required("Country is required"),
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    Mobile: Yup.string()
      .required("Mobile number is required")
      .notOneOf(
        ["123456", "123456789", "123123", "password", "qwerty"],
        "This Mobile is too common and insecure"
      )
      .min(7, "Mobile number must be at least 7 digits")
      .max(10, "Mobile number must be at most 10 digits")
      .matches(/^[0-9]{7,10}$/, "Mobile number must be 7 to 10 digits"),
    EmailId: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      )
      .notOneOf(
        ["123456", "12345678", "123123", "password", "qwerty"],
        "This password is too common and insecure"
      ),
    OTP: Yup.string()
      .required("OTP is required")
      .matches(/^[0-9]{6}$/, "OTP must be 6 digits"),
    checkbox1: Yup.boolean().oneOf(
      [true],
      "You must accept the terms and conditions"
    ),
  });

  const formik = useFormik({
    initialValues: {
      ReferralId: "",
      SponserName: "",
      CountryId: "",
      CountryCode: "",
      firstName: "",
      lastName: "",
      Mobile: "",
      EmailId: "",
      OTP: "",
      password: "",
      checkbox1: true,
    },
    validationSchema,
   onSubmit: async (values, { setStatus }) => {
  // ✅ OTP check
  if (values.OTP !== sentOtp) {
    setOtpError("Invalid verification code");
    toast.error("Invalid OTP, please try again");
    return;
  }

  // if (!turnstileToken) {
  //   toast.error("Please complete the CAPTCHA");
  //   return;
  // }

  const data = {
    fName: values.firstName,
    lName: values.lastName,
    password: values.password,
    email: values.EmailId,
    countryId: values.CountryId,
    mobile: values.Mobile,
    address: "",
    turnstileToken: turnstileToken,
    otPregpage: values.OTP,
  };

  if (values.ReferralId) {
    data.introURID = urid;
  }

  setLoading(true);
  try {
    const response = await dispatch(userRegistration(data));
    if (response.payload.statusCode === 200) {
      router.push("/home/welcome-letter");
      localStorage.setItem("authLogin", encryptData(response.payload.authLogin));
      formik.resetForm();
    } else {
      toast.error(response.payload.message);
    }
  } catch (error) {
    setStatus({
      serverError: error || "An unexpected error occurred. Please try again.",
    });
  } finally {
    setLoading(false);
  }
},

  });

  useEffect(() => {
    dispatch(getAllCountry());
  }, [dispatch]);

useEffect(() => {
  if (!mounted) return;
  if (!searchParams) return;

  let ref = "";

  const possibleKeys = ["RefID", "Ref", "REF", "refid", "ref"];
  for (const key of possibleKeys) {
    const val = searchParams.get(key);
    if (val) {
      ref = val;
      break;
    }
  }

  if (ref && ref.includes("~")) {
    ref = ref.split("~")[0];
  }

    if (ref) {
      setHasReferral(true);
      setIsAutoFilled(true);
      if (formik.values.ReferralId !== ref) {
        formik.setFieldValue("ReferralId", ref);
        setReferralId(ref);
        Fchecksponser(ref);
      }
    }
  
}, [mounted, searchParams]);

  useEffect(() => {
    setMounted(true);

    // --- Start: Client-side inspection deterrents (easily bypassable) ---
    // Disable right-click context menu
    const handleContextMenu = (e) => {
      e.preventDefault();
    };
    document.addEventListener("contextmenu", handleContextMenu);

    // Disable common developer tool shortcuts (F12, Ctrl+Shift+I, Ctrl+Shift+J)
    const handleKeyDown = (e) => {
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && e.key === "I") ||
        (e.ctrlKey && e.shiftKey && e.key === "J")
      ) {
        e.preventDefault();
      }
    };
    document.addEventListener("keydown", handleKeyDown);

    // Cleanup function to remove event listeners when the component unmounts
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
    // --- End: Client-side inspection deterrents ---

    const urlParams = new URLSearchParams(window.location.search);
    let ref = "";

    // Fetch the referral / ref id in a *case-insensitive* manner so that
    // ?RefID=xxxx, ?REF=xxxx or even ?refid=xxxx all work seamlessly.
    for (const [key, value] of urlParams.entries()) {
      if (key.toLowerCase() === "refid" || key.toLowerCase() === "ref") {
        ref = value;
        break;
      }
    }

    // If the ref id arrives in the format RE12345~something, extract the id part
    if (ref.includes("~")) {
      ref = ref.split("~")[0];
    }

    if (ref) {
      setHasReferral(true);
      setIsAutoFilled(true);
      formik.setFieldValue("ReferralId", ref);
      setReferralId(ref);
      Fchecksponser(ref);
    }
  }, []);

  if (!mounted) {
    return null;
  }
  async function Fchecksponser(referralId) {
    try {
      setIsCheckingReferral(true);
      setReferralError("");

      const response = await dispatch(
        getRefreralIdByUserEmail(referralId)
      ).unwrap();

      if (response.statusCode === 200) {
        setUrid(response.data.urid);
        formik.setFieldValue("SponserName", response.data.fullName);
        setReferralError("");
        setReferralName(response.data.fullName);
      } else if (response.statusCode === 401) {
        formik.setFieldValue("SponserName", "");
        setReferralName("");
        setReferralError(response.message || "Referral ID not found");
        setUrid("");
      }
    } catch (error) {
      console.error("Error fetching referral data:", error);
      formik.setFieldValue("SponserName", "");
      setReferralName("");
      setReferralError("Invalid referral ID");
      setUrid("");
    } finally {
      setIsCheckingReferral(false);
    }
  }

  //   formik.setFieldTouched("EmailId", true);

  //   if (!formik.values.EmailId) {
  //     formik.setFieldError("EmailId", "Email is required");
  //     return;
  //   }

  //   if (
  //     !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formik.values.EmailId)
  //   ) {
  //     formik.setFieldError("EmailId", "Invalid email address");
  //     return;
  //   }

  //   try {
  //     setIsSendingOtp(true);
  //     const data = {
  //       emailId: formik.values.EmailId,
  //     };
  //     const response = await dispatch(sendOtp(data)).unwrap();
  //     // if (response.statusCode === 200) {
  //     //   formik.setFieldValue("OTP", response.data.otp);
  //     // }
  //   } catch (error) {
  //     console.error("Error sending OTP:", error);
  //   } finally {
  //     setIsSendingOtp(false);
  //   }
  // };

  const fnSendOtpRegistration = async () => {
  formik.setFieldTouched("EmailId", true);

  if (!formik.values.EmailId) {
    formik.setFieldError("EmailId", "Email is required");
    return;
  }

  if (
    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formik.values.EmailId)
  ) {
    formik.setFieldError("EmailId", "Invalid email address");
    return;
  }

  try {
    setIsSendingOtp(true);
    const data = {
      emailId: formik.values.EmailId,
    };
    const response = await dispatch(sendOtp(data)).unwrap();

    if (response.statusCode === 200) {
      
      setSentOtp(response.data.otp);
      toast.success("OTP sent successfully. Please check your email!");
    } else {
      toast.error(response.message || "Failed to send OTP");
    }
  } catch (error) {
    console.error("Error sending OTP:", error);
    toast.error("Error sending OTP");
  } finally {
    setIsSendingOtp(false);
  }
};

  return (
    <>
      {(loading || formik.isSubmitting) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <Loader />
        </div>
      )}
      <div className="hero-2">
        <section className="relative flex items-center justify-center bg-[url('https://imagedelivery.net/nq9qT5FHZv9Sg48UUnD1-A/54f54ba6-f365-476f-ce86-cd3e73937000/public')] min-h-screen py-8 bg-center bg-cover">
          <div className="absolute inset-0 z-0 bg-black/20" />
          <div className="container relative z-10 flex items-center justify-center min-h-screen px-2 mx-auto sm:px-6 lg:px-8">
            <div className="w-full max-w-md overflow-hidden bg-white shadow-2xl sm:max-w-lg md:max-w-xl lg:max-w-xl rounded-2xl backdrop-blur-md">
              <div className="p-4 sm:p-6 md:p-8 lg:p-10">
                <div className="text-center md:text-start">
                  <Link
                    href="https://rentelligence.ai/"
                    className="inline-block"
                  >
                    <Image
                      src="https://imagedelivery.net/nq9qT5FHZv9Sg48UUnD1-A/0a82b98e-48fe-408a-6f05-a1df7f688d00/public"
                      alt="Logo"
                      width={250}
                      height={50}
                      className="w-40 mx-auto sm:w-48 md:w-56 lg:w-64 md:mx-0"
                    />
                  </Link>
                </div>

                <strong className="block font-medium tracking-tight text-center text-gray-600 md:text-start text-md sm:text-xl md:text-md opacity-1">
                  Create your account & join our community
                </strong>

                <form
                  className="mt-4 space-y-3 sm:space-y-4 sm:mt-6"
                  autoComplete="off"
                  onSubmit={formik.handleSubmit}
                >
                  {/* Referral ID and Referral Name */}
                  <div className="p-6 border border-gray-200 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="z-10 flex items-center justify-center w-8 h-8 bg-purple-100 rounded-full">
                        <FaUserFriends className="text-[#995bed] text-md sm:text-base" />
                      </div>
                      <h2 className="text-lg font-semibold text-gray-600">
                        Referral Information
                      </h2>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <input
  type="checkbox"
  id="hasReferral"
  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
  checked={hasReferral}
  onChange={(e) => {
    setHasReferral(e.target.checked);
    if (!e.target.checked) {
      formik.setFieldValue("ReferralId", "");
      setReferralId("");
      setReferralName("");
      setReferralError("");
      setIsAutoReferral(false);
    }
  }}
/>
                        <label
                          htmlFor="hasReferral"
                          className="text-sm font-medium text-gray-700"
                        >
                          I have a referral ID
                        </label>
                      </div>

                      {hasReferral && (
                        <div className="flex items-center justify-start gap-4 mt-4 ">
                          <div className="flex flex-col justify-start">
                            <label className="block mb-2 text-sm font-medium text-gray-700">
                              Referral ID
                            </label>
                            <div className="relative mb-5 max-w-56 ">
                              <div className="absolute left-0 flex items-center pl-3 -translate-y-1/2 pointer-events-none top-1/2">
                                <FaHashtag className="absolute text-gray-600 abstext-sm sm:text-base" />
                              </div>
                              <input
                                type="text"
                                className={`w-full py-3 pl-10 text-sm text-gray-600 border border-gray-300 rounded-lg focus:outline-none ${isCheckingReferral ? "pr-10" : "pr-3"
                                  }`}
                                placeholder="Enter Referral ID"
                                value={formik.values.ReferralId}
                                maxLength={9}
                                disabled={isAutoFilled}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  formik.setFieldValue("ReferralId", value);
                                  setReferralId(value);
                                  setReferralName("");
                                  setReferralError("");
                                }}
                                onKeyUp={() => {
                                  if (formik.values.ReferralId) {
                                    Fchecksponser(formik.values.ReferralId);
                                  }
                                }}
                                onBlur={() => {
                                  if (formik.values.ReferralId) {
                                    Fchecksponser(formik.values.ReferralId);
                                  }
                                }}
                                style={{ lineHeight: "1.5", height: "44px" }}
                              />

                              {isCheckingReferral && (
                                <div className="absolute transform -translate-y-1/2 right-10 top-1/2">
                                  <ClipLoader color="#000000" size={16} />
                                </div>
                              )}
                              {referralError && (
                                <div className="absolute w-full mt-1 text-xs text-red-500">
                                  {referralError}
                                </div>
                              )}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-600 whitespace-nowrap ">
                              {referralName}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Country and Country Code */}
                  <div className="p-6 border border-gray-200 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="z-10 flex items-center justify-center w-8 h-8 bg-purple-100 rounded-full">
                        <FaRegUser className="text-[#995bed] text-md sm:text-base" />
                      </div>
                      <h2 className="text-lg font-semibold text-gray-600">
                        Personal Information
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 gap-4 mt-2 sm:grid-cols-2">
                      <div className="relative w-full">
                        <label
                          htmlFor="countryId"
                          className="block mb-1 text-sm font-medium text-gray-600 sm:mb-2"
                        >
                          Select Country
                        </label>
                        <div className="relative">
                          <FaGlobe className="absolute text-sm text-gray-600 transform -translate-y-1/2 left-3 top-1/2 sm:text-base" />
                          <Select
                            options={getAllCountryData?.data?.map(
                              (country) => ({
                                value: country.phonecode,
                                label: country.country_Name,
                                countryFlag: country.countryFlag,
                                countryCode: country.phonecode,
                              })
                            )}
                            value={getAllCountryData?.data
                              ?.map((country) => ({
                                value: country.phonecode,
                                label: country.country_Name,
                                countryFlag: country.countryFlag,
                                countryCode: country.phonecode,
                              }))
                              .find(
                                (option) =>
                                  option.value === formik.values.CountryId
                              )}
                            onChange={(selectedOption) => {
                              formik.setFieldValue(
                                "CountryId",
                                selectedOption.value
                              );
                              formik.setFieldValue(
                                "CountryCode",
                                `+${selectedOption.countryCode}`
                              );
                            }}
                            placeholder="Select Country"
                            classNamePrefix="select"
                            components={{
                              Option: CountryOption,
                              SingleValue: CountrySingleValue,
                            }}
                            styles={{
                              control: (provided, state) => ({
                                ...provided,
                                minHeight: "44px",
                                height: "43px",
                                boxShadow: "none",

                                borderColor: state.isFocused
                                  ? "transparent"
                                  : provided.borderColor, // Remove focus border
                                "&:hover": {
                                  borderColor: state.isFocused
                                    ? "transparent"
                                    : provided.borderColor, // Keep hover border sam
                                },
                              }),
                              valueContainer: (provided) => ({
                                ...provided,
                                height: "44px",
                                padding: "0 4px",
                                border: "",
                                display: "flex",
                                alignItems: "center",
                              }),
                              input: (provided) => ({
                                ...provided,
                                margin: "0px",
                                padding: "0px",
                              }),
                              indicatorsContainer: (provided) => ({
                                ...provided,
                                height: "44px",
                              }),
                              singleValue: (provided) => ({
                                ...provided,
                                display: "flex",
                                alignItems: "center",
                                color: "#4B5563",
                                paddingLeft: "28px",
                              }),
                            }}
                          />
                        </div>

                        {formik.touched.CountryId &&
                          formik.errors.CountryId && (
                            <div className="mt-1 text-xs text-red-500 sm:text-sm">
                              {formik.errors.CountryId}
                            </div>
                          )}
                      </div>
                      <div className="w-full ">
                        <label
                          htmlFor="countryCode"
                          className="block mb-1 text-sm font-medium text-gray-600 sm:mb-2"
                        >
                          Country Code
                        </label>
                        <input
                          className="w-36 px-3 py-2.5  text-sm text-gray-600 bg-gray-100 rounded-lg sm:px-4 sm:py-2.5 sm:text-base focus:outline-none"
                          name="CountryCode"
                          value={formik.values.CountryCode}
                          readOnly
                          placeholder="Country Code"
                          id="countryCode"
                        />
                      </div>
                    </div>

                     {/* Mobile and Email */}
                    <div className="grid grid-cols-1 gap-4 mt-2 sm:grid-cols-2">
                      <div className="relative ">
                        <label
                          htmlFor="mobile"
                          className="block mb-1 text-sm font-medium text-gray-600 sm:mb-2"
                        >
                          Mobile
                        </label>
                        <div className="relative">
                          <FaMobileAlt className="absolute text-sm text-gray-600 transform -translate-y-1/2 left-3 top-1/2 sm:text-base" />
                          <input
                            className={`w-full px-3 py-3 text-gray-600  sm:px-4 sm:py-3 pl-8 sm:pl-10 text-sm sm:text-base border rounded-lg focus:outline-none bg-white`}
                            name="Mobile"
                            maxLength={10}
                            value={formik.values.Mobile}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, "");
                              formik.setFieldValue("Mobile", value);
                            }}
                            onBlur={formik.handleBlur}
                            placeholder="Enter Mobile Number"
                            id="mobile"
                          />
                        </div>
                        {formik.touched.Mobile && formik.errors.Mobile && (
                          <div className="mt-1 text-xs text-red-500 sm:text-sm">
                            {formik.errors.Mobile}
                          </div>
                        )}
                      </div>
                      <div className="relative">
                        <label
                          htmlFor="emailId"
                          className="block mb-1 text-sm font-medium text-gray-600 sm:mb-2"
                        >
                          Email Id
                        </label>
                        <div className="relative">
                          <FaEnvelope className="absolute text-sm text-gray-600 transform -translate-y-1/2 left-3 top-1/2 sm:text-base" />
                          <input
                            className={`w-full px-3 py-3 sm:px-4 text-gray-600 sm:py-3 pl-8 sm:pl-10 text-sm sm:text-base border rounded-lg focus:outline-none bg-white`}
                            name="EmailId"
                            maxLength={100}
                            value={formik.values.EmailId}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder="Enter Email Address"
                            id="emailId"
                          />
                        </div>
                        {formik.touched.EmailId && formik.errors.EmailId && (
                          <div className="mt-1 text-xs text-red-500 sm:text-sm">
                            {formik.errors.EmailId}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* First Name and Last Name */}
                    <div className="grid grid-cols-1 gap-4 mt-2 sm:grid-cols-2">
                      <div className="relative">
                        <label
                          htmlFor="firstName"
                          className="block mb-1 text-sm font-medium text-gray-600 sm:mb-2"
                        >
                          First Name
                        </label>
                        <div className="relative">
                          <FaUser className="absolute text-sm text-gray-600 transform -translate-y-1/2 left-3 top-1/2 sm:text-base" />
                          <input
                            className={`w-full px-3 py-3 text-gray-600 sm:px-4 sm:py-3 pl-8 sm:pl-10 text-sm sm:text-base border rounded-lg focus:outline-none bg-white`}
                            name="firstName"
                            maxLength={100}
                            value={formik.values.firstName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder="Enter First Name"
                            id="firstName"
                          />
                        </div>
                        {formik.touched.firstName &&
                          formik.errors.firstName && (
                            <div className="mt-1 text-xs text-red-500 sm:text-sm">
                              {formik.errors.firstName}
                            </div>
                          )}
                      </div>
                      <div className="relative">
                        <label
                          htmlFor="lastName"
                          className="block mb-1 text-sm font-medium text-gray-600 sm:mb-2"
                        >
                          Last Name
                        </label>
                        <div className="relative">
                          <FaUser className="absolute text-sm text-gray-600 transform -translate-y-1/2 left-3 top-1/2 sm:text-base" />
                          <input
                            className={`w-full px-3 py-3 sm:px-4 text-gray-600 sm:py-3 pl-8 sm:pl-10 text-sm sm:text-base border rounded-lg focus:outline-none bg-white`}
                            name="lastName"
                            maxLength={100}
                            value={formik.values.lastName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder="Enter Last Name"
                            id="lastName"
                          />
                        </div>
                        {formik.touched.lastName && formik.errors.lastName && (
                          <div className="mt-1 text-xs text-red-500 sm:text-sm">
                            {formik.errors.lastName}
                          </div>
                        )}
                      </div>
                    </div>

                   

                    {/* Password */}
                    <div className="relative mt-1">
                      <label
                        htmlFor="password"
                        className="block mb-1 text-sm font-medium text-gray-600 sm:mb-2"
                      >
                        Password
                      </label>
                      <div className="relative">
                        <FaLock className="absolute text-sm text-gray-600 transform -translate-y-1/2 left-3 top-1/2 sm:text-base" />
                        <input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          className={`w-full px-3 py-3 text-gray-600 sm:px-4 sm:py-3 pl-8 sm:pl-10 text-sm sm:text-base border rounded-lg focus:outline-none bg-white pr-10`}
                          name="password"
                          value={formik.values.password}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          placeholder="Enter Password"
                        />
                        <button
                          type="button"
                          className="absolute text-gray-500 transform -translate-y-1/2 right-3 top-1/2 hover:text-gray-700"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <FaEyeSlash className="text-sm sm:text-base" />
                          ) : (
                            <FaEye className="text-sm sm:text-base" />
                          )}
                        </button>
                      </div>
                      {formik.touched.password && formik.errors.password && (
                        <div className="mt-1 text-xs text-red-500 sm:text-sm">
                          {formik.errors.password}
                        </div>
                      )}
                    </div>

                    {/* OTP */}
                    <div className="grid grid-cols-1 gap-4 pb-1 mt-2 sm:grid-cols-2 ">
                      <div className="relative">
                        <label
                          htmlFor="otp"
                          className="block mb-1 text-sm font-medium text-gray-600 sm:mb-2"
                        >
                          Email verification code
                        </label>
                        <div className="relative ">
                          <FaShieldAlt className="absolute text-sm text-gray-600 transform -translate-y-1/2 left-3 top-1/2 sm:text-base" />
                          <input
                            className={`w-full max-w-60 px-3  py-3 text-gray-600 sm:px-4 sm:py-3 pl-8 sm:pl-10 text-sm sm:text-base border rounded-lg focus:outline-none bg-white`}
                            name="OTP"
                            maxLength={6}
                            value={formik.values.OTP}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder="Please enter otp"
                            id="otp"
                          />
                        </div>
                        {formik.touched.OTP && formik.errors.OTP && (
                          <div className="absolute mt-1 text-xs text-red-500 sm:text-sm">
                            {formik.errors.OTP}
                          </div>
                        )}
                      </div>
                      <div className="flex items-end">
                        <button
                          type="button"
                          onClick={fnSendOtpRegistration}
                          className={`w-full px-3 py-3 sm:px-4 text-gray-600 focus:outline-none sm:py-3 text-sm sm:text-base rounded-lg cursor-pointer border flex items-center transition-all duration-200 justify-center gap-2 ${!formik.values.EmailId ||
                            !!formik.errors.EmailId ||
                            isSendingOtp
                            ? "border-gray-300 bg-[#6633ff] text-white"
                            : " bg-[#6633ff] text-white  transition hover:shadow-xl transform hover:scale-105"
                            }`}
                        >
                          {isSendingOtp ? (
                            <>
                              <ClipLoader
                                color="#ffffff"
                                size={14}
                                className="mr-2"
                              />
                              Please wait...
                            </>
                          ) : (
                            <>
                              <KeyRound className="w-4 h-4" />
                              Send OTP
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Terms and Conditions */}
                  <div className="pt-1">
                    <div className="flex items-start mt-3 sm:mt-3">
                      <div className="flex items-center h-5">
                        <input
                          type="checkbox"
                          name="checkbox1"
                          checked={formik.values.checkbox1}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className="w-4 h-4 text-blue-600 transition border-gray-300 rounded focus:ring-blue-500"
                        />
                      </div>
                      <label
                        htmlFor="checkbox1"
                        className="block ml-2 text-xs text-gray-600 select-none sm:text-sm"
                      >
                        I agree to the{" "}
                        <Link
                          href="https://rentelligence.ai/TermsCondition"
                          className="hover:underline"
                        >
                          Terms of Use
                        </Link>{" "}
                        &{" "}
                        <Link
                          href="https://rentelligence.ai/Privacypolicy"
                          className="hover:underline"
                        >
                          Privacy Policy.
                        </Link>
                      </label>
                    </div>
                  </div>
                  {formik.touched.checkbox1 && formik.errors.checkbox1 && (
                    <div className="text-xs text-red-500 sm:text-sm">
                      {formik.errors.checkbox1}
                    </div>
                  )}

                  {/* Turnstile */}
                  <div className="w-full mt-4 turnstile">
                    <Turnstile
                      className="w-[100%]"
                      siteKey="0x4AAAAAAB0Mb45P-iClKMI0"
                      onSuccess={(token) => {
                        setTurnstileToken(token);
                      }}
                    />
                  </div>

                  {/* Submit Button */}
                  <div>
                    <button
                      type="submit"
                      className="flex items-center justify-center w-full px-4 pb-2 mt-1 font-semibold text-white transition duration-300 rounded-lg sm:mt-1 sm:pb-3"
                      disabled={formik.isSubmitting}
                    >
                      {formik.isSubmitting ? (
                        <>
                          <ClipLoader color="#ffffff" size={18} />
                          <span className="ml-2 text-sm sm:text-base">
                            Creating account...
                          </span>
                        </>
                      ) : (
                        <span className="flex items-center gap-2 th-btn style2">
                          Create Account
                          <FiArrowRight className="text-lg" />
                        </span>
                      )}
                    </button>
                  </div>
                </form>

                <div className="mt-2 text-center">
                  <Link
                    href="/home/login"
                    className="text-sm text-gray-600 cursor-pointer sm:text-base hover:underline"
                  >
                    Already have an account?{" "}
                    <span className="font-bold text-gray-600 transition-colors">
                      Log in
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

// Wrapper component to provide Suspense for useSearchParams binding
export default function RegistrationPage() {
  return (
    <Suspense fallback={<Loader />}>
      <Registration />
    </Suspense>
  );
}