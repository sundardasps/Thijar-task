import { cva } from "class-variance-authority";

export const BORDER = "border border-gray-300 ";
export const ROUNDED = "rounded-md";
export const BACKGROUND = "bg-[#dcf6fc]";





export const CARD = "bg-white shadow rounded-lg p-4";
export const INPUT = "w-full border border-gray-300 rounded px-3 py-2";
export const BUTTON_PRIMARY ="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded";
export const TABLE_CELL = "px-3 py-2 border-b border-gray-200";
export const FLEX_BETWEEN = "flex items-center justify-between";



export const INPUT_BASE ="peer w-full shadow-xs border-1  border-gray-300 rounded-md px-3 py-2 text-black";

export const INPUT_FOCUS ="focus:outline-none focus:ring-[0.1px] focus:ring-blue-900 focus:border-blue-900";

export const INPUT_STYLE = `${INPUT_BASE} ${INPUT_FOCUS}`;


export const buttonVariants = cva(
  "inline-flex items-center  cursor-pointer justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 disabled:opacity-50 disabled:pointer-events-none ",
  {
    variants: {
      variant: {
        default: "bg-slate-900 text-slate-50 hover:bg-slate-900/90",
        destructive: "bg-red-500 text-slate-50 hover:bg-red-500/90",
        outline:
          "border border-slate-200 bg-white hover:bg-slate-100 hover:text-slate-900",
        secondary: "bg-slate-100 text-slate-900 hover:bg-slate-100/80",
        ghost: "hover:bg-slate-100 hover:text-slate-900",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export const buttonStyles = {
  yellow:
    "bg-[#FFF7BF] hover:bg-[#FFF3A3] text-[#444] border border-yellow-500",
  red: "bg-[#FF9E9E] hover:bg-[#FF8A8A] text-[#5b1b1b] border border-red-500",
  green:
    "bg-[#5CC41C] hover:bg-[#54b218] text-white border border-green-600 uppercase",
  blue: "bg-[#E3E8FF] hover:bg-[#D6DDFF] text-[#333] border border-indigo-200",
};


export const colClasses = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
};

export const mdColClasses = {
  1: "md:grid-cols-1",
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-4",
};

export const xlColClasses = {
  1: "xl:grid-cols-1",
  2: "xl:grid-cols-2",
  3: "xl:grid-cols-3",
  4: "xl:grid-cols-4",
};



export const CHECKBOX_CLASS = `
  w-5 h-5
  border border-gray-300 rounded-sm 
  shadow
  appearance-none
  checked:bg-blue-900 
  checked:before:content-['✓'] 
  checked:before:text-white 
  checked:before:text-[12px] 
  checked:before:flex 
  checked:before:items-center 
  checked:before:justify-center 
  checked:before:font-bold
  focus:outline-none focus:ring-0
`;