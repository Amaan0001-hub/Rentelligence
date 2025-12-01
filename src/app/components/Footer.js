"use client";
import Link from "next/link";
import LanguageTranslate from "./LanguageTranslate";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-10 px-6 transition-colors duration-300 hero-2 card footer-card-div">
     <div className=" position-div  max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-5 sm:grid-cols-2 md:grid-cols-5 gap-8">
        <div>
          <h2 className="position-div text-lg font-semibold mb-4 text-white dark:text-gray-100 transition-colors duration-300">Company</h2>
          <ul className="space-y-2 footer-list">
            <li><Link href="https://rentelligence.ai/main" className="text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-gray-100 hover:underline transition-colors duration-200">About Us</Link></li>
            <li><Link href="https://rentelligence.ai/Category" className="text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-gray-100 hover:underline transition-colors duration-200">Category</Link></li>
            <li><Link href="https://rentelligence.ai/main/service" className="text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-gray-100 hover:underline transition-colors duration-200">Services</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="position-div text-lg font-semibold mb-4 text-white dark:text-gray-100 transition-colors duration-300">Support</h2>
          <ul className="space-y-2 footer-list">
            <li><Link href="#" className="text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-gray-100 hover:underline transition-colors duration-200">Help Center</Link></li>
            <li><Link href="https://rentelligence.ai/Contact" className="text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-gray-100 hover:underline transition-colors duration-200">Contact Us</Link></li>
            <li><Link href="#" className="text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-gray-100 hover:underline transition-colors duration-200">FAQs</Link></li>
          </ul>
        </div>
        <div>
          <h2 className=" position-div text-lg font-semibold mb-4 text-white dark:text-gray-100 transition-colors duration-300">Legal</h2>
          <ul className="space-y-2 footer-list">
            <li><Link href="https://rentelligence.ai/Privacypolicy" className="text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-gray-100 hover:underline transition-colors duration-200">Privacy Policy</Link></li>
            <li><Link href="https://rentelligence.ai/TermsCondition" className="text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-gray-100 hover:underline transition-colors duration-200">Terms of Service</Link></li>
            <li><Link href="#" className="text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-gray-100 hover:underline transition-colors duration-200">Cookie Policy</Link></li>
          </ul>
        </div>

        <div>
          <h2 className="position-div text-lg font-semibold mb-4 text-white dark:text-gray-100 transition-colors duration-300">Follow Us</h2>
          <ul className="space-y-2 footer-list">
            <li><Link href="https://x.com/" className="text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-gray-100 hover:underline transition-colors duration-200">Twitter</Link></li>
            <li><Link href="https://www.facebook.com/rentelligenceai" className="text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-gray-100 hover:underline transition-colors duration-200">Facebook</Link></li>
            <li><Link href="https://www.instagram.com/rentelligence.ai" className="text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-gray-100 hover:underline transition-colors duration-200">Instagram</Link></li>
          </ul>
        </div>

        <div>
          <h2 className="position-div text-lg font-semibold mb-4  text-white dark:text-gray-100 transition-colors duration-300">Language</h2>
          <div className="mt-4 rounded-t-lg  rounded-br-lg">
            <LanguageTranslate />
          </div>
        </div>
      </div>

      <div className="footer-list position-div mt-8 border-t border-gray-700 dark:border-gray-800 pt-6 text-center text-sm text-gray-400 dark:text-gray-500 transition-colors duration-300">
        © {new Date().getFullYear()} Rentelligence. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;