import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { getVerifyEventUser } from "../redux/slices/eventSlice";

export default function OtpInput({
  show,
  otpValue,
  setOtpValue,
  otpError,
  onSubmit,
  onCancel,
  depositWalletValue,
  quantity,
  accessType,
}) {
  const dispatch = useDispatch();
  const [usernames, setUsernames] = useState([]);
  const [validationMessages, setValidationMessages] = useState([]);

  useEffect(() => {
    if (quantity === 2) {
      setUsernames(new Array(1).fill(""));
      setValidationMessages(new Array(1).fill(null));
    } else if (quantity === 3 || quantity === 4 || quantity === 5) {
      setUsernames(new Array(1).fill(""));
      setValidationMessages(new Array(1).fill(null));
    } else if (quantity && quantity > 1) {
      setUsernames(new Array(quantity).fill(""));
      setValidationMessages(new Array(quantity).fill(null));
    } else if (quantity === 1) {
      setUsernames(new Array(1).fill(""));
      setValidationMessages(new Array(1).fill(null));
    } else {
      setUsernames([]);
      setValidationMessages([]);
    }
  }, [quantity]);

  const verifyUsername = async (index, value) => {
    const newUsernames = [...usernames];
    newUsernames[index] = value;
    const messages = [...validationMessages];

    if (value && value.trim().length === 9) {
      try {
        const result = await dispatch(getVerifyEventUser(value.trim())).unwrap();

        if (result && result.event?.[0].VerifyStatus === "Not Verify") {
          messages[index] = "Not Verify";
        } else {
          messages[index] = "Verify";

          // Logic to open next input field only after previous is verified,
          // considering quantity 2 should show only 1 input, and quantity 3 shows 2 inputs
          if (quantity === 2) {
            // limit to 1 input (index 0)
            if (index === 0 && usernames.length < 1) {
              newUsernames.push("");
              messages.push(null);
            }
          } else if (quantity === 3 || quantity === 4 || quantity === 5) {
            // open next input only after previous username verified, strictly opening one by one for quantity 3,4,5
            if (index === 0 && usernames.length < Math.min(quantity, 5)) {
              newUsernames.push("");
              messages.push(null);
            }
          } else {
            // existing logic for other quantities
            if (quantity > index + 1 && usernames.length < quantity) {
              newUsernames.push("");
              messages.push(null);
            }
          }
        }
      } catch {
        messages[index] = "User Not Found";
      }
    } else if (value && value.trim().length !== 9) {
      messages[index] = "Username must be 9 digits";
    } else {
      messages[index] = null;
    }

    setUsernames(newUsernames);
    setValidationMessages(messages);
  };

  const handleUsernameChange = (index, value) => {
    verifyUsername(index, value);
  };

  const handleSubmit = () => {
    // Removed validation related to submit error
    if (onSubmit) {
      onSubmit();
      // Clear usernames and validation messages after submit
      setUsernames([]);
      setValidationMessages([]);
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Enter") {
      if (usernames[index] && usernames[index].trim() !== "") {
        verifyUsername(index, usernames[index].trim());
      }
    }
  };

  if (!show) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-25 z-10" />
      <div className="fixed inset-0 overflow-y-auto z-20">
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white p-6 text-left shadow-xl">

            {depositWalletValue && (
              <p className="mt-2  mb-4 text-lg font-semibold text-green-700">
                Deposit Wallet: ${depositWalletValue}
              </p>
            )}

            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800 ">Confirm Booking</h3>
              <p className="text-gray-600">Do you want to book this event?</p>
            </div>

            <h3 className="text-lg font-medium leading-6 mt-4 text-gray-900">Enter OTP</h3>
            <div className="mt-4">
              <input
                type="number"
                value={otpValue}
                onChange={(e) => setOtpValue(e.target.value)}
                className="w-full p-2 border rounded text-center"
                maxLength={9}
                placeholder="Enter OTP"
              />
              {otpError && (
                <p className="text-red-600 mt-1">{otpError}</p>
              )}
            </div>

            <div className="pt-4">
              {accessType === "Exclusive Event" && usernames.length > 0 && quantity > 1 && (
                <>
                  {usernames.map((username, index) => (
                    <div className="mb-4" key={index}>
                      <label
                        htmlFor={`username-${index}`}
                        className="block mb-1 font-medium text-gray-700"
                      >
                        Enter UserName #{index + 2}
                      </label>
                      <input
                        id={`username-${index}`}
                        type="text"
                        value={username}
                        onChange={(e) => handleUsernameChange(index, e.target.value)}
                        onKeyPress={(e) => handleKeyDown(e, index)}
                        className="w-full p-2 border rounded"
                        placeholder={`UserName #${index + 2}`}
                        maxLength={9}
                      />
                      {validationMessages[index] && (
                        <p
                          className={
                            validationMessages[index] === "User Not Found"
                              ? "text-red-600 mt-1 pb-12"
                              : "text-green-600 mt-1"
                          }
                        >
                          {validationMessages[index]}
                        </p>
                      )}
                    </div>
                  ))}
                </>
              )}
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                className="inline-flex justify-center rounded-md border border-transparent bg-gray-300 px-4 py-2 text-sm font-medium text-black hover:bg-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-500"
                onClick={onCancel}
              >
                Cancel
              </button>
              <button
                type="button"
                className={`inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                  quantity === 1
                    ? "bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500"
                    : otpValue &&
                      (accessType !== "Exclusive Event" ||
                        (validationMessages.length > 0 &&
                          validationMessages.every(
                            (msg) => msg === "Verify"
                          )))
                      ? "bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500"
                      : "bg-gray-300 text-black cursor-not-allowed"
                }`}
                onClick={handleSubmit}
                disabled={
                  quantity === 1
                    ? false
                    : !otpValue ||
                      (accessType === "Exclusive Event" &&
                        (validationMessages.length === 0 ||
                          validationMessages.some(
                            (msg) => msg !== "Verify"
                          )))
                }
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

