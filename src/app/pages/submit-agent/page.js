"use client";

import { useState } from "react";

export default function SubmitAgent() {
  const [formData, setFormData] = useState({
    contractHash: "",
    description: "",
    agentName: "",
    capabilities: "",
    category: "",
    energyRequirement: 100,
    leasePrice: 100,
    billingPeriod: "Monthly",
    agreedToTerms: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-white dark:bg-gray-900 transition-colors duration-300">
      <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-gray-900 dark:text-gray-100 transition-colors duration-300">Submit New AI Agent</h1>
      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6 transition-colors duration-300">
        Upload your AI agent to the marketplace via NFT verification
      </p>

      <div className="card p-4 sm:p-6 transition-all duration-300">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100 transition-colors duration-300">Agent Submission Form</h2>

        <div className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 p-3 sm:p-4 rounded mb-6 transition-colors duration-300">
          <p className="text-sm sm:text-base font-medium text-gray-800 dark:text-gray-200 transition-colors duration-300">
            🛡️ <strong>NFT Verification Required:</strong> Provide your NFT contract hash to verify ownership and authenticity of your AI agent.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label className="block mb-1 text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">NFT Contract Hash *</label>
            <input
              type="text"
              name="contractHash"
              value={formData.contractHash}
              onChange={handleChange}
              placeholder="0x..."
              className="input-field w-full text-sm sm:text-base"
            />
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
              The contract hash of your NFT that proves ownership of this agent
            </p>
          </div>

          <div>
            <label className="block mb-1 text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your agent's capabilities and use cases"
              className="input-field w-full text-sm sm:text-base h-24 resize-none"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">Agent Name *</label>
            <input
              type="text"
              name="agentName"
              value={formData.agentName}
              onChange={handleChange}
              placeholder="Enter agent name"
              className="input-field w-full text-sm sm:text-base"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">Capabilities (Tags)</label>
            <input
              type="text"
              name="capabilities"
              value={formData.capabilities}
              onChange={handleChange}
              placeholder="machine-learning, data-analysis, python"
              className="input-field w-full text-sm sm:text-base"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="input-field w-full text-sm sm:text-base"
            >
              <option value="">Select category</option>
              <option value="Data Science">Data Science</option>
              <option value="Finance">Finance</option>
              <option value="Healthcare">Healthcare</option>
              {/* Add more categories as needed */}
            </select>
          </div>

          <div>
            <label className="block mb-1 text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">Lease Price *</label>
            <input
              type="number"
              name="leasePrice"
              value={formData.leasePrice}
              onChange={handleChange}
              className="input-field w-full text-sm sm:text-base"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">Billing Period</label>
            <select
              name="billingPeriod"
              value={formData.billingPeriod}
              onChange={handleChange}
              className="input-field w-full text-sm sm:text-base"
            >
              <option value="Monthly">Monthly</option>
              <option value="Weekly">Weekly</option>
              <option value="Yearly">Yearly</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">Energy Requirement (per hour) *</label>
            <input
              type="number"
              name="energyRequirement"
              value={formData.energyRequirement}
              onChange={handleChange}
              className="input-field w-full text-sm sm:text-base"
            />
          </div>
        </div>

        <div className="mt-4 sm:mt-6">
          <label className="inline-flex items-center text-sm sm:text-base text-gray-700 dark:text-gray-300 transition-colors duration-300">
            <input
              type="checkbox"
              name="agreedToTerms"
              checked={formData.agreedToTerms}
              onChange={handleChange}
              className="mr-3 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            I agree to the Terms of Service and confirm that I own the rights to this AI agent
          </label>
        </div>

        <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
          <button className="btn-secondary px-3 sm:px-4 py-2 text-sm sm:text-base">
            Save Draft
          </button>
          <button className="btn-primary px-3 sm:px-4 py-2 text-sm sm:text-base">
            Submit for Review
          </button>
        </div>
      </div>
    </div>
  );
}