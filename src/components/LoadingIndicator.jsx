import React from 'react';

export default function LoadingIndicator({ message = 'Loading...' }) {
  return (
    <div className="flex justify-center items-center h-full">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-2 text-gray-500 text-sm">{message}</p>
      </div>
    </div>
  );
}