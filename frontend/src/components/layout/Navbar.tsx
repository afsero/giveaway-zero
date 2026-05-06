import { BrainCircuit, CircleDot, LayoutDashboard } from "lucide-react";
import type { View } from "../../data/mockGame";

type NavbarProps = {
  activeView: View;
  onNavigate: (view: View) => void;
};

const navItems: Array<{ label: string; view: View }> = [
  { label: "Landing", view: "landing" },
  { label: "Board", view: "board" },
];

function Navbar({ activeView, onNavigate }: NavbarProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-ink/82 backdrop-blur-xl">
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <button
          className="flex items-center gap-3 text-left"
          type="button"
          onClick={() => onNavigate("landing")}
          aria-label="Go to GiveawayZero landing page"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-md border border-mint/30 bg-mint/10 text-mint">
            <BrainCircuit aria-hidden="true" size={21} strokeWidth={1.9} />
          </span>
          <span className="hidden min-w-0 sm:block">
              <span className="block text-sm font-semibold uppercase tracking-normal text-mint">
              GiveawayZero
            </span>
            <span className="block truncate text-xs text-slate-400">
              Antichess AI research board
            </span>
          </span>
        </button>

        <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] p-1">
          {navItems.map((item) => {
            const isActive = activeView === item.view;
            return (
              <button
                key={item.view}
                type="button"
                className={`flex min-h-10 items-center gap-2 rounded-md px-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-white/[0.12] text-white shadow-sm"
                    : "text-slate-400 hover:bg-white/[0.08] hover:text-slate-100"
                }`}
                onClick={() => onNavigate(item.view)}
              >
                {item.view === "landing" ? (
                  <CircleDot aria-hidden="true" size={16} />
                ) : (
                  <LayoutDashboard aria-hidden="true" size={16} />
                )}
                {item.label}
              </button>
            );
          })}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
