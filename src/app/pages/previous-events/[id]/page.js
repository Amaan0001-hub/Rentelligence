"use client";
import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { RiCalendarLine, RiMapPinLine, RiUserLine, RiGroupLine, RiArrowLeftLine, RiImage2Line, RiVideoLine } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { getEventImagesByEMID } from "@/app/redux/slices/eventSlice";
import Link from "next/link";

export default function EventDetail() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { closeData, eventImages } = useSelector((state) => state.event);
  console.log(eventImages, "Abhishek---->");

  const event = closeData?.event?.find(e => e?.EventMasterID == id);

  useEffect(() => {
    dispatch(getEventImagesByEMID(id))
  }, [dispatch, id])

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
              <RiUserLine className="text-2xl text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3">Event Not Found</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">The event you&apos;re looking for does not exist.</p>
            <Link href="/pages/previous-events">
              <button className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 mx-auto">
                <RiArrowLeftLine className="mr-2" /> Back to Previous Events
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <Link href="/pages/previous-events" className="w-full md:w-auto">
            <button className="flex items-center px-5 py-3 bg-white dark:bg-gray-800 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 shadow-sm hover:shadow-md w-full md:w-auto justify-center md:justify-start group">
              <RiArrowLeftLine className="mr-2 transform group-hover:-translate-x-1 transition-transform" /> 
              Back to Events
            </button>
          </Link>
          <div className="text-center md:text-right">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-sm font-medium mb-2 previous-events-heading">
              {event.EventType}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2 bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              {event.Tittle}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium">Event Details & Gallery</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Event Image and Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Event Image */}
          <div className="relative group">
  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-500"></div>
  <div className="w-full h-80 lg:h-96 rounded-2xl shadow-xl overflow-hidden relative">
    <img
      src={event.Image}
      alt={event.Tittle}
      className="w-full h-full object-fill transform group-hover:scale-[1.02] transition-all duration-500"
    />
  </div>
</div>

            {/* Event Details Card */}
           {/* Event Details Card - Enhanced */}
<div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
  {/* Card Header with Gradient */}
  <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <div className="w-3 h-8 bg-white rounded-full mr-3"></div>
        <h2 className="text-2xl font-bold text-white">Event Information</h2>
      </div>
      <div className="px-3 py-1 bg-white/20 rounded-full">
        <span className="text-white text-sm font-medium">Full Details</span>
      </div>
    </div>
  </div>

  {/* Details Grid */}
  <div className="p-6">
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Left Column */}
      <div className="space-y-4">
        {/* Start Date */}
        <div className="flex items-start p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl border-l-4 border-blue-500 hover:shadow-md transition-all duration-300 group">
          <div className="p-2 bg-white dark:bg-gray-700 rounded-lg shadow-sm mr-4 group-hover:scale-110 transition-transform">
            <RiCalendarLine className="text-xl text-blue-500" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
              Start Date
            </p>
            <p className="text-sm font-bold text-gray-800 dark:text-white">
              {event.EventStartDate}
            </p>
          </div>
          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>

        {/* End Date */}
        <div className="flex items-start p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl border-l-4 border-green-500 hover:shadow-md transition-all duration-300 group">
          <div className="p-2 bg-white dark:bg-gray-700 rounded-lg shadow-sm mr-4 group-hover:scale-110 transition-transform">
            <RiCalendarLine className="text-xl text-green-500" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
              End Date
            </p>
            <p className="text-sm font-bold text-gray-800 dark:text-white">
              {event.EndStartDate}
            </p>
          </div>
          <div className="w-2 h-2 bg-green-500 rounded-full mt-2 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>

        {/* Location */}
        <div className="flex items-start p-4 bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-xl border-l-4 border-red-500 hover:shadow-md transition-all duration-300 group">
          <div className="p-2 bg-white dark:bg-gray-700 rounded-lg shadow-sm mr-4 group-hover:scale-110 transition-transform">
            <RiMapPinLine className="text-xl text-red-500" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
              Location
            </p>
            <p className="text-sm font-bold text-gray-800 dark:text-white">
              {event.Location}
            </p>
          </div>
          <div className="w-2 h-2 bg-red-500 rounded-full mt-2 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>
      </div>

      {/* Right Column */}
      <div className="space-y-4">
        {/* Event Type */}
        <div className="flex items-start p-4 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl border-l-4 border-purple-500 hover:shadow-md transition-all duration-300 group">
          <div className="p-2 bg-white dark:bg-gray-700 rounded-lg shadow-sm mr-4 group-hover:scale-110 transition-transform">
            <RiUserLine className="text-xl text-purple-500" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
              Event Type
            </p>
            <p className="text-sm font-bold text-gray-800 dark:text-white">
              {event.EventType}
            </p>
          </div>
          <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>

        {/* Event Mode */}
        <div className="flex items-start p-4 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl border-l-4 border-orange-500 hover:shadow-md transition-all duration-300 group">
          <div className="p-2 bg-white dark:bg-gray-700 rounded-lg shadow-sm mr-4 group-hover:scale-110 transition-transform">
            <RiGroupLine className="text-xl text-orange-500" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
              Event Mode
            </p>
            <p className="text-sm font-bold text-gray-800 dark:text-white">
              {event.EventMode}
            </p>
          </div>
          <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>

        {/* Available Seats */}
        <div className="flex items-start p-4 bg-gradient-to-r from-teal-50 to-teal-100 dark:from-teal-900/20 dark:to-teal-800/20 rounded-xl border-l-4 border-teal-500 hover:shadow-md transition-all duration-300 group">
          <div className="p-2 bg-white dark:bg-gray-700 rounded-lg shadow-sm mr-4 group-hover:scale-110 transition-transform">
            <RiGroupLine className="text-xl text-teal-500" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
               Seats
            </p>
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-gray-800 dark:text-white">
                {event.AvailableSeats}
              </p>
              <div className="flex items-center">
                <div className="w-24 bg-gray-200 dark:bg-gray-600 rounded-full h-2 mr-3">
                  <div 
                    className="bg-teal-500 h-2 rounded-full" 
                    style={{ 
                      width: `${Math.min((event.AvailableSeats / 100) * 100, 100)}%` 
                    }}
                  ></div>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                  {Math.min((event.AvailableSeats / 100) * 100, 100)}%
                </span>
              </div>
            </div>
          </div>
          <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>
      </div>
    </div>

    {/* Additional Info Bar */}
    <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse"></div>
          <span className="text-sm text-gray-600 dark:text-gray-300">
            Event information last updated
          </span>
        </div>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
          Just now
        </span>
      </div>
    </div>
  </div>
