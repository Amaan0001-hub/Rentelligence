"use client";
import React, { useEffect, useState } from "react";
import { RiCalendarLine, RiMapPinLine, RiUserLine, RiGroupLine, RiTicket2Line, RiArrowRightLine, RiArrowLeftLine, RiStarFill, RiShareLine, RiHeartLine, RiHeartFill } from "react-icons/ri";
import { closeEventMaster } from "@/app/redux/slices/eventSlice";
import Loader from "@/app/components/Loader";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";

export default function PreviousEvents() {
  const dispatch = useDispatch();
  const { closeData, loading, eventImages } = useSelector((state) => state.event);
  const [likedEvents, setLikedEvents] = useState(new Set());
  const [hoveredCard, setHoveredCard] = useState(null);

  console.log("Abhishek--->", closeData);

  const toggleLike = (eventId) => {
    setLikedEvents(prev => {
      const newSet = new Set(prev);
      if (newSet.has(eventId)) {
        newSet.delete(eventId);
      } else {
        newSet.add(eventId);
      }
      return newSet;
    });
  };

  useEffect(() => {
    dispatch(closeEventMaster());
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-slate-900 py-4 sm:py-6 lg:py-8">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
        
        {/* Enhanced Header Section */}
        <div className="mb-8 sm:mb-10 lg:mb-12 relative">
          {/* Background Decorative Elements */}
          <div className="absolute top-0 left-0 w-48 h-48 sm:w-56 sm:h-56 lg:w-72 lg:h-72 bg-blue-200/20 dark:bg-blue-600/10 rounded-full blur-2xl lg:blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          
          <div className="relative">
            <div className="flex flex-col lg:flex-row items-center lg:justify-between mb-6 lg:mb-8 gap-4 sm:gap-6">
              {/* Back Button with Enhanced Design */}
              <Link href="/pages/event-booking" className="w-full lg:w-auto order-2 lg:order-1">
                <button className="flex items-center px-4 sm:px-5 lg:px-6 py-2.5 sm:py-3 lg:py-3.5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 rounded-lg sm:rounded-xl border border-blue-200/60 dark:border-blue-800/60 hover:border-blue-300 dark:hover:border-blue-700 shadow-sm hover:shadow-lg w-full lg:w-auto justify-center lg:justify-start group transition-all duration-300 hover:scale-[1.02] text-sm sm:text-base">
                  <RiArrowLeftLine className="mr-2 group-hover:-translate-x-1 transition-transform duration-300 text-sm sm:text-base lg:text-lg" /> 
                  Back To Events
                </button>
              </Link>

              {/* Enhanced Heading Section */}
              <div className="text-center lg:text-right order-1 lg:order-2 w-full lg:w-auto">
                {/* Premium Badge */}
                <div className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 lg:py-2.5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20 border border-blue-200/50 dark:border-blue-500/30 text-blue-600 dark:text-blue-400 text-xs sm:text-sm font-semibold mb-3 sm:mb-4 backdrop-blur-sm shadow-sm">
                  <div className="flex items-center">
                    <div className="relative mr-2 sm:mr-3">
                      <RiStarFill className="text-yellow-500 text-sm sm:text-base lg:text-lg animate-pulse" />
                      <div className="absolute inset-0 bg-yellow-500 rounded-full animate-ping opacity-20"></div>
                    </div>
                    <span className="text-xs sm:text-sm">Your Premium Event History</span>
                  </div>
                </div>

                {/* Main Heading with Gradient */}
                <div className="mb-2 sm:mb-3">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold mb-1 sm:mb-2 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 dark:from-blue-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent leading-tight sm:leading-tight lg:leading-tight">
                    Previous Events
                  </h1>
                  
                  {/* Animated Underline */}
                  <div className="flex justify-center lg:justify-end">
                    <div className="w-16 sm:w-20 lg:w-24 h-1 sm:h-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-1 sm:mt-2 mb-2 sm:mb-3"></div>
                  </div>
                </div>

                {/* Enhanced Subheading */}
                <div className="max-w-2xl mx-auto lg:mx-0">
                  <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-1 sm:mb-2 px-2 sm:px-0">
                    Relive your <span className="font-semibold text-blue-600 dark:text-blue-400">memorable experiences</span> and access exclusive event materials
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">
                    {closeData?.event?.length || 0} events attended • Your journey through amazing experiences
                  </p>
                </div>
              </div>
            </div>

            {/* Stats Bar - Responsive Grid */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:gap-4 mt-6 lg:mt-8 max-w-sm sm:max-w-md mx-auto lg:ml-auto lg:mr-0 lg:max-w-md">
              <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg sm:rounded-xl p-2 sm:p-3 lg:p-4 text-center border border-gray-200/50 dark:border-gray-700/50">
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600 dark:text-blue-400">{closeData?.event?.length || 0}</div>
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium">Total Events</div>
              </div>
              <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg sm:rounded-xl p-2 sm:p-3 lg:p-4 text-center border border-gray-200/50 dark:border-gray-700/50">
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {closeData?.event?.filter(e => e.EventMode === 'Online Event').length || 0}
                </div>
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium">Online Events</div>
              </div>
              <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg sm:rounded-xl p-2 sm:p-3 lg:p-4 text-center border border-gray-200/50 dark:border-gray-700/50">
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600 dark:text-green-400">
                  {closeData?.event?.filter(e => e.EventMode === 'Venue Event').length || 0}
                </div>
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium">Venue Events</div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Events Grid - Fully Responsive */}
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 xl:gap-8">
          {closeData?.event?.map((event, index) => (
            <div
              key={index}
              className="group cursor-pointer"
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-md sm:shadow-lg dark:shadow-gray-900/30 border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-500 group-hover:shadow-xl sm:group-hover:shadow-2xl group-hover:-translate-y-1 sm:group-hover:-translate-y-2 h-full flex flex-col">
                
                {/* Enhanced Image Section */}
                <div className="relative overflow-hidden">
                  <div className="aspect-w-16 aspect-h-9 h-40 sm:h-44 lg:h-48 xl:h-52">
                    <img
                      src={event.Image}
                      alt={event.Tittle}
                      className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105 sm:group-hover:scale-110"
                    />
                  </div>
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 sm:from-black/60 via-transparent to-transparent opacity-60 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Top Badges */}
                  <div className="absolute top-2 sm:top-3 lg:top-4 left-2 sm:left-3 lg:left-4 flex gap-1 sm:gap-2">
                    <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-2 py-1 sm:px-3 sm:py-2 rounded-lg sm:rounded-full font-medium text-xs sm:text-sm flex items-center backdrop-blur-sm">
                      <RiArrowRightLine className="mr-1 text-xs sm:text-sm" />
                      <span className="hidden xs:inline">{event.EventMode}</span>
                      <span className="xs:hidden">Event</span>
                    </span>
                    <span className="bg-red-500/90 text-white px-2 py-1 sm:px-3 sm:py-2 rounded-lg sm:rounded-full font-medium text-xs sm:text-sm flex items-center backdrop-blur-sm">
                      Completed
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="absolute top-2 sm:top-3 lg:top-4 right-2 sm:right-3 lg:right-4 flex gap-1 sm:gap-2 opacity-60 sm:opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-0 sm:translate-y-2 group-hover:translate-y-0">
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleLike(event.EventMasterID);
                      }}
                      className="p-1.5 sm:p-2 bg-white/80 dark:bg-gray-800/80 rounded-lg sm:rounded-full backdrop-blur-sm hover:scale-105 sm:hover:scale-110 transition-transform duration-200"
                    >
                      {likedEvents.has(event.EventMasterID) ? 
                        <RiHeartFill className="text-red-500 text-sm sm:text-base lg:text-lg" /> : 
                        <RiHeartLine className="text-gray-600 dark:text-gray-400 text-sm sm:text-base lg:text-lg" />
                      }
                    </button>
                    <button className="p-1.5 sm:p-2 bg-white/80 dark:bg-gray-800/80 rounded-lg sm:rounded-full backdrop-blur-sm hover:scale-105 sm:hover:scale-110 transition-transform duration-200">
                      <RiShareLine className="text-gray-600 dark:text-gray-400 text-sm sm:text-base lg:text-lg" />
                    </button>
                  </div>

                  {/* Hover Effect Indicator */}
                  <div className={`absolute bottom-0 left-0 w-0 h-0.5 sm:h-1 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500 group-hover:w-full ${hoveredCard === index ? 'w-full' : ''}`} />
                </div>

                {/* Enhanced Content Section */}
                <div className="p-3 sm:p-4 lg:p-5 xl:p-6 flex-1 flex flex-col">
                  <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-800 dark:text-white mb-2 sm:mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 min-h-[2.5rem] sm:min-h-[3rem] lg:min-h-[3.5rem]">
                    {event.Tittle}
                  </h3>

                  {/* Event Details */}
                  <div className="space-y-1.5 sm:space-y-2 lg:space-y-3 mb-3 sm:mb-4 flex-1">
                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                      <div className="p-1.5 sm:p-2 bg-blue-50 dark:bg-blue-900/20 rounded sm:rounded-lg mr-2 sm:mr-3">
                        <RiCalendarLine className="text-blue-500 dark:text-blue-400 text-sm sm:text-base lg:text-lg" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-xs sm:text-sm font-medium truncate">{event.EventStartDate} to {event.EndStartDate}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                      <div className="p-1.5 sm:p-2 bg-green-50 dark:bg-green-900/20 rounded sm:rounded-lg mr-2 sm:mr-3">
                        <RiMapPinLine className="text-green-500 dark:text-green-400 text-sm sm:text-base lg:text-lg" />
                      </div>
                      <span className="text-xs sm:text-sm font-medium truncate flex-1">{event.Location}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                      <div className="p-1.5 sm:p-2 bg-purple-50 dark:bg-purple-900/20 rounded sm:rounded-lg mr-2 sm:mr-3">
                        <RiUserLine className="text-purple-500 dark:text-purple-400 text-sm sm:text-base lg:text-lg" />
                      </div>
                      <span className="text-xs sm:text-sm font-medium line-clamp-1 flex-1">{event.EventType}</span>
                    </div>
                  </div>

                  {/* Price and Status */}
                  <div className="flex items-center justify-between mb-4 sm:mb-5 lg:mb-6 pt-3 sm:pt-4 border-t border-gray-100 dark:border-gray-700">
                    <div className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                      {event.price}
                    </div>
                    <div className="flex items-center text-xs sm:text-sm font-medium px-2 py-1 sm:px-3 sm:py-1 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full">
                      <RiGroupLine className="mr-1 text-xs sm:text-sm" /> 
                      <span className="hidden xs:inline">Event Completed</span>
                      <span className="xs:hidden">Completed</span>
                    </div>
                  </div>

                  {/* Enhanced CTA Button */}
                  <Link href={`/pages/previous-events/${event.EventMasterID}`} className="block">
                    <button className="w-full py-2.5 sm:py-3 lg:py-4 rounded-lg sm:rounded-xl font-semibold transition-all duration-300 flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-md hover:shadow-lg sm:shadow-lg sm:hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 group/btn overflow-hidden relative text-sm sm:text-base">
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
                      <RiTicket2Line className="mr-1.5 sm:mr-2 text-sm sm:text-base lg:text-lg" /> 
                      <span className="text-xs sm:text-sm lg:text-base">View Details</span>
                      <RiArrowRightLine className="ml-1.5 sm:ml-2 group-hover/btn:translate-x-0.5 sm:group-hover/btn:translate-x-1 transition-transform duration-200 text-xs sm:text-sm" />
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {(!closeData?.event || closeData.event.length === 0) && (
          <div className="text-center py-12 sm:py-16 lg:py-20">
            <div className="max-w-xs sm:max-w-sm md:max-w-md mx-auto">
              <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mx-auto mb-3 sm:mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                <RiCalendarLine className="text-xl sm:text-2xl lg:text-3xl text-gray-400" />
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-600 dark:text-gray-300 mb-2 sm:mb-3">
                No Previous Events
              </h3>
              <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-4 sm:mb-6 px-4 sm:px-0">
                You haven&apos;t attended any events yet. Start exploring upcoming events!
              </p>
              
              <Link href="/pages/event-booking">
                <button className="px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors duration-200 text-sm sm:text-base">
                  Browse Events
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}