"use client";

import Image from "next/image";

interface AvatarProps {
  src?: string | null;
  alt?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeMap = {
  sm: { container: "w-8 h-8", icon: "w-4 h-4" },
  md: { container: "w-12 h-12", icon: "w-6 h-6" },
  lg: { container: "w-24 h-24", icon: "w-12 h-12" },
  xl: { container: "w-32 h-32", icon: "w-16 h-16" },
};

export default function Avatar({ src, alt = "Avatar", size = "md", className = "" }: AvatarProps) {
  const { container, icon } = sizeMap[size];

  return (
    <div className={`${container} rounded-full border-2 border-gray-200 overflow-hidden bg-gray-100 flex items-center justify-center ${className}`}>
      {src ? (
        <Image src={src} alt={alt} width={parseInt(container.split("w-")[1]?.split(" ")[0] || "12") * 4} height={parseInt(container.split("h-")[1] || "12") * 4} className="w-full h-full object-cover" />
      ) : (
        <svg className={`${icon} text-gray-400`} fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )}
    </div>
  );
}
