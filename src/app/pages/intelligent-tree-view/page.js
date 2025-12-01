"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import Tree from "react-d3-tree";
import { FaRegFile } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { getNetworkTree } from "@/app/redux/slices/communitySlice";
import { getEncryptedLocalData } from "@/app/api/auth";
import { usePathname } from "next/navigation";
import { getPageName } from "@/app/utils/utils";
import { NftSection } from "@/app/components/NftSection";
import toast from "react-hot-toast";

const buildTreeData = (data, collapsedNodes) => {
  if (!Array.isArray(data) || data.length === 0) return [];

  const uniqueData = data.filter(
    (node, index, self) =>
      index === self.findIndex((n) => n.Loginid === node.Loginid)
  );

  const nodeMap = new Map();
  uniqueData.forEach((node) => {
    const children = uniqueData.filter(
      (child) => child.SponsorId === node.Loginid
    );

    nodeMap.set(node.Loginid, {
      name: node.Name,
      loginid: node.Loginid,
      attributes: {
        sponsor: node.SponsorId,
        downline: children.length,
        email: node.Email,
        regDate: node.RegDate,
        leaseAmount: node.LeaseAmount,
        urank: node.Urank,
        teamBusiness: node.TeamBusiness,
        activeTeam: node.ActiveTeam,
        directBusiness: node.DirectBusiness,
        topupDate: node.TopupDate,
        totalTeam: node.TotalTeam,
        mobile: node.Mobile,
        uLvl: node.uLvl,
      },
      children: [],
      __rd3t: {
        collapsed: collapsedNodes.get(node.Loginid) ?? true,
      },
    });
  });

  const roots = [];
  uniqueData.forEach((node) => {
    if (node.SponsorId && nodeMap.has(node.SponsorId)) {
      nodeMap.get(node.SponsorId).children.push(nodeMap.get(node.Loginid));
    } else {
      roots.push(nodeMap.get(node.Loginid));
    }
  });

  // ✅ Root expanded, first level children expanded, everything else collapsed
  roots.forEach((root) => {
    root.__rd3t.collapsed = false; // root expanded

    // Expand only first level children
    root.children.forEach((firstLevelChild) => {
      firstLevelChild.__rd3t.collapsed = false; // first level visible

      // Collapse all deeper levels
      const collapseAllChildren = (node) => {
        node.children.forEach((child) => {
          child.__rd3t.collapsed = true;
          collapseAllChildren(child);
        });
      };
      collapseAllChildren(firstLevelChild);
    });
  });

  return roots;
};

