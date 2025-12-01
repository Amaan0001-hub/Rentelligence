"use client";
import React, { useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPersonalTeamList, getRank } from "@/app/redux/slices/communitySlice";
import { getEncryptedLocalData } from "@/app/api/auth";

const TreeNode = ({ node, allNodes = [], level = 0 }) => {
  const [expanded, setExpanded] = useState(level < 2);

  const children = allNodes
    .filter(child => child.sponsorId === node.loginid)
    .filter((child, index, self) =>
      index === self.findIndex(c => c.loginid === child.loginid)
    );

  return (
    <div className="relative pl-6">
      {level > 0 && (
        <span className="absolute left-0 top-0 h-full w-0.5 bg-purple-200"></span>
      )}
      <div
        className="bg-gradient-to-br from-purple-50 via-white to-blue-50 rounded-2xl shadow-lg p-5 mb-6 border-l-4 border-purple-400 min-w-[270px] transition-transform hover:scale-[1.025] hover:shadow-2xl duration-200"
      >
        <div className="flex items-center gap-3">
          {children.length > 0 && (
            <button
              onClick={() => setExpanded(e => !e)}
              className="flex items-center justify-center font-bold text-purple-600 transition-colors bg-white border-2 border-purple-300 rounded-full shadow-sm w-7 h-7 focus:outline-none hover:bg-purple-100"
              title={expanded ? 'Collapse' : 'Expand'}
            >
              {expanded ? '-' : '+'}
            </button>
          )}
          <div>
            <div className="text-lg font-extrabold tracking-wide text-gray-800">{node.name}</div>
            <div className="font-mono text-xs text-purple-500">{node.loginid}</div>
          </div>
        </div>
        <div className="flex flex-col gap-1 mt-3 text-sm text-gray-700">
          {node.email && (
            <span>
              <span className="font-medium text-gray-500">Email:</span> {node.email}
            </span>
          )}
          <span>
            <span className="font-medium text-gray-500">SponsorId:</span> {node.sponsorId}
          </span>
          <span>
            <span className="font-medium text-gray-500">Date:</span>{" "}
            {node.regDate}
          </span>
          <span>
            <span className="font-medium text-gray-500">Lease Amount:</span>{" "}
            {Number(node?.leaseAmount) > 0
              ? `$${Number(node.leaseAmount).toFixed(2)}`
              : '$0'}
          </span>
          <span>
            <span className="font-medium text-gray-500">Rank:</span>{" "}
            {node.urank}
          </span>
          <span>
            <span className="font-medium text-gray-500">Team Buss.:</span>{" "}
            {Number(node?.teamBusiness) > 0
              ? `$${Number(node.teamBusiness).toFixed(2)}`
              : '$0'}
          </span>
        </div>
      </div>
      {/* Children */}
      {expanded && children.length > 0 && (
        <div className="pl-4 ml-8 border-l-2 border-purple-200">
          {children.map((child) => (
            <TreeNode
              key={`${child.loginid}-${child.sponsorId}`}
              node={child}
              allNodes={allNodes}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const RankSelector = ({ selectedRankId, setSelectedRankId, rankData }) => {
  const [selectWidth, setSelectWidth] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const spanRef = useRef(null);

  useEffect(() => {
    if (spanRef.current) {
      setSelectWidth(spanRef.current.offsetWidth + 40);
    }
  }, [selectedRankId, rankData]);

  const selectedRank = rankData?.find(rank => rank.rankId.toString() === selectedRankId) || null;
  const selectedLabel = selectedRankId === "" ? "Select Rank" : selectedRank?.uRank || "Select Rank";

  return (
    <div className="flex items-center gap-2 mr-2">
      <span
        ref={spanRef}
        className="absolute top-0 left-0 invisible px-2 text-sm font-semibold sm:text-base"
        style={{ whiteSpace: "pre" }}
      >
        {selectedLabel}
      </span>

      <div className="relative">
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="relative flex items-center justify-between px-3 py-2 sm:px-4 sm:py-2.5 bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 rounded-xl cursor-pointer transition-all duration-300 hover:border-purple-400 hover:shadow-lg hover:shadow-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:ring-opacity-50 min-w-[120px] sm:min-w-[140px]"
          style={{ width: selectWidth }}
        >
          <span className={`text-xs sm:text-sm font-medium transition-colors duration-200 ${selectedRankId === ""
              ? "text-gray-400"
              : "text-purple-700 font-semibold"
            }`}>
            {selectedLabel}
          </span>

          <div className={`ml-1 sm:ml-2 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
            <svg
              className="w-3 h-3 text-purple-500 sm:w-4 sm:h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>

          <div className="absolute inset-0 transition-opacity duration-300 opacity-0 pointer-events-none rounded-xl bg-gradient-to-r from-purple-400 to-blue-400 hover:opacity-20"></div>
        </div>

        {isOpen && (
          <div className="absolute left-0 right-0 z-50 mt-1 overflow-y-auto bg-white border-2 border-purple-200 shadow-xl sm:mt-2 top-full rounded-xl max-h-60 scrollbar-thin scrollbar-thumb-purple-300 scrollbar-track-transparent">
            {rankData?.map((rankItem) => (
              <div
                key={rankItem.rankId}
                onClick={() => {
                  setSelectedRankId(rankItem.rankId.toString());
                  setIsOpen(false);
                }}
                className="px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm text-purple-700 font-medium cursor-pointer transition-all duration-200 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 hover:text-purple-800 border-b border-gray-100 last:border-b-0"
              >
                {rankItem.uRank}
              </div>
            ))}
          </div>
        )}
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

const PageSizeSelector = ({ pageSize, setPageSize }) => {
  const levels = Array.from({ length: 20 }, (_, i) => i + 1);
  const [selectWidth, setSelectWidth] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const spanRef = useRef(null);

  useEffect(() => {
    if (spanRef.current) {
      setSelectWidth(spanRef.current.offsetWidth + 40);
    }
  }, [pageSize]);

  const selectedLabel = pageSize === "" ? "Select Level" : `${pageSize}`;

  return (
    <div className="flex items-center gap-2 mr-2">
      <span
        ref={spanRef}
        className="absolute top-0 left-0 invisible px-2 text-sm font-semibold sm:text-base"
        style={{ whiteSpace: "pre" }}
      >
        {selectedLabel}
      </span>

      <div className="relative">
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="relative flex items-center justify-between px-3 py-2 sm:px-4 sm:py-2.5 bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 rounded-xl cursor-pointer transition-all duration-300 hover:border-purple-400 hover:shadow-lg hover:shadow-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:ring-opacity-50 min-w-[120px] sm:min-w-[140px]"
          style={{ width: selectWidth }}
        >
          <span className={`text-xs sm:text-sm font-medium transition-colors duration-200 ${pageSize === ""
              ? "text-gray-400"
              : "text-purple-700 font-semibold"
            }`}>
            {selectedLabel}
          </span>

          <div className={`ml-1 sm:ml-2 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
            <svg
              className="w-3 h-3 text-purple-500 sm:w-4 sm:h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>

          <div className="absolute inset-0 transition-opacity duration-300 opacity-0 pointer-events-none rounded-xl bg-gradient-to-r from-purple-400 to-blue-400 hover:opacity-20"></div>
        </div>

        {isOpen && (
          <div className="absolute left-0 right-0 z-50 mt-1 overflow-y-auto bg-white border-2 border-purple-200 shadow-xl sm:mt-2 top-full rounded-xl max-h-60 scrollbar-thin scrollbar-thumb-purple-300 scrollbar-track-transparent">
            {levels.map((num) => (
              <div
                key={num}
                onClick={() => {
                  setPageSize(num.toString());
                  setIsOpen(false);
                }}
                className="px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm text-purple-700 font-medium cursor-pointer transition-all duration-200 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 hover:text-purple-800 border-b border-gray-100 last:border-b-0"
              >
                {num}
              </div>
            ))}
          </div>
        )}
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

const DownlineAffilates = () => {
  const dispatch = useDispatch();
  const { personalTeamList, loading, error, rank } = useSelector(
    (state) => state.community
  );

  const [pageSize, setPageSize] = useState("");
  const [selectedRankId, setSelectedRankId] = useState("");

  const buildHierarchy = (data) => {
    if (!Array.isArray(data)) return [];

    const uniqueData = data.filter((node, index, self) =>
      index === self.findIndex(n => n.loginid === node.loginid)
    );

    const rootNodes = uniqueData.filter(node => {
      return !uniqueData.some(n => n.loginid === node.sponsorId);
    });

    return rootNodes.length > 0 ? rootNodes : uniqueData;
  };

  const processedData = buildHierarchy(
    Array.isArray(personalTeamList)
      ? personalTeamList
      : personalTeamList?.data || []
  );

  useEffect(() => {
    dispatch(getRank());
  }, [dispatch]);

  useEffect(() => {
    const AuthLogin = getEncryptedLocalData("AuthLogin");
    const data = {
      authLogin: AuthLogin || "",
      uRank: selectedRankId,
      lvl: pageSize,
      statusid: "",
    };
    dispatch(getPersonalTeamList(data));
  }, [dispatch, selectedRankId, pageSize]);

  return (
    <div className="flex bg-transparent">
      <div className="flex flex-col w-full dark:bg-[#111827] bg-white border shadow-xl rounded-2xl">
        <h2
          style={{
            borderTopLeftRadius: "inherit",
            borderTopRightRadius: "inherit",
          }}
          className="flex flex-col pt-3 pb-3 pl-3 pr-3 text-lg font-bold text-white sm:flex-row sm:items-center sm:justify-between sm:pl-5 sm:pr-5 affiliate-card-header affiliate-card-text rounded-t-2xl"
        >
          <span className="mb-2 text-base font-bold text-white sm:text-lg sm:mb-0">Team Growth Matrix</span>
          <div className="flex items-center gap-1 sm:gap-2">
            <RankSelector
              selectedRankId={selectedRankId}
              setSelectedRankId={setSelectedRankId}
              rankData={rank?.data || rank}
            />
            <PageSizeSelector pageSize={pageSize} setPageSize={setPageSize} />
          </div>
        </h2>

        <div className="w-full pb-6 sm:pb-10 pl-3 pr-3 sm:pl-10 sm:pr-10 mb-6 sm:mb-12 overflow-y-auto h-[calc(100vh-200px)] sm:h-96">
          {loading && (
            <div className="text-center text-blue-600">Loading...</div>
          )}
          {error && <div className="text-center text-red-600">{error}</div>}
          {!loading && processedData.length === 0 && (
            <div className="text-center text-gray-500">No data found.</div>
          )}
          {processedData && processedData.length > 0 && (
            <div className="mt-2 sm:mt-4">
              {processedData.map((root) => (
                <TreeNode
                  key={`root-${root.loginid}`}
                  node={root}
                  allNodes={Array.isArray(personalTeamList) ? personalTeamList : personalTeamList?.data || []}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DownlineAffilates;