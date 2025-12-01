"use client";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  updateUserProfile,
  getAllCountry,
  sendOtpRequest,
  validateOtp,
} from "@/app/redux/slices/authSlice";
import { usernameByLoginId } from "@/app/redux/slices/fundManagerSlice";
import { getEncryptedLocalData } from "@/app/api/auth";
import toast from "react-hot-toast";
import Select from "react-select";
import { getUserId } from "@/app/api/auth";
import Loader from "@/app/components/Loader";
import { encryptData } from "@/app/utils/encryption";

const CountryOption = ({ innerProps, data, isFocused }) => (
  <div
    {...innerProps}
    className={`flex items-center px-3 py-2 cursor-pointer ${
      isFocused ? "bg-gray-100 dark:bg-gray-600" : ""
    }`}
  >
    {data.countryFlag && (
      <img
        src={data.countryFlag}
        alt={`${data.label} flag`}
        className="w-5 h-5 mr-2 rounded-full"
      />
    )}
    <span className="text-gray-800 dark:text-black">{data.label}</span>
  </div>
);

const CountrySingleValue = ({ data }) => (
  <div className="flex items-center">
    {data.countryFlag && (
      <img
        src={data.countryFlag}
        alt={`${data.label} flag`}
        className="w-5 h-5 mr-2 rounded-full"
      />
    )}
    <span className="text-gray-800 dark:text-white">{data.label}</span>
  </div>
);

const isValidBep20Length = (value) => {
  if (!value) return true;
  return value && value.length >= 38 && value.length <= 44;
};

