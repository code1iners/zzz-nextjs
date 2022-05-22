import { clazz } from "libs/clients/clazz";

interface WebHeaderProps {
  className?: string;
}

const WebHeader = ({ className }: WebHeaderProps) => {
  return (
    <header
      className={clazz(
        "fixed top-0 left-0 w-full h-[70px] grid grid-cols-12 items-center border-b border-gray-300",
        className ? className : ""
      )}
    >
      {/* Logo */}
      <span className="tracking-widest text-2xl col-start-1 col-end-3 justify-self-center cursor-pointer transition-colors hover:text-red-500 hover:scale-110">
        zzZ
      </span>

      {/* Menu icon */}
      <div className="col-start-12 col-end-13 justify-self-center hover:text-red-500 transition-colors">
        <button className="cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default WebHeader;