import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-200 py-4">
      <div className="container mx-auto px-4">
        <p className="text-center text-gray-500 text-xs">
          &copy; {new Date().getFullYear()} SecureFlow. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