export default function EditProfile() {
  const dispatch = useDispatch();
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [isOtpLoading, setIsOtpLoading] = useState(false);
  const [isSaveLoading, setIsSaveLoading] = useState(false);
  const { usernameData, loading } = useSelector((state) => state.fund);
  const { getAllCountryData } = useSelector((state) => state.auth);
  const [isDirty, setIsDirty] = useState(false);
  const [isWalletSet, setIsWalletSet] = useState(false);

  const [info, setInfo] = useState({
    loginID: "",
    fName: "",
    lName: "",
    email: "",
    mobile: "",
    countryid: 0,
    walletBep20: "",
    address: "",
  });

  const [originalWallet, setOriginalWallet] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [countryCode, setCountryCode] = useState("");

  useEffect(() => {
    dispatch(getAllCountry());
    const AuthId = getEncryptedLocalData("AuthLogin");
    dispatch(usernameByLoginId(AuthId));
  }, [dispatch]);

  useEffect(() => {
    if (usernameData?.data) {
      const userData = {
        loginID: getEncryptedLocalData("AuthLogin") || "",
        fName: usernameData.data.fName || "",
        lName: usernameData.data.lName || "",
        email: usernameData.data.email || "",
        mobile: usernameData.data.mobile || "",
        countryid: usernameData.data.countryId
          ? parseInt(usernameData.data.countryId)
          : 0,
        walletBep20: usernameData.data.walletBep20,
        address: usernameData.data.address || "",
      };
      setInfo(userData);
      setOriginalWallet(usernameData.data.walletBep20 || "");

      // Check if wallet was previously set (not empty and valid length)
      if (
        usernameData.data.walletBep20 &&
        isValidBep20Length(usernameData.data.walletBep20)
      ) {
        setIsWalletSet(true);
      }

      if (getAllCountryData?.data && usernameData.data) {
        let country = null;

        if (usernameData.data.countryId) {
          country = getAllCountryData.data.find(
            (c) => c.country_Id === usernameData.data.countryId
          );
        }
        if (!country && usernameData.data.country_Name) {
          country = getAllCountryData.data.find(
            (c) =>
              c.country_Name?.toLowerCase() ===
              usernameData.data.country_Name?.toLowerCase()
          );
        }

        if (country) {
          const countryOption = {
            value: country.country_Id,
            label: country.country_Name,
            countryFlag: country.countryFlag,
            countryCode: country.phonecode,
            countryName: country.country_Name,
          };
          setSelectedCountry(countryOption);
          setCountryCode(country.phonecode);
        }
      }
    }
  }, [usernameData?.data, getAllCountryData?.data]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "mobile") {
      const cleanedValue = value.replace(/\D/g, "");

      if (cleanedValue.length > 13) return;

      const isRepetitionOnly = /^(\d)\1+$/.test(cleanedValue);
      if (isRepetitionOnly) {
        toast.error("Repetition-only numbers are not allowed");
        return;
      }

      setInfo({ ...info, mobile: cleanedValue });
      setIsDirty(true);
      return;
    }

    // Prevent changes to wallet if already set
    if (name === "walletBep20" && isWalletSet) {
      return;
    }

    if (name === "walletBep20") {
      if (originalWallet !== value) {
        setIsOtpSent(false);
        setOtp("");
      }
    }

    setInfo({ ...info, [name]: value });
    setIsDirty(true);
  };

  const handleCountryChange = (selectedOption) => {
    if (selectedOption) {
      setSelectedCountry(selectedOption);
      setInfo({
        ...info,
        countryid: selectedOption.value,
      });
      setCountryCode(selectedOption.countryCode);
      setIsDirty(true);
    }
  };

  const handleSendOtp = async () => {
    if (!info.walletBep20) {
      toast.error("Please enter wallet address first");
      return;
    }

    if (!isValidBep20Length(info.walletBep20)) {
      toast.error("Wallet address must be 38-44 characters long");
      return;
    }

    try {
      setIsOtpLoading(true);
      const response = await dispatch(
        sendOtpRequest({
          emailId: info.email,
          walletAddress: info.walletBep20,
        })
      ).unwrap();

      if (response?.statusCode === 200) {
        setIsOtpSent(true);
        toast.success("OTP sent to your email");
      } else {
        toast.error(response?.message || "Failed to send OTP");
      }
    } catch (error) {
      toast.error(error?.message || "Failed to send OTP");
    } finally {
      setIsOtpLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const walletChanged = originalWallet !== info.walletBep20;
    if (walletChanged) {
      if (info.walletBep20 !== "" && !isValidBep20Length(info.walletBep20)) {
        toast.error("Please Enter a Valid BEP20 USDT  Wallet Address");
        return;
      }

      if (info.walletBep20 !== "" && !isOtpSent) {
        toast.error("Please verify your wallet address with OTP first");
        return;
      }

      if (isOtpSent && !otp) {
        setOtpError("Please enter the OTP");
        return;
      }
    }

    try {
      setIsSaveLoading(true);
      if (walletChanged && isOtpSent && otp) {
        const otpResponse = await dispatch(
          validateOtp({
            urid: getUserId(),
            otp: otp.trim(),
          })
        ).unwrap();

        if (otpResponse?.statusCode !== 200) {
          toast.error(otpResponse?.message || "Invalid OTP");
          return;
        }
      }

      const payload = {
        loginID: info.loginID,
        fName: info.fName,
        lName: info.lName,
        email: info.email,
        mobile: info.mobile,
        countryid: info.countryid,
        walletBep20: info.walletBep20,
        address: info.address,
      };

      const response = await dispatch(
        updateUserProfile({
          data: payload,
          image: null,
        })
      ).unwrap();

      if (response?.response?.statusCode === 200) {
        toast.success("Profile updated successfully");
        setOriginalWallet(info.walletBep20);

        // Update localStorage with new wallet address
        if (info.walletBep20) {
          localStorage.setItem("walletBep20", encryptData(info.walletBep20));
        }

        // Set wallet as set if it's valid and not empty
        if (info.walletBep20 && isValidBep20Length(info.walletBep20)) {
          setIsWalletSet(true);
        }

        setIsOtpSent(false);
        setOtp("");
        setIsDirty(false);
      } else {
        toast.warning(
          response?.message || "Something happened, please check again"
        );
      }
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error(error?.message || "Failed to update profile");
    } finally {
      setIsSaveLoading(false);
    }
  };

  const countryOptions =
    getAllCountryData?.data?.map((country) => ({
      value: country.country_Id,
      label: country.country_Name,
      countryFlag: country.countryFlag,
      countryCode: country.phonecode,
    })) || [];

  // Check if wallet has been changed
  const walletChanged = originalWallet !== info.walletBep20;

  // Determine if save button should be disabled
  const isSaveButtonDisabled = walletChanged
    ? !isValidBep20Length(info.walletBep20) ||
      (info.walletBep20 !== "" && !isOtpSent)
    : false;

  const isWalletAddressFound =
    info.walletBep20 && isValidBep20Length(info.walletBep20);
  const shouldShowOtpButton = walletChanged && info.walletBep20 && !isOtpSent;

  return (
    <div className="max-w-3xl p-6 mx-auto rounded-lg shadow-sm dark:border-white dark:bg-gray-800">
      {loading && <Loader />}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              First Name
            </label>
            <input
              type="text"
              name="fName"
              value={info?.fName || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Last Name
            </label>
            <input
              type="text"
              name="lName"
              value={info?.lName || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={info.email}
            readOnly
            className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md cursor-not-allowed focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-3">
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Country Code
            </label>
            <input
              type="text"
              value={countryCode ? `+${countryCode}` : `+${info.countryid}`}
              readOnly
              className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md cursor-not-allowed focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div className="col-span-9">
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Mobile
            </label>
            <input
              type="number"
              name="mobile"
              value={info.mobile}
              onChange={handleChange}
              pattern="^[0-9]{7,13}$"
              className="w-full px-3 py-2 border border-gray-300 rounded-md 
             focus:outline-none focus:ring-1 focus:ring-blue-500 
             dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            {info.mobile &&
              (info.mobile.length < 7 || info.mobile.length > 13) && (
                <p className="mt-1 text-sm text-red-500">
                  Mobile number must be between 7 and 13 digits
                </p>
              )}
          </div>
        </div>

        <div className="relative w-full">
          <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Country
          </label>
          <div className="relative">
            <Select
              options={countryOptions}
              value={selectedCountry}
              onChange={handleCountryChange}
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
                  height: "44px",
                  borderRadius: "0.375rem", // rounded-md
                  borderWidth: "1px",
                  borderColor: state.isFocused ? "#3b82f6" : "var(--tw-border)",
                  boxShadow: state.isFocused ? "0 0 0 1px #3b82f6" : "none",
                  backgroundColor: "var(--tw-bg)",
                  color: "var(--tw-text)",
                  "&:hover": {
                    borderColor: "#3b82f6",
                  },
                }),
                valueContainer: (provided) => ({
                  ...provided,
                  height: "44px",
                  padding: "0 4px",
                  display: "flex",
                  alignItems: "center",
                }),
                input: (provided) => ({
                  ...provided,
                  margin: "0px",
                  padding: "0px",
                  color: "#000",
                }),
                indicatorsContainer: (provided) => ({
                  ...provided,
                  height: "44px",
                }),
                singleValue: (provided) => ({
                  ...provided,
                  display: "flex",
                  alignItems: "center",
                  color: "#000",
                }),
                placeholder: (provided) => ({
                  ...provided,
                  color: "#9ca3af", // gray-400
                }),
                menu: (provided) => ({
                  ...provided,
                  backgroundColor: "var(--tw-bg)", // light/dark auto
                  border: "1px solid #d1d5db",
                  zIndex: 20,
                }),
                option: (provided, state) => ({
                  ...provided,
                  backgroundColor: state.isSelected
                    ? "#3b82f6"
                    : state.isFocused
                    ? "var(--tw-hover)" // <-- light/dark hover
                    : "transparent",
                  color: state.isSelected ? "#ffffff" : "#e5e7eb",
                  "&:active": {
                    backgroundColor: "#e5e7eb", // <-- active state light/dark
                  },
                }),
              }}
              isSearchable
              required
            />
          </div>
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Address
          </label>
          <input
            type="text"
            name="address"
            value={info?.address || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Wallet Address
            {isWalletSet ? (
              <span className="ml-2 text-sm text-green-600">
                ✓ Wallet is set
              </span>
            ) : !walletChanged ? (
              <span className="ml-2 text-sm text-gray-500">
                (No OTP required for current wallet)
              </span>
            ) : null}
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                name="walletBep20"
                value={info?.walletBep20 || ""}
                onChange={handleChange}
                maxLength={44}
                className={`w-full px-3 py-2 border ${
                  info.walletBep20
                    ? isValidBep20Length(info.walletBep20)
                      ? ""
                      : ""
                    : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  isWalletSet ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
                disabled={isOtpSent || isWalletSet}
                readOnly={isWalletSet}
              />
            </div>
            {shouldShowOtpButton && (
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={
                  !info?.walletBep20 ||
                  !isValidBep20Length(info.walletBep20) ||
                  isOtpLoading
                }
                className={`px-4 py-2 font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
                  !info.walletBep20 || !isValidBep20Length(info.walletBep20)
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#6D30fb]"
                }`}
              >
                {isOtpLoading ? <Loader size={20} /> : "Send OTP"}
              </button>
            )}
          </div>
          {info.walletBep20 && !isValidBep20Length(info?.walletBep20) && (
            <p className="mt-1 text-sm text-red-500">
             Please Enter a Valid BEP20 USDT  Wallet Address
            </p>
          )}
        </div>

        {isOtpSent && walletChanged && (
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Enter OTP (Sent to Email)
            </label>
            <input
              type="text"
              value={otp}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                setOtp(value);
                setOtpError("");
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Enter OTP"
            />
            {otpError && (
              <p className="mt-1 text-sm text-red-600">{otpError}</p>
            )}
          </div>
        )}

        <div className="mt-6">
          <button
            type="submit"
            disabled={isSaveButtonDisabled || isSaveLoading}
            className={`w-full px-4 py-2 font-medium text-white rounded-md focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
              isSaveButtonDisabled || isSaveLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "th-btn style2"
            }`}
          >
            {isSaveLoading ? <Loader size={20} /> : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
