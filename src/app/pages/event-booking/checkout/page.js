"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  RiCheckLine,
  RiEmotionSadLine,
  RiErrorWarningLine,
  RiWallet3Line,
  RiCalendarLine,
  RiMapPinLine,
  RiTicketLine,
  RiUserLine,
  RiArrowLeftLine,
} from "react-icons/ri";

import { getUserId, getEmailId } from "@/app/api/auth";
import {
  getEventById,
  getEventSchedule,
  addUserEventbooking,
} from "@/app/redux/slices/eventSlice";
import { sendOtpEvent, validateOtp } from "@/app/redux/slices/authSlice";
import { getTransferIncomeToDepositWalletReport } from "@/app/redux/slices/fundManagerSlice";

import OtpInput from "@/app/components/OtpInput";

export default function CheckoutPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [eventId, setEventId] = useState(null);
  const [selectedTicketIndex, setSelectedTicketIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [username, setUserName] = useState("");

  const [otpValue, setOtpValue] = useState("");
  const [otpError, setOtpError] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [ticketNumber, setTicketNumber] = useState(null);
  const [isUserVerified, setIsUserVerified] = useState(false);

  const selectedEvent = useSelector((state) => state.event.selectedEvent);
  const getTransferIncomeToDepositWalletReportData = useSelector(
    (state) => state.fund.getTransferIncomeToDepositWalletReportData
  );

  const depositWalletValue =
    getTransferIncomeToDepositWalletReportData?.walletBalance?.[0]?.depositWallet || 0;

  const userEvent = selectedEvent?.userEvent;

  const tickets =
    userEvent && userEvent[0]
      ? [
        userEvent[0]?.SessionsTime
          ? {
            type: userEvent[0].SessionsTime,
            price: userEvent[0].EventPrice,
            seats: `${userEvent[0].SessionSeats || ""} available`,
            features: [
              "All sessions access",
              "Digital materials",
              "Lunch included",
              "Certificate",
            ],
          }
          : null,
        userEvent[0]?.SessionsTimeOne
          ? {
            type: userEvent[0].SessionsTimeOne,
            price: userEvent[0].EventPrice,
            seats: `${userEvent[0].AvailableOneSeats || ""} available`,
            features: [
              "VIP features",
              "Speaker sessions",
              "Premium package",
              "Priority support",
            ],
          }
          : null,
        userEvent[0]?.SessionsTimeTwo
          ? {
            type: userEvent[0].SessionsTimeTwo,
            price: userEvent[0].EventPrice,
            seats: `${userEvent[0].AvailableTwoSeats || ""} available`,
            features: [
              "Standard features",
              "VIP seating",
              "Meet & greet",
              "Premium lunch",
            ],
          }
          : null,
      ].filter(Boolean)
      : [];

  const selectedTicket = tickets[selectedTicketIndex] || null;
  const subtotal = selectedTicket ? selectedTicket.price * quantity : 0;
  const total = subtotal;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const eventIdParam = params.get("eventId");
    const ticketIndexParam = params.get("ticketIndex");
    const quantityParam = params.get("quantity");

    setEventId(eventIdParam || null);
    setSelectedTicketIndex(ticketIndexParam ? parseInt(ticketIndexParam, 10) : 0);
    setQuantity(quantityParam ? parseInt(quantityParam, 10) : 1);

    if (eventIdParam) dispatch(getEventById(eventIdParam));
  }, [dispatch]);

  useEffect(() => {
    if (userEvent?.[0]?.EventMasterID) {
      dispatch(getEventSchedule(userEvent[0].EventMasterID));
    }
  }, [userEvent, dispatch]);

  useEffect(() => {
    const urid = getUserId();
    dispatch(getTransferIncomeToDepositWalletReport(urid));
  }, [dispatch]);

  useEffect(() => {
    // Debug log to check the value
    console.log("MultipleSeatbook value in checkout:", userEvent?.[0]?.MultipleSeatbook);
    console.log("Should show quantity controls:", userEvent?.[0]?.MultipleSeatbook === 1);
  }, [userEvent]);

  const handleConfirmBooking = async () => {
    try {
      const emailId = getEmailId();
      const result = await dispatch(sendOtpEvent({ emailId: emailId })).unwrap();
      if (result.statusCode === 200) {
        toast.success("OTP sent successfully! Please check your mail");
        setShowOtpInput(true);
      } else {
        toast.error(result?.payload || "Failed to send OTP");
      }
    } catch (err) {
      toast.error("An unexpected error occurred while sending OTP");
    }
  };

  const handleOtpSubmit = async () => {
    const userId = getUserId();
    const data = { urid: userId, otp: otpValue };

    try {
      const result = await dispatch(validateOtp(data)).unwrap();
      if (result.statusCode === 200) {
        setShowOtpInput(false);
        setShowConfirmation(true);
        toast.success("OTP verified successfully! Booking confirmed.");

        const generatedTicketNumber = `TKT-${new Date().getFullYear()}-${Math.random()
          .toString(36)
          .slice(2, 11)
          .toUpperCase()}`;
        setTicketNumber(generatedTicketNumber);

        const payload = {
          urid: userId,
          eventMasterID: userEvent?.[0]?.EventMasterID,
          ticketNumber: generatedTicketNumber,
          sessionTime: selectedTicket?.type,
          price: total,
          requestedSeats: quantity,
          accessType: selectedEvent?.userEvent?.[0]?.AccessType,
          type: selectedTicketIndex + 1,
        };

        try {
          const bookingResult = await dispatch(addUserEventbooking(payload)).unwrap();
          if (bookingResult.statusCode === 200) {
            setShowOtpInput(false);
            setOtpValue("");
            setOtpError("");
          } else {
            toast.error(bookingResult.message);
          }
        } catch (error) {
          console.error("Booking failed:", error);
          toast.error("Booking failed. Please try again.");
        }
      } else {
        setOtpError(result.message || "Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("OTP validation failed:", error);
      setOtpError("OTP validation failed. Please try again.");
    }
  };


  return (
    <div className="min-h-screen py-8 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-6xl px-4 mx-auto sm:px-6 lg:px-8">
        {/* Header */}
        {!showConfirmation && (
          <div className="mb-8">
            <button
              onClick={() => router.back()}
              className="flex items-center mb-4 font-medium text-blue-600 transition-colors duration-200 hover:text-blue-700"
            >
              <RiArrowLeftLine className="mr-2" />
              Back to Events
            </button>
            <h1 className="text-3xl font-bold text-center text-gray-900 sm:text-4xl sm:text-left">
              Checkout
            </h1>
          </div>
        )}

        <div className="overflow-hidden bg-white shadow-xl rounded-2xl">
          {!showConfirmation ? (
            <>
              {tickets.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[500px] text-center px-6 py-12">
                  <div className="p-6 mb-6 bg-gray-100 rounded-full">
                    <RiEmotionSadLine className="text-6xl text-gray-400" />
                  </div>
                  <h2 className="mb-4 text-2xl font-bold text-gray-900 sm:text-3xl">
                    Your checkout is empty
                  </h2>
                  <p className="max-w-md mb-8 text-lg text-gray-600">
                    Please select tickets before proceeding to checkout.
                  </p>
                  <button
                    onClick={() => router.push("/pages/event-booking")}
                    className="px-8 py-3 font-semibold text-white transition-all duration-200 transform bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700 hover:scale-105"
                  >
                    Browse Events
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-8 p-6 lg:grid-cols-2 sm:p-8">
                  {/* Left Column - Event Details */}
                  <div className="space-y-6">
                    {/* Event Card */}
                    <div className="p-6 border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                      <div className="flex items-start gap-4">
                        {userEvent?.[0]?.Image && (
                          <div className="relative flex-shrink-0 w-20 h-20 overflow-hidden rounded-lg">
                            <Image
                              src={userEvent[0].Image}
                              alt={userEvent[0].Tittle || "Event Image"}
                              fill
                              style={{ objectFit: "cover" }}
                              priority={true}
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h2 className="mb-2 text-xl font-bold text-gray-900 line-clamp-2">
                            {userEvent?.[0]?.Tittle || "Event Title"}
                          </h2>
                          <div className="space-y-2">
                            <div className="flex items-center text-gray-600">
                              <RiCalendarLine className="mr-2 text-blue-500" />
                              <span className="text-sm">
                                {userEvent?.[0]?.EventStartDate} to {userEvent?.[0]?.EndStartDate}
                              </span>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <RiMapPinLine className="mr-2 text-blue-500" />
                              <span className="text-sm">{userEvent?.[0]?.Location || "N/A"}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Ticket Details Card */}
                    <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
                      <div className="flex items-center mb-4">
                        <RiTicketLine className="mr-2 text-xl text-blue-500" />
                        <h3 className="text-lg font-semibold text-gray-900">Ticket Details</h3>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between py-3 border-b border-gray-100">
                          <span className="font-medium text-gray-600">Event Time</span>
                          <span className="font-semibold text-gray-900">{selectedTicket?.type || "N/A"}</span>
                        </div>

                        {/* Show Quantity section only when MultipleSeatbook is 1 */}
                        {userEvent?.[0]?.MultipleSeatbook === 1 ? (
                          <div className="flex items-center justify-between py-3 border-b border-gray-100">
                            <span className="font-medium text-gray-600">Quantity</span>
                            <div className="flex items-center space-x-3">
                              <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="flex items-center justify-center w-8 h-8 transition-colors border border-gray-300 rounded-full hover:bg-gray-50"
                              >
                                -
                              </button>
                              <span className="font-semibold text-center text-gray-900 min-w-8">
                                {quantity}
                              </span>
                              <button
                                onClick={() => setQuantity(quantity + 1)}
                                className="flex items-center justify-center w-8 h-8 transition-colors border border-gray-300 rounded-full hover:bg-gray-50"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        ) : (
                          /* When MultipleSeatbook is 0, show a static quantity of 1 */
                          <div className="flex items-center justify-between py-3 border-b border-gray-100">
                            <span className="font-medium text-gray-600">Quantity</span>
                            <span className="font-semibold text-gray-900">1</span>
                          </div>
                        )}

                        {isUserVerified && (
                          <div className="p-4 border border-green-200 rounded-lg bg-green-50">
                            <div className="flex items-center text-green-700">
                              <RiCheckLine className="mr-2" />
                              <span className="font-medium">User verified successfully</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Payment Summary */}
                  <div className="space-y-6">
                    {/* Order Summary Card */}
                    <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
                      <h3 className="mb-4 text-lg font-semibold text-gray-900">Order Summary</h3>

                      <div className="mb-6 space-y-3">
                        <div className="flex items-center justify-between py-2">
                          <span className="text-gray-600">Subtotal</span>
                          <span className="font-medium text-gray-900">${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center justify-between py-2">
                          <span className="text-gray-600">Service Fee</span>
                          <span className="font-medium text-gray-900">$0.00</span>
                        </div>
                        <div className="pt-3 border-t border-gray-200">
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-bold text-gray-900">Total</span>
                            <span className="text-2xl font-bold text-blue-600">${total.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Wallet Balance */}
                      <div className="p-4 mb-6 rounded-lg bg-gray-50">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <RiWallet3Line className="mr-2 text-blue-500" />
                            <span className="font-medium text-gray-700">Wallet Balance</span>
                          </div>
                          <span className="font-bold text-gray-900">
                            ${(depositWalletValue || 0).toFixed(2)}
                          </span>
                        </div>

                        {total > depositWalletValue && (
                          <div className="flex items-start p-3 mt-3 border border-red-200 rounded-lg bg-red-50">
                            <RiErrorWarningLine className="text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-red-700">
                                Insufficient balance
                              </p>
                              <p className="mt-1 text-sm text-red-600">
                                Add ${(total - (depositWalletValue || 0)).toFixed(2)} to your wallet to complete booking
                              </p>
                              <button
                                onClick={() => router.push("/pages/fund-director")}
                                className="px-4 py-2 mt-3 text-sm font-medium text-white transition-colors duration-200 bg-blue-600 rounded-lg hover:bg-blue-700"
                              >
                                Add Fund
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Booking Button */}
                      {!showOtpInput && (
                        <button
                          onClick={handleConfirmBooking}
                          disabled={total > depositWalletValue}
                          className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 ${total > depositWalletValue
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
                            }`}
                        >
                          {total > depositWalletValue ? "Insufficient Balance" : "Confirm Booking"}
                        </button>
                      )}
                    </div>

                    {/* Features Card */}
                    {selectedTicket?.features && (
                      <div className="p-6 border border-indigo-100 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl">
                        <h4 className="mb-3 font-semibold text-gray-900">What&apos;s Included</h4>
                        <ul className="space-y-2">
                          {selectedTicket.features.map((feature, index) => (
                            <li key={index} className="flex items-center text-gray-700">
                              <RiCheckLine className="flex-shrink-0 mr-2 text-green-500" />
                              <span className="text-sm">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Success Confirmation */
            <div className="flex items-center justify-center min-h-screen px-4 py-6 bg-gradient-to-br from-green-50 to-blue-50">
              <div className="w-full max-w-md mx-auto">
                <div className="overflow-hidden bg-white border border-green-100 shadow-lg rounded-2xl">
                  {/* Success Header */}
                  <div className="px-4 py-6 text-center bg-gradient-to-r from-green-500 to-emerald-600">
                    <div className="flex items-center justify-center w-16 h-16 mx-auto mb-3 rounded-full bg-white/20 backdrop-blur-sm">
                      <RiCheckLine className="text-2xl text-white" />
                    </div>
                    <h3 className="mb-1 text-xl font-bold text-white">
                      Congratulations!
                    </h3>
                    <p className="text-sm text-green-100">
                      Your booking has been confirmed successfully.
                    </p>
                  </div>

                  {/* Booking Details */}
                  <div className="px-4 py-6">
                    <div className="p-4 mb-6 border border-green-200 bg-gradient-to-br from-green-50 to-blue-50 rounded-xl">
                      <h4 className="mb-4 text-lg font-bold text-center text-gray-900">Booking Details</h4>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between py-2 border-b border-green-100">
                          <span className="text-sm text-gray-600">Event</span>
                          <span className="text-sm font-semibold text-right text-gray-900">{userEvent?.[0]?.Tittle}</span>
                        </div>

                        <div className="flex items-center justify-between py-2 border-b border-green-100">
                          <span className="text-sm text-gray-600">Date</span>
                          <span className="text-sm font-semibold text-right text-gray-900">
                            {userEvent?.[0]?.EventStartDate} to {userEvent?.[0]?.EndStartDate}
                          </span>
                        </div>

                        <div className="flex items-center justify-between py-2 border-b border-green-100">
                          <span className="text-sm text-gray-600">Session</span>
                          <span className="text-sm font-semibold text-gray-900">{selectedTicket?.type}</span>
                        </div>

                        <div className="flex items-center justify-between py-2 border-b border-green-100">
                          <span className="text-sm text-gray-600">Quantity</span>
                          <span className="text-sm font-semibold text-gray-900">{quantity}</span>
                        </div>

                        <div className="flex items-center justify-between py-2 border-b border-green-100">
                          <span className="text-sm text-gray-600">Total Paid</span>
                          <span className="text-sm font-semibold text-green-600">${total.toFixed(2)}</span>
                        </div>

                        <div className="flex items-center justify-between py-2">
                          <span className="text-sm text-gray-600">Ticket Number</span>
                          <span className="font-mono text-sm font-bold text-blue-600">{ticketNumber}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => router.push("/pages/event-dashboard")}
                      className="w-full px-6 py-3 font-semibold text-white transition-all duration-200 transform rounded-lg shadow-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:scale-105"
                    >
                      Go to Dashboard
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* OTP Modal */}
        <OtpInput
          show={showOtpInput}
          otpValue={otpValue}
          setOtpValue={setOtpValue}
          otpError={otpError}
          onSubmit={handleOtpSubmit}
          accessType={userEvent?.[0]?.AccessType}
          onCancel={() => {
            setShowOtpInput(false);
            setOtpValue("");
            setOtpError("");
          }}
          depositWalletValue={depositWalletValue}
          quantity={quantity}
        />
      </div>
    </div>
  );
}