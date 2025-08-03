import React from "react";

export default function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-black dark:bg-gray-900 h-screen flex items-center justify-center overflow-hidden">
      <div className="w-full">{children}</div>
    </div>
  );
}
