import Link from "next/link";

export type BottomNavigationKey =
  | "home"
  | "recommendation"
  | "register"
  | "items"
  | "my";

export type BottomNavigationItem = {
  key: BottomNavigationKey;
  label: string;
  href: string;
  icon: string;
};

export const defaultBottomNavigationItems: BottomNavigationItem[] = [
  { key: "home", label: "홈", href: "/dashboard", icon: "⌂"},
  {
    key: "recommendation",
    label: "추천",
    href: "/recommendations",
    icon: "◇",
  },
  { key: "register", label: "등록", href: "/items/new", icon: "＋" },
  { key: "items", label: "아이템", href: "/items", icon: "▣" },
  { key: "my", label: "MY", href: "/my", icon: "○" },
];

type BottomNavigationProps = {
  activeItem?: BottomNavigationKey;
  items?: BottomNavigationItem[];
};

export function BottomNavigation({
  activeItem = "home",
  items = defaultBottomNavigationItems,
}: BottomNavigationProps) {
  return (
    <nav
      aria-label="주요 메뉴"
      className="z-40 h-[calc(82px+env(safe-area-inset-bottom))] shrink-0 border-t border-[#d8d8dc] bg-white pb-[env(safe-area-inset-bottom)]"
    >
      <ul
        className="grid h-full"
        style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}
      >
        {items.map((item) => {
          const isActive = item.key === activeItem;

          return (
            <li key={item.key}>
              <Link
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`flex h-full flex-col items-center justify-center gap-1 transition-colors ${
                  isActive
                    ? "font-bold text-[#15151a]"
                    : "font-normal text-[#9999a1] hover:text-[#5f5f68]"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`flex h-6 items-center justify-center font-black leading-none [-webkit-text-stroke:1.45px_currentColor] ${
                    item.key === "home" ? "text-[21px]" : "text-[19px]"
                  }`}
                >
                  {item.icon}
                </span>
                <span className="text-[11px] leading-[13px]">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