</div>
          </div>

          {/* Right Column - Quick Stats */}
          <div className="space-y-8">
            {/* Event Summary Card */}
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-4">Event Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-blue-400/30">
                  <span className="text-blue-100">Status</span>
                  <span className="font-semibold">Completed</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-blue-400/30">
                  <span className="text-blue-100">Duration</span>
                  <span className="font-semibold">{event.EventStartDate} - {event.EndStartDate}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-blue-100">Mode</span>
                  <span className="font-semibold">{event.EventMode}</span>
                </div>
              </div>
            </div>

            {/* Gallery Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Gallery Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center">
                    <RiImage2Line className="text-blue-500 mr-3" />
                    <span className="text-gray-700 dark:text-gray-300">Photos</span>
                  </div>
                  <span className="font-bold text-gray-800 dark:text-white">
                    {eventImages?.event?.filter(item => item.EventImages).length || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center">
                    <RiVideoLine className="text-purple-500 mr-3" />
                    <span className="text-gray-700 dark:text-gray-300">Videos</span>
                  </div>
                  <span className="font-bold text-gray-800 dark:text-white">
                    {eventImages?.event?.filter(item => item.EventVideos).length || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Image Gallery Section */}
        <div className="mt-12">
          <div className="flex items-center mb-8">
            <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full mr-3"></div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Image Gallery</h2>
            <span className="ml-3 px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-sm font-medium rounded-full">
              {eventImages?.event?.filter(item => item.EventImages).length || 0}
            </span>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {eventImages && eventImages?.event?.length > 0 ? (
              eventImages?.event.map((image, index) => (
                image.EventImages && (
                  <div key={index} className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                    <img
                      src={image.EventImages}
                      alt={image.Title || image.alt || `Event Image ${index + 1}`}
                      className="w-full h-60 object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
                      <p className="text-white font-semibold text-sm">
                        {image.Title || `Event Image ${index + 1}`}
                      </p>
                    </div>
                  </div>
                )
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <RiImage2Line className="text-4xl text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 text-lg">No images available for this event</p>
              </div>
            )}
          </div>
        </div>

        {/* Video Gallery Section */}
        <div className="mt-12">
          <div className="flex items-center mb-8">
            <div className="w-2 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full mr-3"></div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Video Gallery</h2>
            <span className="ml-3 px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 text-sm font-medium rounded-full">
              {eventImages?.event?.filter(item => item.EventVideos).length || 0}
            </span>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {eventImages?.event?.filter(item => item.EventVideos).length > 0 ? (
              eventImages?.event.map((item, index) => (
                item.EventVideos && (
                  <div key={index} className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg  transition-all duration-500 overflow-hidden transform">
                    <div className="absolute inset-0  z-10 rounded-2xl"></div>
                    <video
                      src={item.EventVideos}
                      controls
                      preload="auto"
                      className="w-full h-60 object-cover rounded-2xl"
                      onError={(e) => console.error('Video failed to load:', e.target.src)}
                    />
                  </div>
                )
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <RiVideoLine className="text-4xl text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 text-lg">No videos available for this event</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}