const CustomNode = ({ nodeDatum, toggleNode }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ top: 10, left: 0 });
  const nodeRef = useRef(null);

  const leaseAmount = nodeDatum.attributes?.leaseAmount || 0;
  const headerColor = leaseAmount > 0 ? "bg-green-500" : "bg-red-500";

  const formatAmount = (amount) => {
    const num = parseFloat(amount);
    return num % 1 === 0 ? num.toString() : num.toString();
  };

  const handleMouseEnter = () => {
    if (nodeRef.current) {
      const rect = nodeRef.current.getBoundingClientRect();
      setTooltipPos({
        top: rect.top + window.scrollY - 60,
        left: rect.left + window.scrollX + 80,
      });
    }
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  const handleCopyClick = (loginid) => {
    const nodeData = {
      userName: loginid,
      //  name: nodeDatum.name,
      //  sponsor: nodeDatum.attributes?.sponsor || "None",
      //  downline: nodeDatum.attributes?.downline || 0,
      //  team: nodeDatum.attributes?.team || 0,
      //  email: nodeDatum.attributes?.email || "",
      //  regDate: nodeDatum.attributes?.regDate || "",
      //  urank: nodeDatum.attributes?.urank || "",
      //  teamBusiness: nodeDatum.attributes?.teamBusiness || 0,
      //  activeTeam: nodeDatum.attributes?.activeTeam || 0,
      //  directBusiness: nodeDatum.attributes?.directBusiness || 0,
      //  topupDate: nodeDatum.attributes?.topupDate || "",
      //  totalTeam: nodeDatum.attributes?.totalTeam || 0,
      //  mobile: nodeDatum.attributes?.mobile || "",
      //  uLvl: nodeDatum.attributes?.uLvl || 0,
    };

    const dataString = Object.entries(nodeData)
      .map(([key, value]) => `${key}: ${value}`)
      .join("\n");

    navigator.clipboard
      .writeText(dataString)
      .then(() => {
        toast.success("data copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
        toast.error("Failed to copy data");
      });
  };

  return (
    <foreignObject
      width={200}
      height={220}
      x={-100}
      y={-110}
      className="flex justify-center items-center"
      pointerEvents="none"
    >
      <div
        ref={nodeRef}
        style={{ pointerEvents: "auto" }}
        className="relative bg-gray-50 top-10  border shadow-md rounded-xl"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseOver={handleMouseEnter}
        onMouseOut={handleMouseLeave}
      >
        {/* Header */}
        <div
          className={`text-white rounded-t-xl flex  gap-10 px-3 py-2 ${headerColor}`}
        >
          <button
            className="hover:text-gray-200"
            onClick={ () => handleCopyClick(nodeDatum.loginid || "")}
          >
            <FaRegFile />
          </button>
          <span className="text-sm font-medium  px-2 py-0.5 rounded cursor-default select-text">
            {nodeDatum.loginid || ""}
          </span>
        </div>

        {/* Name below header */}

        <p className="text-xs text-gray-600 px-3 font-bold py-1 text-center">
          {nodeDatum.name}
        </p>

        <p className="text-xs text-gray-500 px-3 py-1 text-center">
          Lease Amount:{" "}
          <span className="font-bold text-gray-600">
            ${formatAmount(nodeDatum.attributes?.leaseAmount || 0)}
          </span>
        </p>

        <p className="text-xs text-gray-500 px-3 py-1 text-center">
          Team:{" "}
          <span className="font-bold text-gray-600">
            {nodeDatum.attributes?.totalTeam || 0}
          </span>
        </p>

        {/* Expand/Collapse Buttons */}
        {nodeDatum.children && nodeDatum.children.length > 0 && (
          <div className="text-center mb-2">
            {nodeDatum.__rd3t?.collapsed ? (
              <button
                className="mt-2 px-3 py-1 bg-purple-500 text-white rounded-lg text-sm hover:bg-purple-600"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleNode();
                }}
              >
                Expand +
              </button>
            ) : (
              <button
                className="mt-2 px-3 py-1 bg-gray-500 text-white rounded-lg text-sm hover:bg-gray-600"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleNode();
                }}
              >
                Collapse -
              </button>
            )}
          </div>
        )}

        {/* Tooltip */}
        {showTooltip &&
          createPortal(
            <div
              style={{
                position: "absolute",
                top: tooltipPos.top,
                left: tooltipPos.left,
                width: 260,
                height: 160,
                backgroundColor: "black",
                color: "white",
                fontSize: "0.75rem",
                borderRadius: "0.5rem",
                padding: "0.75rem",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                zIndex: 9999,
                overflowY: "auto",
              }}
            >
              <p>Reg Date: {nodeDatum.attributes?.regDate || ""}</p>
              <p>SponsorId: {nodeDatum.attributes?.sponsor || "None"}</p>
              {/* <p>Active Direct: {nodeDatum.attributes?.downline || 0}</p> */}
              <p>
                Direct Business: $
                {formatAmount(nodeDatum.attributes?.directBusiness || 0)}
              </p>
              <p>Active Team: {nodeDatum.attributes?.activeTeam || 0}</p>
              <p>Team Buss.: ${nodeDatum.attributes?.teamBusiness || 0}</p>
              <p>AFLB Rank: {nodeDatum.attributes?.urank || ""}</p>
            </div>,
            document.body
          )}
      </div>
    </foreignObject>
  );
};

export default function IntelligentTreeView() {
  const dispatch = useDispatch();
  const { getNetworkTreeData } = useSelector((state) => state.community);
  const containerRef = useRef(null);
  const [translate, setTranslate] = useState({ x: 400, y: 100 });
  const [collapsedNodes, setCollapsedNodes] = useState(new Map());
  const pathname = usePathname();
  const pageName = getPageName(pathname);

  const treeData = useMemo(
    () =>
      buildTreeData(
        Array.isArray(getNetworkTreeData)
          ? getNetworkTreeData
          : getNetworkTreeData || [],
        collapsedNodes
      ),
    [getNetworkTreeData, collapsedNodes]
  );

  useEffect(() => {
    const AuthLogin = getEncryptedLocalData("AuthLogin");
    dispatch(getNetworkTree(AuthLogin));
  }, [dispatch]);

  useEffect(() => {
    if (treeData && treeData.length > 0 && containerRef.current) {
      const newTranslateX = containerRef.current.offsetWidth / 2;
      const newTranslateY = 100;
      if (translate.x !== newTranslateX || translate.y !== newTranslateY) {
        setTranslate({ x: newTranslateX, y: newTranslateY });
      }
    }
  }, [treeData, translate]);

  return (
    <>
      <NftSection pageName={pageName} />
      <div className="px-6 rounded-lg">
        <div
          ref={containerRef}
          className="w-full h-screen flex  items-center justify-center bg-gray-100"
        >
          {treeData && treeData.length > 0 && (
            <Tree
              data={treeData}
              translate={translate}
              orientation="vertical"
              renderCustomNodeElement={(rd3tProps) => (
                <CustomNode {...rd3tProps} />
              )}
              pathFunc="diagonal"
              nodeSize={{ x: 250, y: 300 }}
              zoomable={true}
              draggable={true}
              onNodeToggle={(node, toggled) => {
                setCollapsedNodes((prev) =>
                  new Map(prev).set(node.loginid, toggled)
                );
              }}
              initialDepth={1}
            />
          )}
        </div>
      </div>
    </>
  );
}
