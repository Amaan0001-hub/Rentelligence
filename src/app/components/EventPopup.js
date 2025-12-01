"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function EventPopup({ show, onClose, imageUrl }) {
  const popupRef = useRef(null);

  const handleOverlayClick = (e) => {
    if (popupRef.current && !popupRef.current.contains(e.target)) {
      onClose();
    }
  };

  const popupVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
  };

  const transition = {
    duration: 1.5,
    ease: "easeInOut",
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70"
          onClick={handleOverlayClick}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={popupVariants}
          transition={transition}
        >
          <motion.div
            ref={popupRef}
            className="relative w-full max-w-lg p-4 bg-white rounded-lg shadow-lg"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={popupVariants}
            transition={transition}
          >
            <button
              onClick={onClose}
              aria-label="Close popup"
              className="absolute top-0 text-gray-600 right-2 hover:text-gray-900"
            >
              &#x2715;
            </button>
            <Image
              src={imageUrl}
              alt="Event"
              loading="lazy"
              width={600}
              height={400}
              className="object-contain rounded-md"
              style={{ maxHeight: "600px", height: "auto" }}
            />
            <Link
              href="/pages/event-booking#featured-events"
              className="text-white th-btn style2 width-event"
            >
              Book Now
            </Link>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
