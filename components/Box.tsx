"use client";
import Link from "next/link";
import { twMerge } from "tailwind-merge";

interface BoxProps {
  content: string;
  href: string;
  className?: string;
}

const Box: React.FC<BoxProps> = ({ href, className, content }) => {
  return (
    <div className="pl-4 pr-4 ml-2 mr-2">
      <Link
        href={href}
        passHref
        className={twMerge(
          `
      rounded-lg 
      h-fit 
      w-full
      `,
          className
        )}
      >
        {content}
      </Link>
    </div>
  );
};

export default Box;
