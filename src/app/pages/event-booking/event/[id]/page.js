
"use client";
import { use, useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import {
    RiArrowLeftLine,
    RiArrowRightLine,
    RiCheckLine,
    RiTimeLine,
    RiMapLine,
    RiTicket2Line,
} from "react-icons/ri";

import { getTransferIncomeToDepositWalletReport } from "@/app/redux/slices/fundManagerSlice";
import { getUserId } from "@/app/api/auth";
import { getEventById, getEventSchedule } from "@/app/redux/slices/eventSlice";
import { event } from "@/app/constants/constant";
import Loader from "@/app/components/Loader";

export default function EventDetail({ params }) {
    const { id } = use(params);
    const [selectedTicketIndex, setSelectedTicketIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [showPopup, setShowPopup] = useState(false);
    const [ticketNumber, setTicketNumber] = useState(null);
    const [selectedWallet, setSelectedWallet] = useState("Deposit Wallet");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    

    // New state: force input count after successful user verification
    const [forceInputCount, setForceInputCount] = useState(null);

    const [assignedUsers, setAssignedUsers] = useState(['']);

    /* Removed auto assignment of first ticket to currentUser; always allow manual input */
    const [userVerificationStatus, setUserVerificationStatus] = useState([]); // array of 'idle' | 'verifying' | 'success' | 'error'
    const [userVerificationError, setUserVerificationError] = useState([]); // array of error messages

    // Helper function to verify user existence by username (simulate API call)
    const verifySingleUser = async (username, index) => {
        if (!username.trim()) {
            updateVerificationStatus(index, 'error', 'Username cannot be empty');
            return;
        }
        updateVerificationStatus(index, 'verifying', '');
        try {
            // Simulate API delay
            await new Promise((resolve) => setTimeout(resolve, 800));
            if (username.trim().length > 2) {
                updateVerificationStatus(index, 'success', '');
                // If last input and total inputs < quantity, add new empty input automatically
                if (index === assignedUsers.length - 1 && assignedUsers.length < quantity) {
                    setAssignedUsers([...assignedUsers, '']);
                    setUserVerificationStatus([...userVerificationStatus, 'idle']);
                    setUserVerificationError([...userVerificationError, '']);
                }
                // New behavior: when any username verified successfully, force 3 input fields
                setForceInputCount(3);
            } else {
                throw new Error('User not found');
            }
        } catch (err) {
            updateVerificationStatus(index, 'error', err.message || 'User not found');
        }
    }

    const updateVerificationStatus = (index, status, errorMsg) => {
        const statusArray = [...userVerificationStatus];
        const errorArray = [...userVerificationError];
        statusArray[index] = status;
        errorArray[index] = errorMsg;
        setUserVerificationStatus(statusArray);
        setUserVerificationError(errorArray);
    }

    const handleAssignedUserChange = (index, value) => {
        const users = [...assignedUsers];
        users[index] = value;
        setAssignedUsers(users);
        // Reset verification status for this input when user changes
        const statusArray = [...userVerificationStatus];
        const errorArray = [...userVerificationError];
        statusArray[index] = 'idle';
        errorArray[index] = '';
        setUserVerificationStatus(statusArray);
        setUserVerificationError(errorArray);

        // Reset forced input count if user edits an assignedUser (except when input is empty)
        if (forceInputCount !== null && !value.trim()) {
            setForceInputCount(null);
        }

        // Debounced verification after typing
        if (value.trim()) {
            if (verifyTimeouts[index]) clearTimeout(verifyTimeouts[index]);
            verifyTimeouts[index] = setTimeout(() => verifySingleUser(value, index), 500);
        }
    }

    let verifyTimeouts = [];

    const dispatch = useDispatch();
    const dropdownRef = useRef(null);
    const router = useRouter();

    const { selectedEvent, schedule, loading } = useSelector((state) => state.event);

    const userEvent = selectedEvent?.userEvent
    const tickets = (userEvent && userEvent[0]) ? [
        userEvent[0]?.SessionsTime ? {
            type: userEvent[0].SessionsTime,
            price: userEvent[0].EventPrice,
            seats: `${userEvent[0].SessionSeats || ''} available`,
            features: ["All sessions access", "Digital materials", "Lunch included", "Certificate"]
        } : null,

        userEvent[0]?.SessionsTimeOne ? {
            type: userEvent[0].SessionsTimeOne,
            price: userEvent[0].EventPrice,
            seats: `${userEvent[0].AvailableOneSeats || ''} available`,
            features: ["All VIP features", "One-on-one speaker sessions", "Premium gift package", "Priority support", "Future event discounts"]
        } : null,

        userEvent[0]?.SessionsTimeTwo ? {
            type: userEvent[0].SessionsTimeTwo,
            price: userEvent[0].EventPrice,
            seats: `${userEvent[0].AvailableTwoSeats || ''} available`,
            features: ["All Standard features", "VIP seating", "Meet & greet with speakers", "Premium lunch", "Exclusive networking"]
        } : null
    ].filter(Boolean) : [];
    const selectedTicket = tickets[selectedTicketIndex] || null;
    const subtotal = selectedTicket ? selectedTicket.price * quantity : 0;
    const total = subtotal;

    useEffect(() => {
        const URID = getUserId();
        dispatch(getTransferIncomeToDepositWalletReport(URID));
        dispatch(getEventById(id));
    }, [dispatch, id]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (userEvent?.[0]?.EventMasterID) {
            dispatch(getEventSchedule(userEvent[0].EventMasterID));
        }
    }, [userEvent, dispatch]);


    const handleBookNow = async () => {
        router.push(`/pages/event-booking/checkout?eventId=${id}&ticketIndex=${selectedTicketIndex}&quantity=${quantity}`);
    };


    if (loading) {
        return <Loader />;
    }

    return (
        <div className="px-6 py-12 mx-auto max-w-7xl">
            <div className="flex flex-col items-start justify-between gap-4 mb-6 sm:flex-row sm:items-center sm:gap-0">
                <Link
                    href="/pages/event-booking"
                    className="inline-flex items-center font-semibold text-blue-600 transition-colors hover:text-blue-800"
                >
                    <RiArrowLeftLine className="mr-2" />
                    Back to Events
                </Link>


            </div>

            <div className="grid gap-12 lg:grid-cols-3">
                <div className="space-y-8 lg:col-span-2">
                    <div className="relative overflow-hidden rounded-2xl">
                        <img
                            alt={userEvent?.[0]?.Title || "Event"}
                            className="object-cover object-top w-full h-64"
                            src={userEvent?.[0]?.Image || ""}
                        />
                        <div className="absolute top-4 left-4">
                            <span className="flex items-center px-4 py-2 font-medium text-white bg-indigo-600 rounded-full">
                                <RiArrowRightLine className="mr-2 ri-building-line" />
                                {userEvent?.[0].EventMode}
                            </span>
                        </div>
                    </div>
                    <div className="p-8 bg-white border border-gray-200 shadow-lg rounded-2xl">
                        <h1 className="mb-6 text-4xl font-bold text-gray-800">{userEvent?.[0]?.Title || "Event Title"}</h1>
                        <div className="grid gap-6 mb-8 md:grid-cols-2">
                            <div className="space-y-4">
                                <div className="flex items-center text-gray-700">
                                    <RiArrowRightLine className="mr-3 text-xl text-blue-600 ri-calendar-line" />
                                    <div>
                                        <p className="font-semibold text-gray-800">Date </p>
                                        <p className="text-gray-700">{userEvent?.[0]?.EventStartDate}{" "}to{" "}{userEvent?.[0]?.EndStartDate}</p>
                                        {/* <p className="text-gray-700">{selectedEvent?.time || "Time"}</p> */}
                                    </div>
                                </div>
                                <div className="flex items-center text-gray-700">
                                    <RiArrowRightLine className="mr-3 text-xl text-blue-600 ri-map-pin-line" />
                                    <div>
                                        <p className="font-semibold text-gray-800">Location</p>
                                        <p className="text-gray-700">{userEvent?.[0]?.Location || "Location"}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center text-gray-700">
                                    <RiArrowRightLine className="mr-3 text-xl text-blue-600 ri-user-line" />
                                    <div>
                                        <p className="font-semibold text-gray-800">Organizer</p>
                                        <p className="text-gray-700">{userEvent?.[0]?.EventType || "Organizer"}</p>
                                    </div>
                                </div>
                                <div className="flex items-center text-gray-700">
                                    <RiArrowRightLine className="mr-3 text-xl text-blue-600 ri-group-line" />
                                    <div>
                                        <p className="font-semibold text-gray-800">Availability</p>
                                        <p className="text-gray-700">
                                            {userEvent?.[0].AvailableSeats}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mb-8">
                            <h3 className="mb-4 text-xl font-bold text-gray-800">About This Event</h3>
                            <p className="leading-relaxed text-gray-700">{userEvent?.[0]?.Description || "Description"}</p>
                        </div>
                        <div className="mb-8">
                            <h3 className="mb-4 text-xl font-bold text-gray-800">Event Features</h3>
                            <div className="grid gap-3 md:grid-cols-2">
                                {event.features.map((feature, index) => (
                                    <div key={index} className="flex items-center text-gray-700">
                                        <RiCheckLine className="mr-3 text-green-600" />
                                        {feature}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="p-8 bg-white border border-gray-200 shadow-lg rounded-2xl">
                        <h3 className="flex items-center mb-6 text-xl font-bold text-gray-800">
                            <RiTimeLine className="mr-3 text-blue-600" />
                            Event Schedule
                        </h3>

                        <div className="space-y-4">
                            {Array.isArray(schedule?.userEvent) && schedule?.userEvent?.length > 0 ? (
                                schedule.userEvent.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center bg-gray-50 rounded-xl sm:gap-2"
                                    >
                                        <div className="w-full font-semibold text-blue-600 sm:w-20">
                                            {item.Time}
                                        </div>
                                        <div className="text-gray-800">
                                            {item.Title}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center dark:text-gray-600">
                                    No schedule available
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="p-8 bg-white border border-gray-200 shadow-lg rounded-2xl">
                        <h3 className="flex items-center mb-6 text-xl font-bold text-gray-800">
                            <RiMapLine className="mr-3 text-blue-600" />
                            Venue Location
                        </h3>
                        <div className="flex items-center justify-center h-64 p-4 bg-gray-100 rounded-xl">
                            <iframe
                                src={`https://maps.google.com/maps?q=${encodeURIComponent(userEvent?.[0]?.Location || 'New York')}&ie=UTF8&iwloc=&output=embed`}
                                width="100%"
                                height="100%"
                                style={{ border: 0, borderRadius: "8px" }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </div>
                    </div>
                </div>
                <div className="lg:col-span-1">
                    <div className="sticky p-8 bg-white border border-gray-200 shadow-lg rounded-2xl top-8">
                        <h3 className="mb-6 text-2xl font-bold text-gray-800">Book Your Tickets</h3>
                        <div className="mb-6 space-y-4">
                            {tickets?.map((ticket, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all text-left w-full ${selectedTicketIndex === index
                                        ? "border-blue-500 bg-blue-50"
                                        : "border-gray-200 bg-white hover:border-blue-300"
                                        }`}
                                    onClick={() => setSelectedTicketIndex(index)}
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <h4 className="font-bold text-gray-800">{ticket.type}</h4>
                                        <span className="text-2xl font-bold text-blue-600">${ticket.price}</span>
                                    </div>
                                    <p className="mb-2 text-sm text-gray-600">{ticket.seats}</p>
                                    <ul className="space-y-1 text-sm text-gray-700">
                                        {ticket.features?.map((feature, idx) => (
                                            <li key={idx} className="flex items-center">
                                                <RiCheckLine className="mr-2 text-xs text-green-600" />
                                                {feature}
                                            </li>
                                        )) || <li>No features</li>}
                                    </ul>
                                </button>
                            )) || <p>No tickets available</p>}
                        </div>
                        <>
                            <button
                                onClick={handleBookNow}
                                className="flex items-center justify-center w-full py-4 text-lg font-semibold text-white transition-all rounded-xl whitespace-nowrap th-btn style2 hover:scale-105"
                                disabled={loading}
                            >
                                <RiTicket2Line className="mr-2" />
                                {loading ? 'Processing...' : 'CheckOut'}
                            </button>
                        </>
                    </div>
                </div>
            </div>


            {/* Booking Confirmation Popup */}
            {showPopup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="w-full max-w-md p-8 mx-4 bg-white rounded-2xl">
                        <div className="mb-6 text-center">
                            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full">
                                <RiCheckLine className="text-3xl text-green-600" />
                            </div>
                            <h3 className="mb-2 text-2xl font-bold text-gray-800">Congratulations!</h3>
                            <p className="text-gray-600">Your booking has been confirmed</p>
                        </div>
                        <div className="p-6 mb-6 bg-gray-50 rounded-xl">
                            <h4 className="mb-4 font-bold text-gray-800">Booking Details</h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Event:</span>
                                    <span className="font-semibold text-gray-800">{userEvent?.[0]?.Tittle || "Event"}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Date </span>
                                    <span className="text-gray-800">{userEvent?.[0]?.EventStartDate}{" "}to{" "}{userEvent?.[0]?.EndStartDate}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Session Time:</span>
                                    <span className="text-gray-800">{selectedTicket?.type || "Type"}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Quantity:</span>
                                    <span className="text-gray-800">{quantity}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Total:</span>
                                    <span className="font-bold text-gray-800">${total.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Ticket Number:</span>
                                    <span className="font-mono text-gray-800">{ticketNumber}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => router.push("/pages/event-dashboard")}
                                className="flex-1 py-3 pl-4 font-semibold text-white transition-colors rounded-lg th-btn style2 whitespace-nowrap"
                            >
                                Go to Dashboard
                            </button>
                            <button
                                onClick={() => setShowPopup(false)}
                                className="flex-1 py-3 font-semibold text-gray-700 transition-colors bg-gray-200 rounded-lg hover:bg-gray-300 whitespace-nowrap"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

