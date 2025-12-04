import React from "react";

function CategoryCards({ category, className, ...props }) {
  return (
    <div
      {...props}
      className={`
        w-full h-full flex
        items-center justify-center text-center
         rounded py-5
        border shadow-md  border-violet-300/50
        font-semibold text-xs 2xl:text-base  hover:bg-blue-900
      hover:text-white uppercase ${className}`}
    >
      {category}
    </div>
  );
}

export default CategoryCards;
