"use client";
import React, { useState, useEffect, useRef } from "react";
import { getEncryptedLocalData } from "@/app/api/auth";
import {
  addTicketReplytest,
  getTicketReplyByTicketId,
} from "@/app/redux/slices/ticketSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { X } from "lucide-react";

export default function TicketDetailModal({ open, onClose, ticket }) {
  const [reply, setReply] = useState("");
  const [replies, setReplies] = useState([]);
  const [user, setUser] = useState("");
  const [userData, setUserData] = useState({});
  const dispatch = useDispatch();
  const {getTicketByTicketIdData}= useSelector((state) => state.ticket);

  const modalRef = useRef();
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose(); 
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  useEffect(() => {
    const fName = getEncryptedLocalData("FName");
    setUser(fName);
    setUserData({ FName: fName });
    const fetchData = async () => {
      try {
        await dispatch(getTicketReplyByTicketId(ticket.TicketId));
      } catch (error) {
        console.error("Error fetching ticket data:", error);
      }
    };
    fetchData();
  }, [dispatch, ticket.ticketId]);

  if (!open || !ticket) return null;

  const ticketIndexZero = getTicketByTicketIdData?.ticket[0] || {};
  const handleReply = async (e) => {
    e.preventDefault();
    const urid = getEncryptedLocalData("UserId");
    try {
      const data = {
        ticketId: ticketIndexZero.TicketId,
        createdBy: urid,
        message: reply,
        status: 1,
        seen: 1,
        imageFile: null, // or File object
      };

      await dispatch(addTicketReplytest(data)).unwrap();
      setReply("");
      await dispatch(getTicketReplyByTicketId(ticket.TicketId));
    } catch (err) {
      console.error("Failed to submit reply:", err);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""} ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? "s" : ""} ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays !== 1 ? "s" : ""} ago`;
  };

  const allMessages = [
    ...(getTicketByTicketIdData?.replies?.length
      ? getTicketByTicketIdData.replies.map((item) => ({
          id: item.id,
          message: item.Message,
          timestamp: item.ReplyDate,
          Name: item.Name,
          Status: item.Status,
          user: item.appUserId ? "User" : "Admin",
        }))
      : []),
    ...replies,
  ].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 bg-[rgba(22,22,22,0.36)]">
      <div
        ref={modalRef}
        className="bg-white dark:bg-[#10192a] border rounded-lg dark:border-white shadow-lg w-full max-w-md p-4 relative max-h-[95vh] overflow-hidden text-[13px]"
      >
        {/* Close Button */}
        <button
          className="absolute text-gray-500 top-2 right-1 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white"
          onClick={onClose}
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>

        {/* Title */}
        <h2 className="mb-2 text-base font-semibold text-gray-700 dark:text-white">
          Ticket Details
        </h2>

        {/* Ticket Info */}
        <div className="grid grid-cols-2 gap-2 text-gray-700 dark:text-white">
          <div>
            <p className="font-semibold text-xs">User</p>
            <p className="text-[12px]">{ticketIndexZero.UserName || "N/A"}</p>
          </div>
          <div className="text-right">
            <p className="font-semibold text-xs">Type</p>
            <p className="text-[12px]">{ticketIndexZero.TicketType}</p>
          </div>
          <div>
            <p className="font-semibold text-xs">Subject</p>
            <p className="text-[12px]">{ticketIndexZero.Subject}</p>
          </div>
          <div className="text-right">
            <p className="font-semibold text-xs">Time</p>
            <p className="text-[12px]">{ticketIndexZero.CreatedDate}</p>
          </div>
          <div className="col-span-2 text-right">
            <p className="font-semibold text-xs">Status</p>
            <span
              className={`inline-flex items-center gap-1.5 mt-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${
                ticketIndexZero.StatusType?.toLowerCase() === "open"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  ticketIndexZero.StatusType?.toLowerCase() === "open"
                    ? "bg-green-500"
                    : "bg-red-500"
                }`}
              ></span>
              {ticketIndexZero.StatusType || "N/A"}
            </span>
          </div>
        </div>

        {/* Image (optional) */}
        {ticketIndexZero.ImagePath && (
          <div className="mt-2">
            <img
              src={ticketIndexZero.ImagePath}
              alt="Ticket"
              className="object-cover w-24 h-24 rounded"
            />
          </div>
        )}

        {/* Conversation */}
        <div className="mt-3">
          <h3 className="mb-1 text-sm font-semibold text-gray-700 dark:text-white">
            Conversation
          </h3>
          <div className="h-[28vh] overflow-y-auto space-y-2 p-2 bg-gray-100 dark:bg-[#0b141a] rounded-md scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600">
            {allMessages.map((message, index) => {
              const isUser = message.Status === 1;
              return (
                <div
                  key={message.id || index}
                  className={`flex w-full ${
                    isUser ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[75%] p-2 rounded-xl text-[12px] leading-snug ${
                      isUser
                        ? "bg-[#dcf8c6] text-black rounded-br-none"
                        : "bg-white dark:bg-[#202c33] text-black dark:text-gray-100 rounded-bl-none"
                    }`}
                  >
                    {!isUser && (
                      <p className="font-semibold text-[11px] text-green-600 dark:text-green-400 mb-0.5">
                        {message.Name || "Admin"}
                      </p>
                    )}
                    <p
                      className="text-[12px]"
                      dangerouslySetInnerHTML={{ __html: message.message }}
                    ></p>
                    <span
                      className={`text-[10px] text-gray-500 mt-0.5 block ${
                        isUser ? "text-right" : "text-left"
                      }`}
                    >
                      {message.timestamp || ""}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Reply Form */}
        <form onSubmit={handleReply} className="mt-2">
          <label className="block mb-1 text-xs text-gray-600 dark:text-white">
            Activity
          </label>
          <textarea
            className="w-full p-1 border rounded text-[12px] focus:outline-none dark:text-black dark:border-gray-600"
            rows={2}
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="Type your reply..."
            required
          />
          <button
            type="submit"
            className="px-3 py-1 mt-1 text-xs font-medium text-white transition-colors bg-blue-600 rounded hover:bg-blue-700"
            disabled={!reply.trim()}
          >
            Send Reply
          </button>
        </form>
      </div>
    </div>
  );
}
