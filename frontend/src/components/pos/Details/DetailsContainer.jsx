// import { useRef, useCallback } from "react";
// import HeaderTab from "../common/Header";
// import ReusableGrid from "../common/Grid";
// import DetailsCard from "./Card";
// import { useAuth } from "../../../context/AuthContext";
// import { useProducts } from "../../../context/ProductContext";
// import { useSales } from "../../../context/SalesContext";

// function DetailsContainer() {
//   const { logout } = useAuth();

//   const { products, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
//     useProducts();

//   const { addItemToTable } = useSales();

//   const observerRef = useRef(null);

//   const lastElementRef = useCallback(
//     (node) => {
//       if (isFetchingNextPage) return;

//       if (observerRef.current) observerRef.current.disconnect();

//       observerRef.current = new IntersectionObserver((entries) => {
//         if (entries[0].isIntersecting && hasNextPage) {
//           fetchNextPage();
//         }
//       });

//       if (node) observerRef.current.observe(node);
//     },
//     [isFetchingNextPage, hasNextPage, fetchNextPage]
//   );

//   return (
//     <div className="w-full lg:w-[70%]">
//       <HeaderTab title="Item Details" showIcons onLogout={logout} />

//       {/* Loading state */}
//       {status === "loading" && (
//         <div className="p-4 text-center text-gray-500">Loading products...</div>
//       )}

//       {/* Product Grid */}

//       <ReusableGrid
//         data={products}
//         cols={1}
//         mdCols={3}
//         xlCols={4}
//         renderItem={(item, index) => {
//           const isLast = index === products.length - 1;

//           return (
//             <div
//               key={item?._id}
//               ref={isLast ? lastElementRef : null}
//               onClick={() => addItemToTable(item)}
//             >
//               <DetailsCard item={item} />
//             </div>
//           );
//         }}
//       />

//       {/* Loading more... */}
//       {isFetchingNextPage && (
//         <div className="text-center py-4 text-gray-400 text-sm">
//           Loading more items...
//         </div>
//       )}

//       {/* No more data */}
//       {!hasNextPage && status === "success" && (
//         <div className="text-center py-4 text-gray-400 text-sm">
//           No more products.
//         </div>
//       )}
//     </div>
//   );
// }

// export default DetailsContainer;

import { useRef, useCallback } from "react";
import HeaderTab from "../common/Header";
import ReusableGrid from "../common/Grid";
import DetailsCard from "./Card";
import { useAuth } from "../../../context/AuthContext";
import { useProducts } from "../../../context/ProductContext";
import { useSales } from "../../../context/SalesContext";

function DetailsContainer() {
  const { logout } = useAuth();

  const { products, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useProducts();

  const { addItemToTable } = useSales();

  const observerRef = useRef(null);

  const lastElementRef = useCallback(
    (node) => {
      if (isFetchingNextPage) return;

      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [isFetchingNextPage, hasNextPage, fetchNextPage]
  );

  return (
    <div className="w-full lg:w-[70%] relative">
      <HeaderTab title="Item Details" showIcons onLogout={logout} />

      {/* Loading state */}
      {status === "loading" && (
        <div className="p-4 text-center text-gray-500">Loading products...</div>
      )}

      {/* No data available state */}
      {status === "success" && products.length === 0 && (
        <div className=" absolute left-0 right-0  top-[50%] p-4 text-center text-gray-500 ">No data available.</div>
      )}

      {/* Product Grid */}
      <ReusableGrid
        data={products}
        cols={1}
        mdCols={3}
        xlCols={4}
        renderItem={(item, index) => {
          const isLast = index === products.length - 1;

          return (
            <>
              <div
                key={item?._id}
                ref={isLast ? lastElementRef : null}
                onClick={() => addItemToTable(item)}
              >
                <DetailsCard item={item} />
              </div>

              {/* Loading more... - Show after last item */}
              {isLast && isFetchingNextPage && (
                <div className="col-span-full text-center py-4 text-gray-400 text-sm">
                  Loading more items...
                </div>
              )}

              {/* No more data - Show after last item */}
              {isLast && !hasNextPage && status === "success" && (
                <div className="col-span-full text-center py-4 text-gray-400 text-sm">
                  No more products.
                </div>
              )}
              
            </>
          );
        }}
      />
    </div>
  );
}

export default DetailsContainer;
