"use client";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { getUserId } from "@/app/api/auth";
import { getAllCommonChartDataByURID } from "@/app/redux/slices/productSlice";

const COLOR_MAP = {
  DataAnalysis: "#4285F4",
  MlTraining: "#0F9D58",
  CodeGen: "#A142F4",
  NLP: "#FBBC05",
  Other: "#EA4335",
};

const EnergyUsagePieChart = () => {
  const dispatch = useDispatch();
  const { getAllCommonChartData } = useSelector((state) => state.product);
  useEffect(() => {
    dispatch(getAllCommonChartDataByURID(getUserId()));
  }, [dispatch]);

  const chartDataRaw = getAllCommonChartData?.chartData ?? {};

  
  const ENERGY_CATEGORIES = [
    { name: "DataAnalysis", value: chartDataRaw[0]?.DataAnalysis || 0, color: COLOR_MAP.DataAnalysis },
    { name: "MlTraining", value: chartDataRaw[0]?.MlTraining || 0, color: COLOR_MAP.MlTraining },
    { name: "CodeGen", value: chartDataRaw[0]?.CodeGen || 0, color: COLOR_MAP.CodeGen },
    { name: "NLP", value: chartDataRaw[0]?.NLP || 0, color: COLOR_MAP.NLP },
    { name: "Other", value: chartDataRaw[0]?.Other || 0, color: COLOR_MAP.Other },
  ];

  const total = ENERGY_CATEGORIES.reduce((sum, cat) => sum + cat.value, 0);

  return (
    <div>
      <div
        className="dark:bg-[#0d2a42] border"
        style={{
          borderRadius: 12,
          boxShadow: "0 2px 8px #eee",
          marginBottom: 32,
        }}
      >
        <h2
          style={{
            borderTopLeftRadius: "inherit",
            borderTopRightRadius: "inherit",
          }}
          className="pt-3 pb-3 pl-5 pr-5 text-lg font-bold text-white affiliate-card-header affiliate-card-text"
        >
          Energy Usage Distribution
        </h2>

        <ResponsiveContainer className="z-20 p-12" width="100%" height={320}>
          <PieChart>
            <Pie
              data={ENERGY_CATEGORIES}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={120}
              fill="#8884d8"
              label={({ name, value }) =>
                `${name}: ${value}%`
              }
            >
              {ENERGY_CATEGORIES.map((entry, index) => (
              
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value, name) => [`${value}%`, name]} />
          </PieChart>
        </ResponsiveContainer>

        <div style={{ marginTop: 24 }} className="pb-16 pl-10 pr-10">
          {ENERGY_CATEGORIES.map((cat) => (
            <div
              key={cat.name}
              style={{ display: "flex", alignItems: "center", marginBottom: 8 }}
            >
              <div
                style={{
                  width: 16,
                  height: 16,
                  background: cat.color,
                  borderRadius: 8,
                  marginRight: 12,
                }}
              ></div>
              <span
                className="text-[#333] dark:text-[#fff]"
                style={{ fontSize: 16, width: 120, display: "inline-block" }}
              >
                {cat.name}
              </span>
              <span
                className="text-[#222] dark:text-[#fff]"
                style={{ fontWeight: "bold", fontSize: 16 }}
              >
                {total > 0 ? cat.value : 0}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default React.memo(EnergyUsagePieChart);
