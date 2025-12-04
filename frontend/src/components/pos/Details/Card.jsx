// import { CircleAlert, ShoppingCart } from "lucide-react";

// function DetailsCard({ item, idx }) {
//   const isLowStock = (item) => item?.stockQty <= 5;

//   return (
//     <div
//       key={idx}
//       className={`flex flex-col items-center justify-start gap-2 cursor-pointer relative rounded-md bg-yellow-100 shadow hover:shadow-lg hover:bg-yellow-300 border border-yellow-400 transition text-xs md:text-[10px] 2xl:text-sm
//         xs-full-card

//         ${isLowStock(item) ? "pt-5" : "py-5"}
//       `}
//     >
//       {/* Price Tag */}
//       <div className="absolute left-2 -top-2 -rotate-6 bg-green-500 text-white rounded px-2 py-1 text-xs font-bold shadow">
//         {item?.retailRate?.toFixed(3)}
//       </div>

//       {/* Cart Icon */}
//       <ShoppingCart className="text-yellow-700 w-5 h-5" />

//       {/* Item name */}
//       <div className="text-center max-w-20 font-semibold text-gray-700">
//         {item?.name}
//       </div>

//       {/* Low Stock bar */}
//       {isLowStock(item) && (
//         <div className="w-full mt-auto bg-red-500 text-white text-xs py-1 px-2 font-semibold rounded-b-md flex items-center justify-center">
//           <CircleAlert className="w-4 h-4 mr-1" />
//           Low Stock
//         </div>
//       )}
//     </div>
//   );
// }

// export default DetailsCard;

import { CircleAlert, ShoppingCart } from "lucide-react";
import React from "react";

function DetailsCard({ item, idx }) {
  const isLowStock = (item) => item?.stockQty <= 5;

  return (
    <div
      key={idx}
      className={`flex flex-col items-center justify-between gap-2 cursor-pointer relative rounded-md bg-yellow-100 shadow hover:shadow-lg hover:bg-yellow-300 border border-yellow-400 transition text-xs md:text-[10px] 2xl:text-sm h-full md:h-28 2xl:h-32 `}
    >
      {/* Price Tag */}
      <div className="absolute left-2 -top-2 -rotate-6 bg-green-500 text-white rounded px-2 py-1 text-xs font-bold shadow">
        {item?.retailRate?.toFixed(3)}
      </div>

      {/* Main Content Area - Centers vertically */}
      <div className="flex flex-col items-center justify-center gap-2 flex-grow pt-3">
        {/* Cart Icon */}
        <ShoppingCart className="text-yellow-700 w-5 h-5" />

        {/* Item name */}
        <div className="text-center max-w-20 font-semibold text-gray-700 uppercase">
          {item?.name}
        </div>
      </div>

      {/* Low Stock bar - Always reserves space at bottom */}
      <div
        className={`w-full ${
          isLowStock(item) ? "bg-red-500 text-white" : "bg-transparent"
        } text-xs py-1 px-2 font-semibold rounded-b-md flex items-center justify-center min-h-[28px]`}
      >
        {isLowStock(item) && (
          <>
            <CircleAlert className="w-4 h-4 mr-1" />
            Low Stock
          </>
        )}
      </div>
    </div>
  );
}

export default DetailsCard;
