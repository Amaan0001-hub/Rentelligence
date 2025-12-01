"use client";

import React, { useEffect, useMemo, useState } from 'react';
import * as d3 from 'd3-hierarchy';
import { useDispatch, useSelector } from 'react-redux';
import { getNetworkTree } from '@/app/redux/slices/communitySlice';
import { getEncryptedLocalData } from '@/app/api/auth';

const CollapsibleTree = ({ width = 800, height = 500 }) => {
  const dispatch = useDispatch();
  const { getNetworkTreeData } = useSelector((state) => state.community);
  const [data, setData] = useState(null);

  // Build hierarchical tree from flat network data
  const buildHierarchy = (flatData) => {
    if (!Array.isArray(flatData) || flatData.length === 0) return null;

    const uniqueData = flatData.filter((node, index, self) => index === self.findIndex((n) => n.Loginid === node.Loginid));

    const nodeMap = new Map();
    uniqueData.forEach((node) => {
      nodeMap.set(node.Loginid, {
        name: node.Name,
        loginid: node.Loginid,
        children: [],
      });
    });

    const roots = [];
    uniqueData.forEach((node) => {
      const current = nodeMap.get(node.Loginid);
      if (node.SponsorId && nodeMap.has(node.SponsorId)) {
        nodeMap.get(node.SponsorId).children.push(current);
      } else {
        roots.push(current);
      }
    });

    // If multiple roots, wrap in a virtual root
    if (roots.length === 1) {
      return roots[0];
    }
    return { name: 'Network', children: roots };
  };

  // Initialize collapsed state: root and first level expanded, deeper collapsed
  function initializeCollapsedState(node, depth = 0) {
    if (!node) return null;
    const hasChildren = Array.isArray(node.children) && node.children.length > 0;
    const collapsed = depth >= 2; // collapse depth 2+
    return {
      ...node,
      collapsed,
      hasChildren,
      ...(hasChildren && {
        children: node.children.map((child) => initializeCollapsedState(child, depth + 1))
      })
    };
  }

  useEffect(() => {
    const AuthLogin = getEncryptedLocalData('AuthLogin');
    dispatch(getNetworkTree(AuthLogin));
  }, [dispatch]);

  useEffect(() => {
    const hierarchy = buildHierarchy(getNetworkTreeData);
    if (hierarchy) {
      setData(initializeCollapsedState(hierarchy));
    }
  }, [getNetworkTreeData]);
  
  // Defer rendering decision until after all hooks are declared to keep hook order consistent

  // Toggle node collapse state
  const toggleNode = (nodePath) => {
    setData(prevData => {
      const updateNode = (currentNode, pathIndex) => {
        if (pathIndex === nodePath.length) {
          // Found the target node - toggle collapsed state
          return {
            ...currentNode,
            collapsed: !currentNode.collapsed
          };
        }
        
        if (currentNode.children) {
          return {
            ...currentNode,
            children: currentNode.children.map((child, index) => 
              index === nodePath[pathIndex] ? updateNode(child, pathIndex + 1) : child
            )
          };
        }
        
        return currentNode;
      };
      
      return updateNode(prevData, 0);
    });
  };

  // Filter data for layout - hide children when collapsed
  const getDataForLayout = (node) => {
    if (!node) return null;
    if (node.collapsed) {
      // Return node without children for layout
      const { children, ...nodeWithoutChildren } = node;
      return nodeWithoutChildren;
    }
    
    if (node.children) {
      return {
        ...node,
        children: node.children.map(getDataForLayout)
      };
    }
    
    return node;
  };

  const dataForLayout = useMemo(() => getDataForLayout(data), [data]);

  // Use d3-hierarchy to calculate the tree layout
  const root = useMemo(() => {
    try {
      const hierarchy = d3.hierarchy(dataForLayout);
      const treeLayout = d3.tree().size([width - 150, height - 100]);
      return treeLayout(hierarchy);
    } catch (error) {
      console.error('Error creating tree layout:', error);
      return null;
    }
  }, [dataForLayout, width, height]);

  // Generate lines (links) for the tree
  const links = useMemo(() => {
    if (!root) return [];
    return root.links().map((link, i) => (
      <path
        key={i}
        d={`M ${link.source.x} ${link.source.y}
             C ${link.source.x} ${(link.source.y + link.target.y) / 2},
               ${link.target.x} ${(link.source.y + link.target.y) / 2},
               ${link.target.x} ${link.target.y}`}
        fill="none"
        stroke="#999"
        strokeWidth="1.5"
        strokeOpacity="0.6"
      />
    ));
  }, [root]);

  // Find original node in data structure
  const findOriginalNode = useMemo(() => {
    const finder = (currentNode, path) => {
      if (path.length === 0) return currentNode;
      if (currentNode.children && currentNode.children.length > path[0]) {
        return finder(currentNode.children[path[0]], path.slice(1));
      }
      return null;
    };
    return finder;
  }, []);

  // Get path for a D3 node
  const getNodePath = (d3Node) => {
    const path = [];
    let current = d3Node;
    while (current.parent) {
      const parentIndex = current.parent.children.indexOf(current);
      if (parentIndex >= 0) {
        path.unshift(parentIndex);
      }
      current = current.parent;
    }
    return path;
  };

  // Generate nodes for the tree
  const nodes = useMemo(() => {
    if (!root) return [];
    
    return root.descendants().map((node, i) => {
      const path = getNodePath(node);
      const originalNode = findOriginalNode(data, path);
      
      if (!originalNode) return null;

      const hasChildren = originalNode.hasChildren;
      const isCollapsed = originalNode.collapsed;

      return (
        <g 
          key={i} 
          transform={`translate(${node.x}, ${node.y})`}
          onClick={(e) => {
            e.stopPropagation();
            if (hasChildren) {
              toggleNode(path);
            }
          }}
          style={{ cursor: hasChildren ? 'pointer' : 'default' }}
        >
          {/* Node circle */}
          <circle 
            r={10} 
            fill={hasChildren ? (isCollapsed ? '#ff7f0e' : '#1f77b4') : '#2ca02c'}
            stroke="white" 
            strokeWidth="2" 
          />
          
          {/* Expand/collapse indicator */}
          {hasChildren && (
            <text
              x={0}
              y={5}
              textAnchor="middle"
              fontSize="12px"
              fontFamily="Arial"
              fill="white"
              fontWeight="bold"
            >
              {isCollapsed ? '+' : '−'}
            </text>
          )}
          
          {/* Node label */}
          <text
            x={15}
            y={5}
            textAnchor="start"
            fontSize="14px"
            fontFamily="sans-serif"
            fill="#333"
            className="node-label"
          >
            {node.data.name}
          </text>
        </g>
      );
    }).filter(Boolean);
  }, [root, data, findOriginalNode, toggleNode]);

  if (!root) {
    return <div>Loading tree...</div>;
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <svg width={width} height={height}>
        <g transform="translate(75, 50)">
          {links}
          {nodes}
        </g>
      </svg>
      
    </div>
  );
};

export default CollapsibleTree;