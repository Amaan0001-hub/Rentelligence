"use client";
import React from "react";
import { motion } from "framer-motion";

export default function Loader() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
    >
      <motion.div
        animate={{
          rotate: 360,
          scale: [1, 1.1, 1],
        }}
        transition={{
          rotate: {
            repeat: Infinity,
            ease: "linear",
            duration: 1,
          },
          scale: {
            repeat: Infinity,
            ease: "easeInOut",
            duration: 1.5,
          },
        }}
        className="relative w-20 h-20"
      >
        {/*  spinner */}
        <div
          className="absolute inset-0 rounded-full border-4 border-transparent border-t-transparent"
          style={{
            background:
              "conic-gradient(from 0deg at 50% 50%, transparent 0%, #4F46E5 30%, #EC4899 70%, transparent 100%)",
            WebkitMask:
              "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
            padding: "4px",
          }}
        ></div>

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-indigo-500 to-pink-500"></div>
        </div>
      </motion.div>
    </motion.div>
  );
}
