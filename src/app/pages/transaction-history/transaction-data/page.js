

"use client"

import { useEffect, useState } from "react"

import { gettransactionhistory } from "@/app/redux/slices/walletReportSlice"
import { useDispatch, useSelector } from "react-redux"
import React from "react"
import { getUserId } from "@/app/api/auth"

export default function TransactionData({ transType }) {
    const dispatch = useDispatch()
    const { transactionhistorydata } = useSelector((state) => state.wallet);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    useEffect(() => {
        const userId = getUserId();
        const data = {
            urid: userId,
            transtype: transType
        };
        dispatch(gettransactionhistory(data));
    }, [transType, dispatch]);

    // Filter transactions based on search term
    const filteredTransactions = transactionhistorydata?.filter(transaction => 
        transaction.Remark?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.message?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    // Calculate pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredTransactions.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reset to first page when search changes
    };

    return (
        <div className="wallet-reports-container">
            <div className="mt-3 overflow-hidden border border-gray-200 rounded-xl">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-600 dark:text-white">
                        Income Report
                    </h3>
                    <div className="flex items-center space-x-4">
                       <span>Search:</span>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search transactions..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm("")}
                                    className="absolute text-gray-400 transform -translate-y-1/2 right-2 top-1/2 hover:text-gray-600 dark:hover:text-gray-300"
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-200 shadow-sm rounded-xl">
                        <thead>
                            <tr>
                                <th className="px-6 py-3 text-sm font-semibold tracking-wider text-center text-gray-600 border-b border-gray-200 dark:text-white">
                                    #
                                </th>
                                <th className="px-6 py-3 text-sm font-semibold tracking-wider text-center text-gray-600 border-b border-gray-200 whitespace-nowrap dark:text-white">
                                    Date
                                </th>
                                <th className="px-6 py-3 text-sm font-semibold tracking-wider text-center text-gray-600 border-b border-gray-200 dark:text-white">
                                    Credit
                                </th>
                                
                                <th className="px-6 py-3 text-sm font-semibold tracking-wider text-center text-gray-600 border-b border-gray-200 whitespace-nowrap dark:text-white">
                                    Remark
                                </th>
                                
                                
                                <th className="px-6 py-3 text-sm font-semibold tracking-wider text-center text-gray-600 border-b border-gray-200 whitespace-nowrap dark:text-white">
                                    Message
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {currentItems.length > 0 ? (
                                currentItems.map((rank, index) => (
                                    <tr key={index + indexOfFirstItem} className="transition-colors">
                                        <td className="px-6 py-4 text-sm text-center text-gray-900 border-b border-gray-100 dark:text-white whitespace-nowrap">
                                            {indexOfFirstItem + index + 1}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-center text-gray-600 border-b border-gray-100 dark:text-white whitespace-nowrap">
                                            {rank.CreatedDate || "-"}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-center text-green-500 border-b border-gray-100 dark:text-white whitespace-nowrap">
                                            ${rank?.credit || "0.00"}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-center text-gray-600 border-b border-gray-100 dark:text-white whitespace-nowrap">
                                            {rank.Remark || "-"}
                                        </td>
                                         
                                        <td className="px-6 py-4 text-sm font-medium text-center text-gray-600 border-b border-gray-100 dark:text-white whitespace-nowrap">
                                            {rank.message || "-"}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-4 text-sm text-center text-gray-500 dark:text-gray-400">
                                        {searchTerm ? "No transactions found matching your search." : "No transactions available."}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                {filteredTransactions.length > itemsPerPage && (
                    <div className="flex flex-col items-center justify-between gap-2 px-2 pb-4 mt-4 sm:flex-row sm:px-4">
                        <div className="text-sm text-gray-600 dark:text-white">
                            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredTransactions.length)} of {filteredTransactions.length} transactions
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                className="px-2 py-1 rounded text-gray-600 dark:text-white dark:bg-[#0d3b66] hover:scale-110 transition-transform"
                                onClick={() => paginate(1)}
                                disabled={currentPage === 1}
                            >
                                «
                            </button>
                            <button
                                className="px-2 py-1 rounded text-gray-600 dark:text-white dark:bg-[#0d3b66] hover:scale-110 transition-transform"
                                onClick={() => paginate(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                ‹
                            </button>
                            <button
                                className="px-2 py-1 rounded text-gray-600 dark:text-white dark:bg-[#0d3b66] hover:scale-110 transition-transform"
                                onClick={() => paginate(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            >
                                ›
                            </button>
                            <button
                                className="px-2 py-1 rounded text-gray-600 dark:text-white dark:bg-[#0d3b66] hover:scale-110 transition-transform"
                                onClick={() => paginate(totalPages)}
                                disabled={currentPage === totalPages}
                            >
                                »
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
