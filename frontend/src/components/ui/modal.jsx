import { BORDER, ROUNDED } from "../../styles/constents";

export default function AppModal({
  open,
  width = "max-w-3xl",
  children,
  Header,
  Footer,
  onClose,
  className,
}) {
  if (!open) return null;

  const HeaderComponent = Header;
  const FooterComponent = Footer;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center md:p-10"
      onClick={onClose} // Close when clicking outside modal
    >
      <div
        className={`bg-white ${ROUNDED} ${BORDER} shadow-xl max-h-screen overflow-y-auto overflow-x-hidden animate-fadeIn w-full scrollbar-hide ${width} ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {HeaderComponent && <HeaderComponent onClose={onClose} />}

        {/* Modal Body */}
        <div className="p-0">{children}</div>

        {/* Footer */}
        {FooterComponent && <FooterComponent />}
      </div>
    </div>
  );
}
