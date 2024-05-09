import Link from "next/link";

const navItems = [
  {
    title: "Home",
    url: "/",
  },
  {
    title: "Restaurants",
    url: "restaurants",
  },
  {
    title: "Popular Foods",
    url: "foods",
  },
  {
    title: "About",
    url: "about",
  },
  {
    title: "Contact us",
    url: "contact",
  },
];
const NavItems = ({ activeItem }: { activeItem?: number }) => {
  return (
    <div className="flex gap-x-8 text-primary font-semibold text-lg">
      {navItems.map((item, index) => (
        <Link
          key={item.url}
          href={item.url}
          className={`${
            activeItem == index && "text-primary"
          } hover:text-secondary duration-150 `}
        >
          {item.title}
        </Link>
      ))}
    </div>
  );
};

export default NavItems;
