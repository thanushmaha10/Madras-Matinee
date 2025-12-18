import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { MenuIcon, SearchIcon, TicketPlus, XIcon } from "lucide-react";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showExtras, setShowExtras] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const { user } = useUser();
  const { openSignIn } = useClerk();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setShowExtras(false);
      } else {
        setShowExtras(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <div className="fixed top-0 left-0 z-50 flex w-full items-center justify-between px-6 py-5 md:px-16 lg:px-36">
      <Link
        to="/"
        className={`transition-all duration-300 ${
          showExtras
            ? "translate-x-0 opacity-100"
            : "pointer-events-none -translate-x-6 opacity-0"
        }`}
      >
        <img
          src={assets.logo}
          alt="Madras Matinee Logo"
          className="h-auto w-24"
        />
      </Link>

      <div
        className={`z-50 flex flex-col items-center gap-8 overflow-hidden border-gray-300/20 bg-black/70 py-3 backdrop-blur transition-[width] duration-300 max-md:absolute max-md:top-0 max-md:left-0 max-md:h-screen max-md:justify-center max-md:text-lg max-md:font-medium md:flex-row min-md:rounded-full md:border md:bg-white/10 min-md:px-8 ${
          isOpen ? "max-md:w-full" : "max-md:w-0"
        }`}
      >
        <XIcon
          className="absolute top-6 right-6 h-6 w-6 cursor-pointer md:hidden"
          onClick={() => setIsOpen(false)}
        />

        {["/", "/movies", "/releases", "/favourites"].map((path, i) => {
          const labels = ["Home", "Movies", "Releases", "Favourites"];
          return (
            <Link
              key={path}
              to={path}
              onClick={() => {
                scrollTo(0, 0);
                setIsOpen(false);
              }}
            >
              {labels[i]}
            </Link>
          );
        })}

        {user && (
          <Link
            to="/my-bookings"
            onClick={() => {
              scrollTo(0, 0);
              setIsOpen(false);
            }}
          >
            My Bookings
          </Link>
        )}
      </div>

      <div
        className={`flex items-center gap-8 transition-all duration-300 ${
          showExtras
            ? "translate-x-0 opacity-100"
            : "pointer-events-none translate-x-6 opacity-0"
        }`}
      >
        <SearchIcon className="h-6 w-6 cursor-pointer max-md:hidden" />

        {!user ? (
          <button
            onClick={openSignIn}
            className="bg-primary hover:bg-primary-dull cursor-pointer rounded-full px-4 py-1 font-medium transition sm:px-7 sm:py-2"
          >
            Login
          </button>
        ) : (
          <UserButton>
            <UserButton.MenuItems>
              <UserButton.Action
                label="My Bookings"
                labelIcon={<TicketPlus width={15} />}
                onClick={() => navigate("/my-bookings")}
              />
            </UserButton.MenuItems>
          </UserButton>
        )}
      </div>

      <MenuIcon
        className="h-8 w-8 cursor-pointer max-md:ml-4 md:hidden"
        onClick={() => setIsOpen(true)}
      />
    </div>
  );
};

export default Navbar;
