import { forwardRef } from "react";
import { buttonStyles, buttonVariants } from "../../styles/constents";

const Button = forwardRef(({ className, variant, size, ...props }, ref) => {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      className={buttonVariants({ variant, size, className })}
      ref={ref}
      {...props}
    />
  );
});

function ControlButton({
  label,
  icon = null,
  type = "yellow",
  className = "",
  ...props
}) {
  return (
    <button
      className={`
        flex flex-col justify-center items-center cursor-pointer w-full  rounded-md shadow-md hover:shadow-lg px-5 py-2 text-sm font-semibold transition-all duration-150 select-none
        ${buttonStyles[type]}
        ${className}`}
      {...props}
    >
      {icon && <span className="mb-1 text-xl">{icon}</span>}
      <span className="text-nowrap text-xs 2xl:text-sm">{label}</span>
    </button>
  );
}

export { Button, buttonVariants, ControlButton };
