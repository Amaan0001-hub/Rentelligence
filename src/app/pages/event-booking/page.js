"use client"
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import {
    RiArrowRightLine,
    RiSearchLine,
    RiDashboardLine,
    RiCheckboxCircleLine,
    RiStarFill,
    RiGroupLine,
    RiGlobalLine,
    RiBuildingLine,
    RiCalendarLine,
    RiMapPinLine,
    RiUserLine,
    RiTicket2Line,
    RiCalendarTodoLine
} from "react-icons/ri";
import { aiFeatures, pastEvents } from "@/app/constants/constant";
import { useDispatch, useSelector } from "react-redux";
import { getAllUserEvents } from "@/app/redux/slices/eventSlice";
import { getRechargeTransactBYTId } from "@/app/redux/slices/walletReportSlice";
import { getUserId } from "@/app/api/auth";
import { PanelBottom } from "lucide-react";

export default function EventBooking() {
    const [selectedFilter, setSelectedFilter] = useState("all");
    const [showAllEvents, setShowAllEvents] = useState(false);
    const dispatch = useDispatch();

    const data = useSelector((state) => state.event.events);
    const userEvents = Array.isArray(data?.userEvent) ? data?.userEvent : [];
    console.log("test-->",userEvents);

    const onlineCount = userEvents.filter(event => event.EventMode === 'Online Event').length;
    const venueCount = userEvents.filter(event => event.EventMode === 'Offline Event').length;
    const hybridCount = userEvents.filter(event => event.EventMode === 'Hybrid Event').length;

    const eventCategories = [
        {
            id: 1,
            title: "Online Events",
            description: "Virtual conferences, webinars, and digital experiences",
            eventsCount: `${onlineCount}+ Events`,
            icon: <RiGlobalLine className="text-3xl text-white" />,
            gradient: "from-blue-500 to-cyan-500",
        },
        {
            id: 2,
            title: "Venue Events",
            description: "In-person conferences, workshops, and networking events",
            eventsCount: `${venueCount}+ Events`,
            icon: <RiBuildingLine className="text-3xl text-white" />,
            gradient: "from-purple-500 to-indigo-500",
        },
        {
            id: 3,
            title: "Hybrid Events",
            description: "Combined virtual and in-person experiences for flexible participation",
            eventsCount: `${hybridCount}+ Events`,
            icon: <RiGroupLine className="text-3xl text-white" />,
            gradient: "from-green-500 to-emerald-500",
        },
    ];

    useEffect(() => {
        dispatch(getAllUserEvents())
    }, [])

    useEffect(() => {
        const urid = getUserId();
        dispatch(getRechargeTransactBYTId(urid));
    }, [dispatch]);

    const getFilteredEvents = () => {
        if (selectedFilter === "all") {
            return [...userEvents];
        } else if (selectedFilter === "upcoming") {
            return userEvents.filter(event => !isEventPast(event));
        } else if (selectedFilter === "past") {
            return pastEvents;
        }
        return [...userEvents,];
    };
    console.log("tetwtt111",getFilteredEvents);

    const parseDate = (dateString) => {
        if (!dateString || typeof dateString !== 'string') return null;
        const regex = /^(\w{3}) (\d{1,2}), (\d{4}) at (\d{1,2}):(\d{2}) (AM|PM)$/;
        const match = dateString.match(regex);
        if (!match) return null;

        const [, monthStr, day, year, hour, minute, ampm] = match;
        const months = {
            Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
            Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
        };
        const month = months[monthStr];
        let hour24 = parseInt(hour, 10);
        if (ampm === 'PM' && hour24 !== 12) hour24 += 12;
        if (ampm === 'AM' && hour24 === 12) hour24 = 0;

        return new Date(parseInt(year, 10), month, parseInt(day, 10), hour24, parseInt(minute, 10));
    };

    const isEventPast = (event) => {
        const eventDate = parseDate(event.EventDateTime);
        if (!eventDate) return false;
        return eventDate < new Date();
    };

    const images = [
        "https://imagedelivery.net/nq9qT5FHZv9Sg48UUnD1-A/b3c6a5fc-6d9c-4313-f6b2-bf598972f800/public",
        "https://imagedelivery.net/nq9qT5FHZv9Sg48UUnD1-A/2b923b46-a7b8-4ff5-a519-688195dd1000/public",
        "https://imagedelivery.net/nq9qT5FHZv9Sg48UUnD1-A/6f538747-3972-4e66-f839-ea9a580bd200/public",
        "https://imagedelivery.net/nq9qT5FHZv9Sg48UUnD1-A/ad72d20a-aa20-4293-7745-b6d2d44f0a00/public",
        "https://imagedelivery.net/nq9qT5FHZv9Sg48UUnD1-A/bbcd621b-5ed9-4c6c-7e50-fb74cf852200/public",
        "https://imagedelivery.net/nq9qT5FHZv9Sg48UUnD1-A/e80112c5-674c-44ab-cb38-1dd681c9e100/public",
    ];

    // Create infinite scroll by duplicating the images array multiple times
    const list = [...images, ...images, ...images, ...images, ...images, ...images];
    const IMAGE_WIDTH = 180;
    const IMAGE_HEIGHT = 100;
    const IMAGE_GAP = 20;

    return (
        <>
            {/* Event Booking Ui  */}
            <section className="relative bg-white-to-br from-gray-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 pt-4 pb-8 border-b border-[#d3d3d3]">

                {/* Animated Background */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute rounded-full -top-40 -right-32 w-80 h-80 bg-blue-400/10 blur-3xl"></div>
                    <div className="absolute rounded-full -bottom-40 -left-32 w-80 h-80 bg-purple-400/10 blur-3xl"></div>
                </div>

                {/* Infinite Scroll Logo Slider */}
                <div className="flex justify-center w-full">
                    <div className="w-full max-w-7xl">
                        {/* First Row - Infinite Scroll */}
                        <div className="logo-carousel h-[120px] overflow-hidden w-full flex items-center relative mb-4">
                            <div
                                className="flex logo-track"
                                style={{
                                    width: `${(IMAGE_WIDTH + IMAGE_GAP) * list.length}px`,
                                    animation: 'infiniteScroll 40s linear infinite'
                                }}
                            >
                                {list.map((src, i) => (
                                    <div
                                        key={i}
                                        className="flex-shrink-0 overflow-hidden transition-all duration-300 border-2 shadow-lg logo-item rounded-2xl border-white/30 hover:border-blue-400/60 hover:scale-105 backdrop-blur-sm"
                                        style={{
                                            width: IMAGE_WIDTH,
                                            height: IMAGE_HEIGHT,
                                            marginRight: IMAGE_GAP,
                                        }}
                                    >
                                        <img src={src} alt="" className="object-cover w-full h-full" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative px-4 pt-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="text-center sm:mb-6">
                        {/* Enhanced Header with Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 border border-blue-200 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm dark:border-blue-800">
                            <RiStarFill className="text-sm text-blue-600 dark:text-blue-400" />
                            <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                                AI-Powered Platform
                            </span>
                        </div>

                        <h2 className="mb-4 text-4xl font-bold leading-tight text-transparent text-gray-800 sm:text-5xl lg:text-6xl sm:mb-6 dark:text-gray-100 bg-gradient-to-r from-gray-800 via-blue-600 to-purple-600 dark:from-white dark:via-blue-400 dark:to-purple-400 bg-clip-text">
                            AI-Powered Event Booking
                        </h2>

                        <p className="max-w-3xl mx-auto mb-6 text-lg leading-relaxed text-gray-600 sm:text-xl lg:text-xl dark:text-gray-300 sm:mb-8">
                            Discover, book, and manage your event tickets with intelligent
                            recommendations and seamless wallet integration
                        </p>

                        {/* Enhanced Buttons */}
                        <div className="flex flex-col items-center justify-center w-full gap-4 sm:flex-row">
                            <button
                                onClick={() =>
                                    document
                                        .getElementById('featured-events')
                                        .scrollIntoView({ behavior: 'smooth' })
                                }
                                className="group relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white w-full sm:w-auto max-w-[240px] px-6 sm:px-8 py-3 sm:py-4 text-lg font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl whitespace-nowrap flex items-center justify-center overflow-hidden"
                            >
                                <div className="absolute inset-0 transition-transform duration-1000 transform -translate-x-full -skew-x-12 bg-white/20 group-hover:translate-x-full"></div>
                                <RiSearchLine className="relative z-10 mr-2" />
                                <span className="relative z-10">Browse Events</span>
                            </button>

                            <Link href="/pages/event-dashboard" className="w-full sm:w-auto max-w-[240px] group">
                                <button className="flex items-center justify-center w-full px-6 py-3 text-lg font-semibold text-blue-600 transition-all duration-300 transform border-2 border-blue-200 shadow-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 sm:px-8 sm:py-4 rounded-xl hover:scale-105 hover:shadow-xl whitespace-nowrap">
                                    <RiDashboardLine className="mr-2 transition-transform group-hover:scale-110" />
                                    My Dashboard
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Add CSS for infinite scroll animation */}
                <style jsx>{`
                    @keyframes infiniteScroll {
                        0% {
                            transform: translateX(0);
                        }
                        100% {
                            transform: translateX(calc(-${IMAGE_WIDTH + IMAGE_GAP}px * ${images.length}));
                        }
                    }
                    @keyframes infiniteScrollReverse {
                        0% {
                            transform: translateX(calc(-${IMAGE_WIDTH + IMAGE_GAP}px * ${images.length}));
                        }
                        100% {
                            transform: translateX(0);
                        }
                    }
                `}</style>
            </section>

            {/* Event Categories  */}
            <section className="pt-8 pb-8 bg-white dark:bg-gray-900 border-b border-[#d3d3d3]">
                <div className="px-6 mx-auto max-w-7xl">
                    <div className="mb-12 text-center">
                        <div class="jsx-1465772458 inline-flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-4 py-2 rounded-full border border-blue-200 dark:border-blue-800 mb-6"><svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" class="text-blue-600 dark:text-blue-400 text-sm" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M12.0006 18.26L4.94715 22.2082L6.52248 14.2799L0.587891 8.7918L8.61493 7.84006L12.0006 0.5L15.3862 7.84006L23.4132 8.7918L17.4787 14.2799L19.054 22.2082L12.0006 18.26Z"></path></svg><span class="jsx-1465772458 text-sm font-semibold text-blue-600 dark:text-blue-400">
                            Event Categories</span></div>
                        <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
                            Choose from our diverse range of events, whether you prefer virtual experiences or in-person networking
                        </p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-3">
                        {eventCategories.map((category, index) => (
                            <div key={index}
                                className="p-8 transition-all duration-300 bg-white border border-gray-100 shadow-lg cursor-pointer dark:bg-gray-800 rounded-2xl hover:shadow-xl group dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-500 hover:transform hover:scale-105">
                                <div className="flex items-start space-x-6">
                                    <div
                                        className={`w-16 h-16 bg-gradient-to-r ${category.gradient} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`} >
                                        {category.icon}
                                    </div>

                                    <div className="flex-1">
                                        <h3 className="mb-2 text-xl font-bold text-gray-800 transition-colors dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                                            {category.title}
                                        </h3>
                                        <p className="mb-4 text-gray-600 dark:text-gray-300">{category.description}</p>

                                    </div>
                                </div>
                                <div className="flex items-center justify-between mt-4 bottom-text">
                                    <span className="font-semibold text-blue-600 dark:text-blue-400">{category.eventsCount}</span>
                                    <RiArrowRightLine className="text-blue-600 transition-transform dark:text-blue-400 group-hover:translate-x-1" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Events  */}
            <section id="featured-events" className="pb-8 pt-8 dark:bg-white-900 bg-white-50 border-b border-[#d3d3d3]">
                <div className="px-6 mx-auto max-w-7xl">
                    <div className="mb-12 ">
                        <div className="mb-12 text-center">
                            <div class="jsx-1465772458 inline-flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-4 py-2 rounded-full border border-blue-200 dark:border-blue-800 mb-6"><svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" class="text-blue-600 dark:text-blue-400 text-sm" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M12.0006 18.26L4.94715 22.2082L6.52248 14.2799L0.587891 8.7918L8.61493 7.84006L12.0006 0.5L15.3862 7.84006L23.4132 8.7918L17.4787 14.2799L19.054 22.2082L12.0006 18.26Z"></path></svg>
                                <span class="jsx-1465772458 text-sm font-semibold text-blue-600 dark:text-blue-400">Events</span></div>

                            <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
                                Discover Online, Venue, and Hybrid events
                            </p>
                        </div>

                        {/* View All Events Button */}
                        {getFilteredEvents().length > 3 && (
                            <div className="mt-8 text-center md:mt-0">
                                <button
                                    onClick={() => setShowAllEvents(!showAllEvents)}
                                    className="flex items-center px-8 py-4 mx-auto text-lg font-semibold text-white transition-all duration-300 transform shadow-lg th-btn style2 rounded-xl hover:scale-105 whitespace-nowrap bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                                >
                                    {showAllEvents ? "Show Less Events" : "View All Events"}
                                </button>
                            </div>
                        )}
                    </div>
                    {/* <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 ">
                        {userEvents.length > 0 ? userEvents.slice(0, showAllEvents ? userEvents.length : 3).map((event, index) => (
                            <div
                                key={index}
                                className="overflow-hidden transition-all duration-300 bg-white border shadow-lg dark:bg-gray-800 rounded-2xl dark:border-slate-700 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 group hover:shadow-2xl hover:transform hover:scale-105"
                            >
                                <div className="relative">
                                    <img
                                        src={event.Image}
                                        alt={event.Title}
                                        className="object-cover object-top w-full h-48 transition-transform duration-300 group-hover:scale-110"
                                    />
                                    <div className="absolute top-4 left-4">
                                        <span className="flex items-center px-4 py-2 font-medium text-white border rounded-full bg-blue-600/90 backdrop-blur-sm border-white/20">
                                            <RiArrowRightLine className="mr-2 ri-building-line" />
                                            {event.EventMode}
                                        </span>
                                    </div>

                                    {event.featured && (
                                        <div className="absolute top-4 right-4">
                                            <span className="flex items-center px-3 py-1 text-sm font-medium text-white border rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 backdrop-blur-sm border-yellow-300/20">
                                                <RiStarFill className="mr-1" />
                                                Featured
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div className="p-6">
                                    <h6 className="mb-3 font-bold text-gray-700 transition-colors text-md dark:text-white line-clamp-1 group-hover:text-blue-400 dark:group-hover:text-blue-300 card-heading">
                                        {event.Tittle}
                                    </h6>

                                    <div className="mb-4 space-y-2 text-slate-400 ">
                                        <div className="flex items-center">
                                            <RiCalendarLine className="mr-2 text-blue-400 dark:text-white" />
                                            <span className="text-gray-600 dark:text-white">{event.EventStartDate}{" "}to{" "}{event.EndStartDate}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <RiMapPinLine className="mr-2 text-blue-400 dark:text-white" />
                                            <span className="text-gray-600 truncate dark:text-white">{event.Location}</span>
                                        </div>


                                        <div className="flex items-center"><RiUserLine className="mr-2 text-blue-400 dark:text-white" /><span className="block overflow-hidden text-gray-600 dark:text-white line-clamp-1 text-ellipsis">
                                            {event.EventType}
                                        </span>

                                        </div>

                                        <div className="flex items-center">
                                            <RiCheckboxCircleLine className="mr-2 text-green-500 dark:text-white" />
                                            <span className="text-gray-600 truncate dark:text-white">
                                                {event.AccessType}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between mb-4">
                                        <div className="text-2xl font-bold text-white dark:text-gray-100"></div>
                                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                            AvailableSeats : <span className="ml-1 font-semibold text-gray-700 dark:text-gray-300">{event.AvailableSeats}</span>
                                        </div>
                                    </div>

                                    <Link
                                        href={`/pages/event-booking/event/${event.Id}`}
                                        className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center ${(parseInt(event.AvailableSeats, 10) <= 0 || isEventPast(event)) ? "bg-gray-500 cursor-not-allowed" : "th-btn style2 text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"} shadow-lg hover:shadow-xl`}
                                        onClick={(e) => (parseInt(event.AvailableSeats, 10) <= 0 || isEventPast(event)) && e.preventDefault()}
                                    >
                                        <RiTicket2Line className="mr-2" /> {(parseInt(event.AvailableSeats, 10) <= 0 || isEventPast(event)) ? (isEventPast(event) ? "Event Passed" : "Seats not available") : "Book Now"}
                                    </Link>
                                </div>
                            </div>
                        )) : (<div className="text-center col-span-full">
                            <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-gray-100 rounded-full dark:bg-gray-800">
                                <RiCalendarTodoLine className="text-2xl text-gray-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">No Events Available</h3>
                        </div>)}
                    </div> */}
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 ">
    {userEvents.length > 0 ? userEvents.slice(0, showAllEvents ? userEvents.length : 3).map((event, index) => {
        
        // चेक करें कि क्या इवेंट Coming soon है
        const isEventComingSoon = () => {
            return event.EventStartDate?.toLowerCase().includes('coming soon') && 
                   event.EndStartDate?.toLowerCase().includes('coming soon');
        };
        
        return (
            <div
                key={index}
                className="overflow-hidden transition-all duration-300 bg-white border shadow-lg dark:bg-gray-800 rounded-2xl dark:border-slate-700 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 group hover:shadow-2xl hover:transform hover:scale-105"
            >
                <div className="relative">
                    <img
                        src={event.Image}
                        alt={event.Title}
                        className="object-cover object-top w-full h-48 transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute top-4 left-4">
                        <span className="flex items-center px-4 py-2 font-medium text-white border rounded-full bg-blue-600/90 backdrop-blur-sm border-white/20">
                            <RiArrowRightLine className="mr-2 ri-building-line" />
                            {event.EventMode}
                        </span>
                    </div>

                    {event.featured && (
                        <div className="absolute top-4 right-4">
                            <span className="flex items-center px-3 py-1 text-sm font-medium text-white border rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 backdrop-blur-sm border-yellow-300/20">
                                <RiStarFill className="mr-1" />
                                Featured
                            </span>
                        </div>
                    )}
                </div>
                <div className="p-6">
                    <h6 className="mb-3 font-bold text-gray-700 transition-colors text-md dark:text-white line-clamp-1 group-hover:text-blue-400 dark:group-hover:text-blue-300 card-heading">
                        {event.Tittle}
                    </h6>

                    <div className="mb-4 space-y-2 text-slate-400 ">
                        {/* Conditionally render calendar date */}
                        {!isEventComingSoon() && (
                            <div className="flex items-center">
                                <RiCalendarLine className="mr-2 text-blue-400 dark:text-white" />
                                <span className="text-gray-600 dark:text-white">
                                    {event.EventStartDate}{" "}to{" "}{event.EndStartDate}
                                </span>
                            </div>
                        )}
                        
                        <div className="flex items-center">
                            <RiMapPinLine className="mr-2 text-blue-400 dark:text-white" />
                            <span className="text-gray-600 truncate dark:text-white">{event.Location}</span>
                        </div>

                        <div className="flex items-center">
                            <RiUserLine className="mr-2 text-blue-400 dark:text-white" />
                            <span className="block overflow-hidden text-gray-600 dark:text-white line-clamp-1 text-ellipsis">
                                {event.EventType}
                            </span>
                        </div>

                        <div className="flex items-center">
                            <RiCheckboxCircleLine className="mr-2 text-green-500 dark:text-white" />
                            <span className="text-gray-600 truncate dark:text-white">
                                {event.AccessType}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                        <div className="text-2xl font-bold text-white dark:text-gray-100"></div>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            AvailableSeats : <span className="ml-1 font-semibold text-gray-700 dark:text-gray-300">{event.AvailableSeats}</span>
                        </div>
                    </div>

                    {/* <Link
                        href={`/pages/event-booking/event/${event.Id}`}
                        className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center 
                            ${isEventComingSoon() ? "bg-green-600 hover:bg-green-600 cursor-not-allowed text-white" : 
                              (parseInt(event.AvailableSeats, 10) <= 0 || isEventPast(event)) ? "bg-gray-500 cursor-not-allowed" : 
                              "th-btn style2 text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"} 
                            shadow-lg hover:shadow-xl`}
                        onClick={(e) => {
                            if (isEventComingSoon() || parseInt(event.AvailableSeats, 10) <= 0 || isEventPast(event)) {
                                e.preventDefault();
                            }
                        }}
                    >
                        <RiTicket2Line className="mr-2" /> 
                        {isEventComingSoon() ? "Coming Soon" : 
                         (parseInt(event.AvailableSeats, 10) <= 0 || isEventPast(event)) ? 
                         (isEventPast(event) ? "Event Passed" : "Seats not available") : 
                         "Book Now"}
                    </Link> */}
                    <Link
    href={`/pages/event-booking/event/${event.Id}`}
    className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center 
        ${isEventComingSoon() ? "bg-green-600 hover:bg-green-600 cursor-not-allowed text-white" : 
          (parseInt(event.AvailableSeats, 10) <= 0 || isEventPast(event)) ? "bg-gray-500 cursor-not-allowed" : 
          "th-btn style2 text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"} 
        shadow-lg hover:shadow-xl`}
    onClick={(e) => {
        if (isEventComingSoon() || parseInt(event.AvailableSeats, 10) <= 0 || isEventPast(event)) {
            e.preventDefault();
        }
    }}
>
    {/* Conditional rendering for icon */}
    {!isEventComingSoon() && <RiTicket2Line className="mr-2" />}
    
    {/* Conditional text */}
    {isEventComingSoon() ? "Coming Soon" : 
     (parseInt(event.AvailableSeats, 10) <= 0 || isEventPast(event)) ? 
     (isEventPast(event) ? "Event Passed" : "Seats not available") : 
     "Book Now"}
</Link>
                </div>
            </div>
        );
    }) : (<div className="text-center col-span-full">
        <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-gray-100 rounded-full dark:bg-gray-800">
            <RiCalendarTodoLine className="text-2xl text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">No Events Available</h3>
    </div>)}
</div>
                    
                </div>
            </section>

            {/* Powered by AI Intelligence */}
            <section className="py-8  dark:bg-gray-900 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/20 border-b border-[#d3d3d3]">
                <div className="px-6 mx-auto max-w-7xl">
                    <div className="mb-16 text-center">
                        <h2 className="mb-4 text-4xl font-bold dark:text-white dark:text-gray-100">
                            Powered by AI Intelligence
                        </h2>
                        <p className="max-w-3xl mx-auto text-xl text-slate-400 dark:text-gray-300">
                            Experience the future of event booking with our advanced AI features
                            and seamless integration
                        </p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                        {aiFeatures.map((feature, index) => (
                            <div
                                key={index}
                                className="p-6 text-center transition-all duration-300 border dark:bg-slate-800 dark:bg-gray-800 dark:border-slate-700 dark:border-gray-600 rounded-2xl hover:border-blue-500 dark:hover:border-blue-400 group hover:transform hover:scale-105 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:shadow-2xl"
                            >
                                <div
                                    className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                                >
                                    {feature.icon}
                                </div>

                                <h3 className="mb-3 text-xl font-bold dark:text-white dark:text-gray-100">
                                    {feature.title}
                                </h3>
                                <p className="leading-relaxed text-slate-400 dark:text-gray-300">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    )
}