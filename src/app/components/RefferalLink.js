"use client";

import toast from "react-hot-toast";
import { FiCopy } from "react-icons/fi";
import { LinkIcon, Users } from "lucide-react";
import { FiHelpCircle } from "react-icons/fi";
import { getEncryptedLocalData } from "../api/auth";
import {
  FaFacebookF,
  FaWhatsapp,
  FaTelegramPlane,
  FaFilePdf,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { useEffect, useState } from "react";

const ReferralLink = () => {
  const [authlogin, setAuthLogin] = useState(null);
  useEffect(() => {
    const authLogin = getEncryptedLocalData("AuthLogin");
    setAuthLogin(authLogin);
  }, []);
  const referralLink = `https://app.rentelligence.ai/home/register?RefID=${
    authlogin || ""
  }`;
 


  const handleCopyClick = () => {
    const fullMessage = `🚀 𝐉𝐨𝐢𝐧 𝐑𝐞𝐧𝐭𝐞𝐥𝐥𝐢𝐠𝐞𝐧𝐜𝐞 – 𝐓𝐡𝐞 𝐅𝐮𝐭𝐮𝐫𝐞 𝐨𝐟 𝐀𝐈 𝐋𝐞𝐚𝐬𝐢𝐧𝐠!
Start Earning by leasing AI agents today. Sign up using my referral link and unlock exciting rewards:
👉 ${referralLink}`;
    navigator.clipboard
      .writeText(fullMessage)
      .then(() => {
        toast.success("Referral message copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    toast.success("copied to clipboard!");
  };

  return (
    <div className="relative z-10">
      <div className="w-full max-w-xl p-4 mx-auto space-y-8 text-white border bg-white/10 border-white/20 backdrop-blur-md rounded-2xl">
        {/* Header */}
        <div className="flex items-center gap-4 sm:gap-6">
          <div
            className="bg-[#6633ff] w-10 h-10 sm:w-12 sm:h-12 rounded-full flex
           items-center justify-center text-white font-bold text-lg"
          >
            <Users size={20} />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-gray-600 sm:text-3xl dark:text-white">
              Invite Friends
            </h2>
            <p className="text-sm text-gray-600 sm:text-base dark:text-white">
              Earn rewards by sharing
            </p>
          </div>
        </div>

        {/* Referral Box */}
        <div className="p-4 space-y-3 rounded-lg shadow-inner hero-2 border-white/30">
          <div className="flex items-center gap-2">
            <p className="relative z-10 text-sm font-medium text-white/80">
              Your Referral Link
            </p>
            <button
              onClick={handleCopy}
              className="relative p-1 text-white rounded-md hover:bg-white/10"
            >
              <FiCopy className="" />
            </button>
          </div>
          <div className="relative z-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              readOnly
              value={referralLink}
              onClick={() => {
                window.open(referralLink, "_blank");
              }}
              className="w-full px-3 py-2 text-sm text-gray-800 bg-white border border-gray-300 rounded-lg cursor-pointer sm:flex-1 focus:outline-none"
            />
            <button
              onClick={handleCopyClick}
              className="flex items-center justify-center gap-1 px-4 py-2 text-sm font-medium text-white bg-[#4338ca] rounded-lg"
            >
              <LinkIcon size={16} />
              Copy
            </button>
          </div>
        </div>

        {/* How It Works */}
        <div className="p-5 space-y-3 text-sm text-gray-800 border border-yellow-200 rounded-lg shadow-inner bg-yellow-50 sm:text-base">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center font-bold text-black bg-yellow-400 rounded-full w-7 h-7">
              <FiHelpCircle className="text-lg" />
            </div>
            <p className="text-[#7f551d] font-semibold">How Referrals Work</p>
          </div>
          <ul className="mt-1 list-disc list-inside lg:ml-5">
            <li className="text-[#8a6528] text-sm">
              Share your unique referral link
            </li>
            <li className="text-[#8a6528] text-sm">
              Friends sign up and activate their accounts
            </li>
            <li className="text-[#8a6528] text-sm">
              You both earn commissions and bonuses
            </li>
            <li className="text-[#8a6528] text-sm">
              Grow your network for more rewards
            </li>
          </ul>
        </div>
        <div className="mt-2">
          {/* WhatsApp */}
          <a
            href={`https://wa.me/?text=${encodeURIComponent(
              `*AI is the future – and you can profit from it today!*
Join Rentelligence using my referral link: ${referralLink} Earn rewards by leasing AI agents. Don’t miss out!`
            )}&media=${encodeURIComponent(
              "https://imagedelivery.net/nq9qT5FHZv9Sg48UUnD1-A/6db933b4-d8e8-4cb4-f94d-5ff7533aba00/public"
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white bg-[#25D366] hover:bg-[#25D366]/90 focus:ring-4 focus:outline-none focus:ring-[#25D366]/50 font-medium rounded-lg text-sm px-2.5 py-1.5 text-center inline-flex items-center dark:focus:ring-[#25D366]/55 me-2 mb-2"
          >
            <FaWhatsapp className="w-4 h-4 me-2" />
            WhatsApp
          </a>

          {/* Facebook */}
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
              referralLink
            )}&quote=${encodeURIComponent(
              "✨ *Imagine earning by leasing AI Agents!* Rentelligence makes it possible. Join today using my referral link: Start your AI-powered income journey now! #AILeasing #AIRevolution #Rentelligence #TechFuture"
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white bg-[#3b5998] hover:bg-[#3b5998]/90 focus:ring-4 focus:outline-none focus:ring-[#3b5998]/50 font-medium rounded-lg text-sm px-2.5 py-1.5 text-center inline-flex items-center dark:focus:ring-[#3b5998]/55 me-2 mb-2"
          >
            <FaFacebookF className="w-4 h-4 me-2" />
            Facebook
          </a>

          {/* Twitter/X */}
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
              "💡 *Own, Rent & Profit from AI Agents!* Join the world’s first AI leasing marketplace – Rentelligence. Sign up now using my link and enjoy rewards:"
            )}&url=${encodeURIComponent(
              referralLink
            )} 💡 *Own, Rent & Profit from AI Agents!* Join the world’s first AI leasing marketplace – Rentelligence. Sign up now using my link and enjoy rewards:`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white bg-[#000000] hover:bg-[#1DA1F2]/90 focus:ring-4 focus:outline-none focus:ring-[#1DA1F2]/50 font-medium rounded-lg text-sm px-2.5 py-1.5 text-center inline-flex items-center dark:focus:ring-[#1DA1F2]/55 me-2 mb-2"
          >
            <FaXTwitter className="w-4 h-4 me-2" />
            Twitter
          </a>
          <a
            href="/Rentall.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white bg-[#0088cc] hover:bg-[#0088cc]/90 focus:ring-4 focus:outline-none focus:ring-[#0088cc]/50 font-medium rounded-lg text-sm px-2.5 py-1.5 text-center inline-flex items-center dark:focus:ring-[#0088cc]/55 me-2 mb-2"
          >
            <FaFilePdf className="w-4 h-4 me-2" />
            PDF
          </a>
          {/* LinkedIn */}
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
              referralLink
            )} 💡 *Own, Rent & Profit from AI Agents!*
Join the world’s first AI leasing marketplace – Rentelligence.
Sign up now using my link and enjoy rewards:`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white bg-[#0077B5] hover:bg-[#0077B5]/90 focus:ring-4 focus:outline-none focus:ring-[#0077B5]/50 font-medium rounded-lg text-sm px-2.5 py-1.5 text-center inline-flex items-center dark:focus:ring-[#0077B5]/55 me-2 mb-2"
          >
            <svg
              className="w-4 h-4 me-2"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
            LinkedIn
          </a>

          {/* Telegram */}
          <a
            href={`https://t.me/share/url?url=${encodeURIComponent(
              referralLink
            )}&text=${encodeURIComponent(
              "💡 *Own, Rent & Profit from AI Agents!* Join the world’s first AI leasing marketplace – Rentelligence.Sign up now using my link and enjoy rewards"
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white bg-[#0088cc] hover:bg-[#0088cc]/90 focus:ring-4 focus:outline-none focus:ring-[#0088cc]/50 font-medium rounded-lg text-sm px-2.5 py-1.5 text-center inline-flex items-center dark:focus:ring-[#0088cc]/55 me-2 mb-2"
          >
            <FaTelegramPlane className="w-4 h-4 me-2" />
            Telegram
          </a>

          {/* Email */}
          <a
            href={`mailto:?subject=${encodeURIComponent(
              "🚀 *Work smarter with AI!* Join me on Rentelligence and start earning."
            )}&body=${encodeURIComponent(
              `Hi! I wanted to share this great opportunity with you. Join Rentelligence using my referral link and start earning rewards: ${referralLink}`
            )}`}
            className="text-white bg-[#34495e] hover:bg-[#34495e]/90 focus:ring-4 focus:outline-none focus:ring-[#34495e]/50 font-medium rounded-lg text-sm px-2.5 py-1.5 text-center inline-flex items-center me-2 mb-2"
          >
            <svg
              className="w-4 h-4 me-2"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
            </svg>
            Email
          </a>
        </div>
      </div>
    </div>
  );
};

export default ReferralLink;
