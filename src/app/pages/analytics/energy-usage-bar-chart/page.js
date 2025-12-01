"use client";
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";


const EnergyUsageBarChart = ({ data }) => {
  const slicedData = data?.slice(0,1);
  
  return (
    <div
      className="dark:bg-[#0d2a42] bg-white border"
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
        className="text-lg affiliate-card-header affiliate-card-text pl-5 pr-5 pt-3 pb-3 font-bold text-white"
      >
       All Agent Energy & CPU Usage
      </h2>
      <ResponsiveContainer className="pt-5" width="100%" height={400}>
        <BarChart
          data={slicedData}
          margin={{ top: 16, right: 24, left: 0, bottom: 16 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          {/* <XAxis dataKey="name" /> */}
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="energy" fill="#1976d2" name="Energy Used" />
          <Bar dataKey="cpu" fill="#4caf50" name="CPU Consumption" />
          <Bar dataKey="time" fill="#ff9800" name="Time Worked (min)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EnergyUsageBarChart;
