"use client";
import React, { useState, useEffect } from "react";
import {
  FaWallet,
  FaPlus,
  FaHistory,
  FaSearch,
  FaCalendarCheck,
  FaDownload,
  FaCalendar,
  FaArrowRight,
  FaTicketAlt,
  FaDollarSign,
  FaUsers,
  FaChair,
  FaGlobe, FaMapMarkerAlt, FaLaptopHouse
} from "react-icons/fa";
import Loader from "../../components/Loader";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { getUserDashboardDetails } from "@/app/redux/slices/authSlice";
import { getUserEventBookings } from "@/app/redux/slices/eventSlice";
import { generatePassImage } from "@/app/utils/generatePassImage";
import { getUserId } from "@/app/api/auth";
import { getAllUserEvents } from "@/app/redux/slices/eventSlice";
import { generateInvoice } from "../../components/generateInvoice"

export default function EventDashboard() {
  const dispatch = useDispatch();
  const { getUserDashboardData, loading: apiLoading } = useSelector(
    (state) => state.auth
  );
  const {
    userBookings,
    loading: eventLoading,
    error: eventError,
  } = useSelector((state) => state.event);


  const data = useSelector((state) => state.event.events);
  const userEvents = Array.isArray(data?.userEvent) ? data?.userEvent : [];

  // Filter out events with "Coming Soon" dates
  const validUserEvents = userEvents.filter(event => 
    event.EventStartDate !== "Coming Soon" && event.EndStartDate !== "Coming Soon"
  );

  const [loading, setLoading] = useState(true);

  const depositWallet = getUserDashboardData?.data?.[0]?.DepositWallet || 0;

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(getAllUserEvents());
      const id = getUserId() || "";
      dispatch(getUserDashboardDetails(id));
      dispatch(getUserEventBookings(id));
    };
    fetchData();
  }, [dispatch]);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(t);
  }, []);
  if (loading) return <Loader />;

  return (
    <div className="px-3 py-4 mx-auto max-w-7xl sm:px-4 lg:px-6 sm:py-6">
      {/* Header */}
      <div className="mb-5 mb-10 text-center jsx-1465772458 sm:mb-6">
        <div class="jsx-1465772458 inline-flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-4 py-2 rounded-full border border-blue-200 dark:border-blue-800 mb-6">
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 24 24"
            class="text-blue-600 dark:text-blue-400 text-sm"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12.0006 18.26L4.94715 22.2082L6.52248 14.2799L0.587891 8.7918L8.61493 7.84006L12.0006 0.5L15.3862 7.84006L23.4132 8.7918L17.4787 14.2799L19.054 22.2082L12.0006 18.26Z"></path>
          </svg>
          <span class="jsx-1465772458 text-sm font-semibold text-blue-600 dark:text-blue-400">
            Event Dashboard
          </span>
        </div>
        <h4 class="jsx-1465772458 text-5xl sm:text-5xl lg:text-5xl font-bold mb-4 sm:mb-6 text-gray-800 dark:text-gray-100 leading-tight bg-gradient-to-r from-gray-800 via-blue-600 to-purple-600 dark:from-white dark:via-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
          Manage your bookings and wallet seamlessly
        </h4>
      </div>

      {/* Wallet Section */}
      <div className="relative p-4 mb-6 overflow-hidden text-white shadow-xl bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl sm:p-6 sm:mb-8">
        <div className="absolute top-0 right-0 w-24 h-24 translate-x-12 -translate-y-12 rounded-full sm:w-32 sm:h-32 bg-white/10 sm:-translate-y-16 sm:translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 -translate-x-8 translate-y-8 rounded-full sm:w-24 sm:h-24 bg-white/10 sm:translate-y-12 sm:-translate-x-12"></div>

        <div className="relative z-10 flex flex-col items-center justify-between gap-4 lg:flex-row sm:gap-6">
          <div className="flex items-center">
            <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 mr-3 sm:w-16 sm:h-16 bg-white/20 rounded-xl sm:mr-4 backdrop-blur-sm">
              <FaWallet className="text-xl text-white sm:text-2xl" />
            </div>
            <div className="text-center lg:text-left">
              <h2 className="text-base font-semibold sm:text-lg text-white/90">
                Rentelligence Wallet
              </h2>
              <p className="mt-1 text-2xl font-bold sm:text-3xl">
                ${Number(depositWallet || 0).toFixed(2)}
              </p>
              <p className="mt-1 text-xs text-white/70 sm:text-sm">
                Available Balance
              </p>
            </div>
          </div>

          <div className="flex flex-col w-full gap-2 sm:flex-row sm:gap-3 sm:w-auto">
            <Link
              href="/pages/fund-director"
              className="flex items-center justify-center px-4 py-2 text-sm font-semibold text-white transition-all duration-300 border bg-white/20 hover:bg-white/30 backdrop-blur-sm sm:px-6 sm:py-3 rounded-xl border-white/30 hover:border-white/50 whitespace-nowrap sm:text-base"
            >
              <FaPlus className="flex-shrink-0 mr-2" /> Add Funds
            </Link>
            <button className="flex items-center justify-center px-4 py-2 text-sm font-semibold text-white transition-all duration-300 border bg-white/10 hover:bg-white/20 backdrop-blur-sm sm:px-6 sm:py-3 rounded-xl border-white/20 hover:border-white/40 whitespace-nowrap sm:text-base">
              <FaHistory className="flex-shrink-0 mr-2" /> History
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6 sm:mb-8">
        <div className="p-4 bg-white border border-gray-100 shadow-lg dark:bg-gray-800 rounded-2xl sm:p-6 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-xs text-gray-500 truncate dark:text-gray-400 sm:text-sm">
                Upcoming Events
              </p>
              <p className="mt-1 text-xl font-bold text-gray-800 truncate sm:text-2xl dark:text-gray-100">
                {validUserEvents.length}
              </p>
            </div>
            <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 ml-3 bg-blue-100 rounded-lg sm:w-12 sm:h-12 dark:bg-blue-900 sm:ml-4">
              <FaCalendarCheck className="text-lg text-blue-600 sm:text-xl dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="p-4 bg-white border border-gray-100 shadow-lg dark:bg-gray-800 rounded-2xl sm:p-6 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-xs text-gray-500 truncate dark:text-gray-400 sm:text-sm">
                Bookings
              </p>
              <p className="mt-1 text-xl font-bold text-gray-800 truncate sm:text-2xl dark:text-gray-100">
                {userBookings?.userEvent?.length || 0}
              </p>
            </div>
            <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 ml-3 bg-green-100 rounded-lg sm:w-12 sm:h-12 dark:bg-green-900 sm:ml-4">
              <FaTicketAlt className="text-lg text-green-600 sm:text-xl dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="p-4 bg-white border border-gray-100 shadow-lg dark:bg-gray-800 rounded-2xl sm:p-6 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-xs text-gray-500 truncate dark:text-gray-400 sm:text-sm">
                Total Spent
              </p>
              <p className="mt-1 text-xl font-bold text-gray-800 truncate sm:text-2xl dark:text-gray-100">
                $
                {userBookings?.userEvent
                  ?.reduce(
                    (sum, booking) => sum + (Number(booking.Price) || 0),
                    0
                  )
                  .toFixed(2) || "0.00"}
              </p>
            </div>
            <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 ml-3 bg-purple-100 rounded-lg sm:w-12 sm:h-12 dark:bg-purple-900 sm:ml-4">
              <FaDollarSign className="text-lg text-purple-600 sm:text-xl dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6 sm:mb-8">
        <DashboardCard
          icon={<FaSearch />}
          title="Browse Events"
          desc="Discover and book new events"
          color="from-blue-500 to-blue-600"
          href="/pages/event-booking"
        />

        <DashboardCard
          icon={<FaCalendarCheck />}
          title="My Events"
          desc="Manage your scheduled events"
          color="from-green-500 to-green-600"
        />

        <DashboardCard
          icon={<FaHistory />}
          title="Event History"
          desc="View your past events"
          color="from-purple-500 to-purple-600"
          href="/pages/previous-events"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2 sm:gap-8">
        {/* Upcoming Events - Enhanced Design */}
        <div className="overflow-hidden bg-white border border-gray-100 shadow-lg dark:bg-gray-800 rounded-2xl dark:border-gray-700">
          <div className="p-4 border-b border-gray-100 sm:p-6 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center min-w-0 mt-3 mb-3">
                <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 mr-2 bg-blue-600 rounded-lg sm:w-10 sm:h-10 sm:mr-3">
                  <FaCalendarCheck className="text-sm text-white sm:text-lg" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-lg font-bold text-gray-800 truncate sm:text-xl dark:text-gray-100">
                    Upcoming Events
                  </h2>
                  <p className="text-xs text-gray-600 truncate sm:text-sm dark:text-gray-400">
                    Your scheduled events
                  </p>
                </div>
              </div>
              <span className="flex-shrink-0 px-2 py-1 ml-2 text-xs font-medium text-white bg-blue-600 rounded-full sm:px-3 sm:text-sm whitespace-nowrap">
                {validUserEvents.length} events
              </span>
            </div>
          </div>

          <div className="p-4 sm:p-6">
            {eventLoading ? (
              <div className="py-6 text-center sm:py-8">
                <Loader />
              </div>
            ) : validUserEvents.length > 0 ? (
              <div className="space-y-3 sm:space-y-4">
                {validUserEvents.map((booking, index) => (
                  <UpcomingEventCard key={index} booking={booking} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={
                  <FaCalendar className="text-3xl text-gray-300 sm:text-4xl dark:text-gray-600" />
                }
                title="No upcoming events"
                description="Start exploring events to book your next experience"
                action={
                  <Link
                    href="/pages/event-booking"
                    className="inline-flex items-center px-3 py-2 mt-4 text-sm font-semibold text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 sm:px-4 sm:text-base whitespace-nowrap"
                  >
                    Browse Events{" "}
                    <FaArrowRight className="flex-shrink-0 ml-2 text-xs sm:text-sm" />
                  </Link>
                }
              />
            )}
          </div>
        </div>

        {/* Booking History - Enhanced Design */}
        <div className="overflow-hidden bg-white border border-gray-100 shadow-lg dark:bg-gray-800 rounded-2xl dark:border-gray-700">
          <div className="p-4 border-b border-gray-100 sm:p-6 dark:border-gray-700 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center min-w-0 mt-3 mb-3">
                <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 mr-2 bg-green-600 rounded-lg sm:w-10 sm:h-10 sm:mr-3">
                  <FaHistory className="text-sm text-white sm:text-lg" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-lg font-bold text-gray-800 truncate sm:text-xl dark:text-gray-100">
                    Booking History
                  </h2>
                  <p className="text-xs text-gray-600 truncate sm:text-sm dark:text-gray-400">
                    Your completed bookings
                  </p>
                </div>
              </div>
              <span className="flex-shrink-0 px-2 py-1 ml-2 text-xs font-medium text-white bg-green-600 rounded-full sm:px-3 sm:text-sm whitespace-nowrap">
                {userBookings?.userEvent?.length || 0} bookings
              </span>
            </div>
          </div>

          <div className="p-4 sm:p-6">
            {eventLoading ? (
              <Loader />
            ) : userBookings?.userEvent?.length > 0 ? (
              <div className="space-y-3 sm:space-y-4">
                {userBookings?.userEvent?.map((booking, index) => (
                  <BookingHistoryCard key={index} booking={booking} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={
                  <FaHistory className="text-3xl text-gray-300 sm:text-4xl dark:text-gray-600" />
                }
                title="No booking history"
                description="Your completed bookings will appear here"
                action={
                  <Link
                    href="/pages/event-booking"
                    className="inline-flex items-center px-3 py-2 mt-4 text-sm font-semibold text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700 sm:px-4 sm:text-base whitespace-nowrap"
                  >
                    Find Events{" "}
                    <FaArrowRight className="flex-shrink-0 ml-2 text-xs sm:text-sm" />
                  </Link>
                }
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Enhanced Upcoming Event Card with better responsiveness
function UpcomingEventCard({ booking }) {

  const getEventModeConfig = (mode) => {
    const modeStr = mode?.toLowerCase() || "";
  
    if (modeStr.includes("online")) {
      return {
        style: "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300",
        icon: <FaGlobe className="text-xs" />,
      };
    } 
    else if (modeStr.includes("hybrid")) {
      return {
        style: "bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300", // Purple for Hybrid
        icon: <FaLaptopHouse className="text-xs" />, // Represents Home + Work
      };
    } 
    else {
      // Default to In-Person
      return {
        style: "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300",
        icon: <FaMapMarkerAlt className="text-xs" />,
      };
    }
  };
  const modeConfig = getEventModeConfig(booking.EventMode);

  return (
    <div className="transition-all duration-300 bg-white border border-gray-200 dark:bg-gray-800 rounded-xl dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-md group">
      <div className="p-3 sm:p-4">
        <div className="flex items-start gap-3 sm:gap-4 flexing-wraping">
          {/* Event Image */}
          <div className="relative flex-shrink-0 h-16 overflow-hidden rounded-lg w-28 sm:w-24 sm:h-20 img-border">
            <img
              src={booking.Image || ""}
              alt={booking.Tittle}
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                e.target.src = "/placeholder-event.jpg";
              }}
            />
            <div className="absolute top-1 sm:top-2 left-1 sm:left-2">
              <span className="bg-green-500 text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-semibold whitespace-nowrap">
                Upcoming
              </span>
            </div>
          </div>

          {/* Event Details */}
          <div className="flex-1 min-w-0 mb-3 flexing-wraping ">
            <h3 className="mb-1 text-base font-bold text-gray-800 transition-colors dark:text-gray-100 sm:text-lg sm:mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-2">
              {booking.Tittle}
            </h3>

            <div className="flex flex-col gap-3 mb-2 text-xs text-gray-600 sm:gap-2 sm:text-sm dark:text-gray-300 sm:mb-3">
              <span className="flex items-center min-w-0">
                <FaMapMarkerAlt className="mr-1.5 sm:mr-2 text-blue-500 flex-shrink-0 text-xs sm:text-sm" />
                <span className="truncate">{booking.Location}</span>
              </span>
              <span className="flex items-center min-w-0">

                <FaChair className="mr-1.5 sm:mr-2 text-purple-500 flex-shrink-0 text-xs sm:text-sm" />
                <span className="truncate">{booking.AvailableSeats}</span>
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
              <span
                className={`flex items-center gap-1.5 px-2 sm:px-3 py-1 rounded-md font-medium whitespace-nowrap ${modeConfig.style}`}
              >
                {modeConfig.icon}
                {booking.EventMode}
              </span>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex flex-col items-end flex-shrink-0 gap-2 sm:gap-3">
            <Link
              href={`/pages/event-booking/event/${booking.Id}`}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-1.5 sm:py-2 px-3 sm:px-4 rounded-lg transition-all duration-300 flex items-center group-hover:shadow-lg whitespace-nowrap text-xs sm:text-sm"
            >
              View Details
              <FaArrowRight className="ml-1.5 sm:ml-2 text-xs sm:text-sm flex-shrink-0" />
            </Link>
            {/* <span className="text-xs text-right text-gray-500 dark:text-gray-400 whitespace-nowrap">
              ID: {booking.Id}
            </span> */}
          </div>
        </div>
      </div>
    </div>
  );
}

function BookingHistoryCard({ booking }) {
  const [downloading, setDownloading] = useState(false);

  const handleDownloadInvoice = async () => {
    setDownloading(true);
    try {
      await generateInvoice({
        eventTitle: booking.Tittle,
        eventDate: booking.EventDateTime,
        eventLocation: booking.Location,
        bookingId: booking.TicketNumber,
        customerName: booking.Name,
        quantity: booking.SeatsBooked,
        total: booking.Price,
        seatBooked: booking.SeatsBooked,
        eventType: booking.EventType,
        eventMode: booking.EventMode,
        image: booking.Image
      });
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download invoice. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="transition-all duration-300 bg-white border border-gray-200 dark:bg-gray-800 rounded-xl dark:border-gray-700 hover:border-green-300 dark:hover:border-green-500 hover:shadow-md group">
      <div className="p-3 sm:p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
          {/* Event Image and Basic Info */}
          <div className="flex items-start gap-2 flexing-wraping">
            {/* Event Image */}
            <div className="relative flex-shrink-0 w-20 h-16 overflow-hidden rounded-lg sm:w-20 sm:h-16 img-border">
              <img
                src={booking.Image || ""}
                alt={booking.Tittle}
                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  e.target.src = "/placeholder-event.jpg";
                }}
              />
            </div>

            {/* Booking Details */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col gap-1 mb-2 sm:flex-row sm:items-start sm:justify-between sm:mb-3 sm:gap-2">
                <h3 className="text-base font-bold text-gray-800 transition-colors dark:text-gray-100 sm:text-lg group-hover:text-green-600 dark:group-hover:text-green-400 line-clamp-2">
                  {booking.Tittle}
                </h3>
                <span className="flex-shrink-0 order-first px-2 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-full dark:bg-green-900 dark:text-green-300 sm:px-3 sm:text-sm whitespace-nowrap sm:order-last">
                  ${Number(booking.Price || 0).toFixed(2)}
                </span>
              </div>

              <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-2 sm:mb-3">
                <div className="flex items-center min-w-0 mt-3 mb-3">
                  <FaTicketAlt className="flex-shrink-0 mr-2 text-xs text-green-500 sm:mr-3 sm:text-sm" />
                  <span className="truncate">
                    Ticket #: {booking.TicketNumber}
                  </span>
                </div>
                <div className="flex items-center min-w-0 mt-3 mb-3">
                  <FaUsers className="flex-shrink-0 mr-2 text-xs text-blue-500 sm:mr-3 sm:text-sm" />
                  <span className="whitespace-nowrap">
                    {booking.SeatsBooked} ticket
                    {booking.SeatsBooked > 1 ? "s" : ""}
                  </span>
                </div>
                <div className="flex items-center min-w-0 mt-3 mb-3">
                  <FaMapMarkerAlt className="flex-shrink-0 mr-2 text-xs text-red-500 sm:mr-3 sm:text-sm" />
                  <span className="truncate">{booking.Location}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                <span className="px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-md dark:bg-gray-700 dark:text-gray-300 sm:px-3 whitespace-nowrap">
                  {booking.EventMode}
                </span>
                <span className="px-2 py-1 text-xs font-medium text-purple-700 bg-purple-100 rounded-md dark:bg-purple-900 dark:text-purple-300 sm:px-3 whitespace-prewrap">
                  {booking.EventType}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Download Button and Date - Stack on mobile, side by side on larger screens */}
        <div className="flex flex-row items-center justify-between flex-shrink-0 gap-2 mt-3 sm:flex-col sm:items-end sm:gap-3">
          <button
            onClick={handleDownloadInvoice}
            disabled={downloading}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-1.5 sm:py-2 px-3 sm:px-4 rounded-lg transition-all duration-300 flex items-center group-hover:shadow-lg whitespace-nowrap text-xs sm:text-sm flex-1 sm:flex-none justify-center disabled:cursor-not-allowed"
          >
            {downloading ? (
              <>
                <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-white mr-1.5 sm:mr-2"></div>
                Downloading...
              </>
            ) : (
              <>
                <FaDownload className="mr-1.5 sm:mr-2 flex-shrink-0 text-xs sm:text-sm" />
                Download Invoice
              </>
            )}
          </button>
          <span className="flex-shrink-0 text-xs text-right text-gray-500 dark:text-gray-400 whitespace-nowrap">
            Booked on
            <br />
            <span className="truncate block max-w-[120px] sm:max-w-none">
              {booking.EventDateTime}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}

// Dashboard Card Component
function DashboardCard({ icon, title, desc, color, href }) {
  const cardContent = (
    <div className="p-4 transition-all duration-300 bg-white border border-gray-100 shadow-lg cursor-pointer dark:bg-gray-800 rounded-2xl sm:p-6 dark:border-gray-700 hover:shadow-xl group hover:border-blue-200 dark:hover:border-blue-500">
      <div
        className={`w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r ${color} rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}
      >
        {React.cloneElement(icon, {
          className: "text-xl sm:text-2xl text-white",
        })}
      </div>

      <h3 className="mb-2 text-base font-semibold text-gray-800 transition-colors sm:text-lg dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-2">
        {title}
      </h3>

      <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-300 sm:text-sm line-clamp-2">
        {desc}
      </p>

      <div className="flex items-center mt-3 text-blue-600 transition-opacity duration-300 opacity-0 sm:mt-4 dark:text-blue-400 group-hover:opacity-100 whitespace-nowrap">
        <span className="text-xs font-medium sm:text-sm">Explore</span>
        <FaArrowRight className="ml-1.5 sm:ml-2 text-xs flex-shrink-0" />
      </div>
    </div>
  );

  return href ? <Link href={href}>{cardContent}</Link> : cardContent;
}

// Empty State Component
function EmptyState({ icon, title, description, action }) {
  return (
    <div className="py-8 text-center sm:py-12">
      <div className="flex justify-center mx-auto mb-3 sm:mb-4 item-center">{icon}</div>
      <p className="mb-2 text-base font-semibold text-gray-500 dark:text-gray-400 sm:text-lg">
        {title}
      </p>
      <p className="max-w-sm px-2 mx-auto text-xs text-gray-400 dark:text-gray-500 sm:text-sm line-clamp-2">
        {description}
      </p>
      {action}
    </div>
  );
}