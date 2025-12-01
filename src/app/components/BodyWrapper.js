
'use client';

import React from 'react';

export default function BodyWrapper({ children, className }) {
  return (
    <body
      className={className}
      // disable right click
      onContextMenu={(e) => e.preventDefault()}
    >
      {children}
    </body>
  );
}
