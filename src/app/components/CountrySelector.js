"use client";

import React from 'react';

const COUNTRIES = [
  { code: 'US', name: 'United States', timezone: 'America/New_York' },
  { code: 'GB', name: 'United Kingdom', timezone: 'Europe/London' },
  { code: 'JP', name: 'Japan', timezone: 'Asia/Tokyo' },
  { code: 'AU', name: 'Australia', timezone: 'Australia/Sydney' },
  { code: 'CA', name: 'Canada', timezone: 'America/Toronto' },
  { code: 'DE', name: 'Germany', timezone: 'Europe/Berlin' },
  { code: 'FR', name: 'France', timezone: 'Europe/Paris' },
  { code: 'IN', name: 'India', timezone: 'Asia/Kolkata' },
  { code: 'CN', name: 'China', timezone: 'Asia/Shanghai' },
  { code: 'BR', name: 'Brazil', timezone: 'America/Sao_Paulo' },
];

const CountrySelector = ({ selectedCountry, onCountryChange }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Select Country for Timezone
      </label>
      <select
        value={selectedCountry}
        onChange={(e) => onCountryChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
      >
        <option value="">Select Country</option>
        {COUNTRIES.map((country) => (
          <option key={country.code} value={country.code}>
            {country.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CountrySelector;
