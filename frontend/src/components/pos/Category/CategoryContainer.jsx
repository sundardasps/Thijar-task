import HeaderTab from "../common/Header";
import ReusableGrid from "../common/Grid";
import CategoryCards from "./Cards";
import { useCategories } from "../../../hooks/useCategories";
import { useProducts } from "../../../context/ProductContext";

function CategoryContainer() {
  const { data: category } = useCategories();

  const { categoryId, setCategoryId } = useProducts();

  const handleCategoryClick = (cat, index) => {
    const id = index === 0 ? "" : cat?._id;
    setCategoryId(id);
  };

  return (
    <div className="w-xs lg:w-[40%]">
      <HeaderTab title="Item Category" />

      <ReusableGrid
        data={category?.items}
        cols={1}
        mdCols={2}
        xlCols={2}
        className="border-x-2 border-gray-300"
        renderItem={(cat, index) => {
          const id = index === 0 ? "" : cat?._id;
          const isActive = categoryId === id;

          return (
            <CategoryCards
              key={index}
              onClick={() => handleCategoryClick(cat, index)}
              category={index === 0 ? "All Items" : cat?.name}
              className={
                isActive
                  ? "bg-blue-900 text-white"
                  : "bg-blue-300/40 text-black"
              }
            />
          );
        }}
      />
    </div>
  );
}

export default CategoryContainer;
