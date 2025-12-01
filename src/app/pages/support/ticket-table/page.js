"use client";
import { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  getPaginationRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { getAllTicketBYURID, getAdminReplyCount, updateAdminReplyCount } from "@/app/redux/slices/ticketSlice";
import { getEncryptedLocalData } from "@/app/api/auth";
import TicketDetailModal from "./TicketDetailModal";
// import TicketDetailModal from "../../ticket-table/TicketDetailModal";

export default function TicketTable() {
  const dispatch = useDispatch();
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = getEncryptedLocalData("UserId");
      console.log("storedUserId from localStorage:", storedUserId); // Debug log
      if (storedUserId) {
        setUserId(storedUserId);
      } else {
        console.log("No UserId found in localStorage");
      }
    }
  }, []);
  const { getAllTicketDataNew, adminReplyCounts } = useSelector((state) => state.ticket) || {}
  console.log(adminReplyCounts)


  const ticketData = useMemo(
    () => getAllTicketDataNew || [],
    [getAllTicketDataNew]
  );

  useEffect(() => {
    // ✅ Only fetch once userId is available and not loaded yet
    if (!isLoaded && userId) {
      dispatch(getAllTicketBYURID(userId));
      setIsLoaded(true);
    }
  }, [dispatch, userId, isLoaded]);

  useEffect(() => {
    if (userId && ticketData.length > 0) {
      ticketData.forEach((ticket) => {
        if (ticket.StatusType === "Open") {
          dispatch(getAdminReplyCount({ urid: userId, ticketId: ticket.TicketId }));
        }
      });
    }
  }, [dispatch, userId, ticketData]);

  // Save reply counts to localStorage whenever adminReplyCounts changes
  useEffect(() => {
    if (adminReplyCounts) {
      const existingCounts = JSON.parse(localStorage.getItem('replyCounts') || '{}');
      const updatedCounts = { ...existingCounts, ...adminReplyCounts };
      localStorage.setItem('replyCounts', JSON.stringify(updatedCounts));
    }
  }, [adminReplyCounts]);

  const columnHelper = createColumnHelper();

  const columns = useMemo(
    () => [
      columnHelper.accessor((row, idx) => idx + 1, {
        id: "sno",
        header: "S.No.",
        cell: (info) => info.getValue(),
      }),
      columnHelper.display({
        id: "action",
        header: "Action",
        cell: (info) => {
          const row = info.row.original;
          const storedCounts = JSON.parse(localStorage.getItem('replyCounts') || '{}');
          const replyCount = storedCounts[row.TicketId]?.adminReplyCount?.[0]?.ReplyCount || 0;
          return (
            <div className="relative flex justify-center items-center">
              {row.StatusType === "Open" && (
                <button
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  onClick={async () => {
                    setSelectedTicket(row);
                    setModalOpen(true);
                    await dispatch(updateAdminReplyCount({ urid: row.URID, ticketId: row.TicketId }));
                    // Update localStorage after updating reply count
                    const updatedCounts = JSON.parse(localStorage.getItem('replyCounts') || '{}');
                    updatedCounts[row.TicketId] = { adminReplyCount: [{ ReplyCount: 0 }] }; // Reset to 0 after opening
                    localStorage.setItem('replyCounts', JSON.stringify(updatedCounts));
                    dispatch(getAllTicketBYURID(userId));
                  }}
                >
                  Reply
                </button>
              )}
              {replyCount > 0 && (
                <span className="absolute  -top-3 right-10   bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {replyCount}
                </span>
              )}
            </div>
          );
        },
      }),
      columnHelper.accessor("TicketType", {
        header: "Ticket Type",
        cell: (info) =>
          info.getValue() === "Payment" ? "User Transfer" : info.getValue(),
      }),
      columnHelper.accessor("StatusType", {
        header: "Status",
        cell: (info) => (
          <span
            className={
              info.getValue() === "Open"
                ? "text-green-600 font-semibold"
                : "text-red-600 font-semibold"
            }
          >
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor("Subject", {
        header: "Subject",
      }),
      columnHelper.accessor("CreatedDate", {
        header: "Time",
        cell: (info) => info.getValue() || "",
      }),

    ],
    []
  );

  const table = useReactTable({
    data: ticketData,
    columns,
    state: { globalFilter },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: "includesString",
    onGlobalFilterChange: setGlobalFilter,
  });

  return (
    <div className="dark:bg-[#0e1830]">
      <div className="w-full mt-1">
        <div className="border rounded-lg mt-4 dark:border-[#ffffff] dark:bg-[#10192a]">
          <h1 className="pt-4 pb-4 pl-4 text-gray-600 text-md font-semibold dark:text-white">
            Support Tickets
          </h1>
          <hr />
          <div className="px-4 my-4">
            <div className="w-full overflow-x-auto rounded-lg pt-4 transition-colors">
              {/* Controls */}
              <div className="flex gap-6 justify-between items-center mb-4 px-4">
                <div className="flex items-center gap-2">
                  <select
                    className="border p-1 text-sm rounded text-black focus:outline-none"
                    value={table.getState().pagination.pageSize}
                    onChange={(e) => table.setPageSize(Number(e.target.value))}
                  >
                    {[10, 25, 50, 100].map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600 dark:text-white">
                    Search:
                  </label>
                  <input
                    type="search"
                    className="border p-1 text-sm rounded text-black dark:text-black focus:outline-none"
                    value={globalFilter ?? ""}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    placeholder="Search..."
                  />
                </div>
              </div>

              {/* Table */}
              <table className="min-w-full text-sm">
                {table.getHeaderGroups().length > 0 && (
                  <thead className="text-[#4f5862] dark:text-white border-b border-[#ecedec]">
                    {table.getHeaderGroups().map((headerGroup) => (
                      <tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <th key={header.id} className="p-2">
                            {header.isPlaceholder ? null : (
                              <div className="flex justify-center">
                                {flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                              </div>
                            )}
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                )}
                <tbody>
                  {table.getRowModel().rows.length > 0 ? (
                    table.getRowModel().rows.map((row, idx) => (
                      <tr
                        key={row.id}
                        className="text-gray-600 dark:text-white border-b border-[#ecedec]"
                        onClick={() => {
                          if (row.original.active) {
                            setSelectedTicket(row.original);
                            setModalOpen(true);
                          }
                        }}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <td key={cell.id} className="p-2 text-center">
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={columns.length}
                        className="p-4 text-center text-gray-600 dark:text-white"
                      >
                        No tickets found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="flex gap-6 justify-between items-center mt-4 px-4 pb-4">
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {table.getFilteredRowModel().rows.length > 0
                    ? `Showing ${table.getState().pagination.pageIndex *
                    table.getState().pagination.pageSize +
                    1
                    } to ${Math.min(
                      (table.getState().pagination.pageIndex + 1) *
                      table.getState().pagination.pageSize,
                      table.getFilteredRowModel().rows.length
                    )} of ${table.getFilteredRowModel().rows.length} entries`
                    : "No entries"}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => table.setPageIndex(0)}
                    disabled={!table.getCanPreviousPage()}
                    className="px-2 py-1 rounded text-gray-600 dark:text-white dark:bg-[#0d3b66]"
                  >
                    «
                  </button>
                  <button
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    className="px-2 py-1 rounded text-gray-600 dark:text-white dark:bg-[#0d3b66]"
                  >
                    ‹
                  </button>
                  <button
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    className="px-2 py-1 rounded text-gray-600 dark:text-white dark:bg-[#0d3b66]"
                  >
                    ›
                  </button>
                  <button
                    onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                    disabled={!table.getCanNextPage()}
                    className="px-2 py-1 rounded text-gray-600 dark:text-white dark:bg-[#0d3b66]"
                  >
                    »
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {modalOpen && selectedTicket && (
        <TicketDetailModal
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setSelectedTicket(null);
          }}
          ticket={selectedTicket}
        />
      )}
    </div>
  );
}
