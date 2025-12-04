import {
  colClasses,
  mdColClasses,
  xlColClasses,
} from "../../../styles/constents";

export default function ReusableGrid({
  data = [],
  renderItem,
  cols = 1,
  mdCols = 2,
  xlCols = 4,
  className = "",
  height = "h-[calc(100vh-30vh)]",
}) {
  const base = colClasses[cols] || "grid-cols-1";
  const md = mdColClasses[mdCols] || "";
  const xl = xlColClasses[xlCols] || "";

  return (
    <div
      className={`grid ${base} ${md} ${xl} gap-3 p-3 ${height} overflow-y-auto scrollbar-hide ${className}`}
    >
      {data?.map((item, index) => renderItem(item, index))}
    </div>
  );
}
