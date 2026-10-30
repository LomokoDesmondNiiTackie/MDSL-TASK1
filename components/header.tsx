import { Bell } from "lucide-react";


export default function Header() {
  return (
    <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center text-foreground">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl text-white">
        Dashboard
      </h1>

      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Notifications"
          className="relative flex size-11 shrink-0 items-center justify-center  transition rounded-2xl hover:bg-slate-50/20"
        >
          <Bell size={20} />
        </button>

        <div className="hidden size-11 shrink-0 items-center justify-center rounded-xl bg-primary font-semibold text-white sm:flex">
          LD
        </div>
      </div>
    </header>
  );
}
