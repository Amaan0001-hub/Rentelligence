"use client";

import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getRechargeTransactBYTId } from "@/app/redux/slices/walletReportSlice";
import {
  CheckCircle2,
  XCircle,
  Clock,
  UserX,
  Download,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { NftSection } from "@/app/components/NftSection";
import { getPageName } from "@/app/utils/utils";
import { motion } from "framer-motion";
import { getUserId, getEncryptedLocalData } from "@/app/api/auth";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function MyAgents() {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const pageName = getPageName(pathname);
  const { walletData, loading } = useSelector((state) => state.wallet);
  const [generatingPDFs, setGeneratingPDFs] = useState({});
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const invoiceRefs = useRef({});

  useEffect(() => {
    dispatch(getRechargeTransactBYTId(getUserId() || ""));
    setCustomerName(getEncryptedLocalData("FName") || "");
    setCustomerEmail(getEncryptedLocalData("emailId") || "");
  }, [dispatch]);

  const getStatusBadge = (statusCode) => {
    switch (statusCode) {
      case 1:
        return {
          icon: <CheckCircle2 className="w-4 h-4" />,
          text: "Available",
          bg: "bg-emerald-500/10",
          textColor: "text-emerald-600",
          border: "border-emerald-500/20",
        };
      case 0:
        return {
          icon: <XCircle className="w-4 h-4" />,
          text: "Unavailable",
          bg: "bg-rose-500/10",
          textColor: "text-rose-600",
          border: "border-rose-500/20",
        };
      default:
        return {
          icon: <Clock className="w-4 h-4" />,
          text: "Pending",
          bg: "bg-amber-500/10",
          textColor: "text-amber-600",
          border: "border-amber-500/20",
        };
    }
  };

  const downloadInvoice = async (agent) => {
    if (generatingPDFs[agent.RechargeId]) return;
    
    // Set loading state for this specific agent
    setGeneratingPDFs(prev => ({...prev, [agent.RechargeId]: true}));

    try {
      const node = invoiceRefs.current[agent.RechargeId];
      if (!node) return;

      // Create a clone of the invoice node
      const clonedNode = node.cloneNode(true);
      clonedNode.style.display = "block";
      clonedNode.style.position = "absolute";
      clonedNode.style.left = "-9999px";
      document.body.appendChild(clonedNode);

      // Wait a moment for any images to load
      await new Promise(resolve => setTimeout(resolve, 500));

      const canvas = await html2canvas(clonedNode, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
      });

      document.body.removeChild(clonedNode);

      if (!canvas) {
        throw new Error("Canvas generation failed");
      }

      const imgData = canvas.toDataURL("image/png", 1.0);
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight);
      pdf.save(`invoice-${agent.RechargeId}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      // Fallback to simple PDF
      const pdf = new jsPDF();
      pdf.setFontSize(16);
      pdf.text("Invoice", 105, 15, { align: "center" });
      pdf.setFontSize(12);
      pdf.text(`Order ID: ${agent.RechargeId}`, 20, 30);
      pdf.text(`Product: ${agent.ProductName}`, 20, 40);
      pdf.text(`Total: $${agent.Rkprice}`, 20, 50);
      pdf.text(`Customer: ${customerName}`, 20, 60);
      pdf.text(`Email: ${customerEmail}`, 20, 70);
      pdf.save(`invoice-${agent.RechargeId}.pdf`);
    } finally {
      // Clear loading state for this specific agent
      setGeneratingPDFs(prev => ({...prev, [agent.RechargeId]: false}));
    }
  };

  const generateOrderId = (agent) => {
    return `${agent.RechargeId}`;
  };

  return (
    <>
      <NftSection pageName={pageName} />
      <div className="w-full px-4 pb-10 space-y-6 md:px-8">
        {!loading &&
        (!walletData?.incomeTransTypes ||
          walletData?.incomeTransTypes.length === 0) ? (
          <div className="flex items-center justify-center h-[60vh]">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="flex flex-col items-center p-10 text-center bg-white border border-gray-200 shadow-xl dark:bg-gray-900 dark:border-white rounded-2xl"
            >
              <UserX className="w-12 h-12 mb-4 text-gray-400" />
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 ">
                No Agents Found
              </h2>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                Try adjusting your filters or search criteria.
              </p>
            </motion.div>
          </div>
        ) : (
          walletData?.incomeTransTypes?.map((agent, index) => {
            const status = getStatusBadge(agent.statusCode);
            const orderId = generateOrderId(agent);
            const isGenerating = generatingPDFs[agent.RechargeId];

            return (
              <motion.div
                key={`${agent.RechargeId}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="relative overflow-hidden transition-shadow duration-300 bg-white border border-gray-200 shadow-sm group rounded-2xl dark:border-white dark:bg-gray-900 hover:shadow-md"
              >
                <div className="flex flex-col h-full md:flex-row">
                  <div className="relative w-full h-auto md:w-1/3 lg:w-2/5 lg:h-[357px]">
                    <img
                      src={agent.image || "/default-agent.png"}
                      fill
                      alt={agent.ProductName}
                      className="object-cover w-full h-full"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>

                  {/* Content on Right */}
                  <div className="flex flex-col w-full p-6 md:w-2/3 lg:w-3/5">
                    {/* Title and Description */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-bold text-gray-600 dark:text-white">
                          {agent.ProductName}
                        </h3>
                        <button 
                          onClick={() => downloadInvoice(agent)}
                          className="flex items-center px-3 py-2 th-btn sm:px-4 sm:py-2 sm:text-base style2" 
                          style={{ width: "auto" }}
                          disabled={isGenerating}
                        >
                          {isGenerating ? (
                            <span>Generating...</span>
                          ) : (
                            <>
                              <Download className="w-4 h-4 mr-1" />
                              Download Invoice
                            </>
                          )}
                        </button>
                      </div>
                      <p className="mt-2 text-gray-500 dark:text-gray-400">
                        {agent.subName}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <div className="p-4 transition-colors duration-200 rounded-lg shadow-sm bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50">
                        <div className="text-sm text-blue-600 dark:text-blue-400">
                          Lease Amount
                        </div>
                        <div className="text-xl font-bold text-blue-700 dark:text-blue-300">
                          ${agent.Rkprice?.toLocaleString() || "N/A"}
                        </div>
                      </div>
                      <div className="p-4 transition-colors duration-200 rounded-lg shadow-sm bg-green-50 dark:bg-green-900/30 hover:bg-green-100 dark:hover:bg-green-900/50">
                        <div className="text-sm text-green-600 dark:text-green-400">
                         Weekly Rental Yield
                        </div>
                        <div className="text-xl font-bold text-green-700 dark:text-green-300">
                          ${agent.WeeklyReturn?.toLocaleString() || "N/A"}
                        </div>
                      </div>
                      <div className="p-4 transition-colors duration-200 rounded-lg shadow-sm bg-purple-50 dark:bg-purple-900/30 hover:bg-purple-100 dark:hover:bg-purple-900/50">
                        <div className="text-sm text-purple-600 dark:text-purple-400">
                          Rating
                        </div>
                        <div className="text-xl font-bold text-purple-700 dark:text-purple-300">
                          {agent.rating ? `${agent.rating}.0` : "N/A"}
                        </div>
                      </div>
                    </div>

                    {/* Detailed Information */}
                    <div className="relative grid grid-cols-1 gap-4 p-5 mt-4 bg-gray-100 rounded-lg shadow-sm dark:border-white dark:border sm:grid-cols-2 dark:bg-gray-800/30">
                      {/* Left Section */}
                      <div className="px-4 space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-teal-600 dark:text-teal-400">
                            Lease Start Date:
                          </span>
                          <span className="font-medium text-teal-800 dark:text-teal-200">
                            {agent.CreatedDate || "0"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-orange-600 dark:text-orange-400">
                            UNIT:
                          </span>
                          <span className="font-medium text-orange-800 dark:text-orange-200">
                            {agent.Unit || "0"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-pink-600 dark:text-pink-400">
                            Lease Hour:
                          </span>
                          <span className="font-medium text-pink-800 dark:text-pink-200">
                            {agent.PerHour || "0"}
                          </span>
                        </div>
                      </div>

                      {/* Right Section */}
                      <div className="space-y-3">
                        <div className="flex justify-between px-4">
                          <span className="text-sm text-indigo-600 dark:text-indigo-400">
                            Total Rental Yield: 
                          </span>
                          <span className="font-medium text-indigo-800 dark:text-indigo-200">
                            ${agent.TotalReturn?.toLocaleString() || "0"}
                          </span>
                        </div>
                        <div className="flex justify-between px-4">
                          <span className="text-sm text-rose-600 dark:text-rose-400">
                            Weekly Rental Yield:
                          </span>
                          <span className="font-medium text-rose-800 dark:text-rose-200 truncate max-w-[150px]">
                            ${agent.WeeklyReturn || "N/A"}
                          </span>
                        </div>
                        <div className="flex justify-between px-4">
                          <span className="text-sm text-cyan-600 dark:text-cyan-400">
                            Lease Period:
                          </span>
                          <span className="font-medium text-cyan-800 dark:text-cyan-200 truncate max-w-[150px]">
                            {agent.TOATALMONTH || "N/A"} Month
                          </span>
                        </div>
                      </div>

                      {/* Vertical Divider - hidden on mobile, shown on sm+ */}
                      <div className="absolute hidden w-px bg-gray-300 sm:block top-5 bottom-5 left-1/2 dark:bg-gray-600" />
                    </div>
                  </div>
                </div>

                {/* Hidden invoice template for PDF generation */}
                <div 
                  ref={el => invoiceRefs.current[agent.RechargeId] = el} 
                  className="hidden"
                >
                  <div className="mx-auto bg-white text-gray-900 shadow-md rounded-md p-6 w-[794px] min-h-[1123px]">
                    {/* Logo */}
                    <div className="flex justify-center mb-4">
                      <img
                        src="/logo.png"
                        alt="Logo"
                        className="h-12"
                        crossOrigin="anonymous"
                      />
                    </div>

                    {/* Header */}
                    <div className="flex items-start justify-between pb-2 mb-4 border-b">
                      <div>
                        <h1 className="text-xl font-bold">Invoice</h1>
                        <p className="text-sm text-gray-600">Recharge ID: {orderId}</p>
                      </div>
                      <div className="text-right">
                        <h2 className="text-base font-semibold">AI Agent Marketplace</h2>
                        <p className="text-sm text-gray-600">
                          Invoice Date: {new Date().toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* Customer Info */}
                    <div className="flex justify-between mb-4 text-sm">
                      <div>
                        <p className="font-semibold">Billed To:</p>
                        <p>{customerName}</p>
                        <p>{customerEmail}</p>
                      </div>
                      <div className="text-right">
                        <p>Transaction Date:</p>
                        <p>{new Date().toLocaleString()}</p>
                      </div>
                    </div>

                    {/* Product */}
                    <div className="flex items-center p-3 mb-4 text-sm border rounded bg-gray-50">
                      {agent.image && (
                        <img
                          src={agent.image} 
                          alt={agent.ProductName}
                          className="object-cover w-12 h-12 mr-3 rounded"
                          crossOrigin="anonymous"
                          onError={(e) => (e.target.style.display = "none")}
                        />
                      )}
                      <div>
                        <p className="font-bold">{agent.ProductName}</p>
                        <p className="text-gray-600">AI Agent Subscription</p>
                      </div>
                    </div>

                    {/* Order Summary */}
                    <div className="p-3 mb-4 text-sm border rounded bg-gray-50">
                      <h3 className="mb-1 font-semibold">Order Details:</h3>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span>Subtotal:</span>
                          <span>${agent.Rkprice}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tax:</span>
                          <span>$0</span>
                        </div>
                        <div className="pt-2 mt-4 border-gray-300">
                          <div className="flex justify-between font-bold">
                            <span>Total:</span>
                            <span>${agent.Rkprice}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Subscription Info */}
                    <div className="p-3 mb-4 text-sm border rounded bg-gray-50">
                      <h3 className="mb-1 font-semibold">Subscription Information:</h3>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-gray-600">Start Date:</p>
                          <p>{agent.CreatedDate || new Date().toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Duration:</p>
                          <p>{agent.TOATALMONTH || "N/A"} months</p>
                        </div>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="p-3 mb-4 text-sm border rounded bg-gray-50">
                      <h3 className="mb-1 font-semibold">Features Included:</h3>
                      <ul className="pl-4 text-gray-700 list-disc">
                        <li>24/7 Availability</li>
                        <li>{agent.Task || "0"} tasks/hour limit</li>
                        <li>Email support</li>
                        <li>Performance analytics</li>
                      </ul>
                    </div>

                    {/* Footer */}
                    <div className="pt-2 text-xs text-center text-gray-500 border-t">
                      <p>Thank you for your business!</p>
                      <p>
                        For questions contact{" "}
                        <span className="font-medium">support@aiagentmarketplace.com</span>
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </>
  );
}