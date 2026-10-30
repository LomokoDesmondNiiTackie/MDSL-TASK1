import {
  ArrowUpRight,
  ArrowRightLeft,
  SquarePlus,
  CreditCard,
} from "lucide-react";

type Transaction = {
  id: string;
  name: string;
  when: string;
  amount: number;
};

const TRANSACTIONS: Transaction[] = [
  {
    id: "1",
    name: "Amazon",
    when: "Today • 2:46 pm",
    amount: -2800,
  },
  {
    id: "2",
    name: "Verizon",
    when: "Today • 11:21 am",
    amount: -1250,
  },
  {
    id: "3",
    name: "Bank Of America",
    when: "Today • 10:59 am",
    amount: 6588,
  },
  {
    id: "4",
    name: "Dropbox Business",
    when: "Yesterday • 9:42 PM",
    amount: -240,
  },
  {
    id: "5",
    name: "McAfee",
    when: "Yesterday • 6:33 PM",
    amount: -2050,
  },
  {
    id: "6",
    name: "Bank Of America",
    when: "Yesterday • 3:21 PM",
    amount: 4500,
  },
];

const ACTIONS = [
  { label: "Top up", icon: SquarePlus },
  { label: "Transfer", icon: ArrowRightLeft },
  { label: "Payments", icon: CreditCard },
];

const formatAmount = (n: number) => {
  const sign = n < 0 ? "-" : "+";
  const abs = Math.abs(n).toLocaleString("en-US").replace(/,/g, " ");
  return `${sign}$${abs}`;
};

export default function MyAccounts() {
  return (
    <aside
      aria-label="My accounts"
      className="flex h-full w-[20%] flex-col gap-6 rounded-3xl p-5 text-white"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">My accounts</h2>
        <button
          type="button"
          aria-label="Open accounts"
          className="flex size-10 items-center justify-center rounded-xl bg-white/5 text-white/60 transition hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-emerald-400"
        >
          <ArrowUpRight size={18} />
        </button>
      </div>

      <div className="relative pb-3">
        <div
          className="absolute inset-x-4 bottom-0 h-8 rounded-b-2xl bg-white/5"
          aria-hidden
        />
        <div className="relative flex aspect-[1.65/1] flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br from-[#1f8a5b] via-[#17744c] to-[#0f5c3b] p-5 shadow-lg shadow-black/30">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-10 -top-16 size-56 rounded-full bg-white/10 blur-3xl"
          />

          <div className="relative flex" aria-label="Mastercard">
            <span className="size-4 rounded-full bg-[#eb001b]" />
            <span className="-ml-1.5 size-4 rounded-full bg-[#f79e1b]/90" />
          </div>

          <p className="relative text-2xl font-bold tracking-wide tabular-nums">
            $162 230
          </p>

          <div className="relative flex items-end justify-between text-xs">
            <div>
              <p className="text-white/60">Number</p>
              <p className="mt-0.5 font-mono tracking-widest">**** 5691</p>
            </div>
            <div className="text-right">
              <p className="text-white/60">Expires</p>
              <p className="mt-0.5 font-mono tracking-widest">04/27</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-6">
        {ACTIONS.map(({ label, icon: Icon }) => (
          <button
            key={label}
            type="button"
            className="group flex flex-col items-center gap-2 text-xs text-white/60 transition hover:text-white focus-visible:outline-2 focus-visible:outline-emerald-400"
          >
            <span className="flex size-12 items-center justify-center rounded-xl bg-white/5 text-white shadow-inner shadow-black/20 transition group-hover:bg-white/10">
              <Icon size={20} />
            </span>
            {label}
          </button>
        ))}
      </div>

      <section className="flex min-h-0 flex-1 flex-col gap-4">
        <h3 className="text-lg font-medium">Recent transactions</h3>

        <ul className="flex flex-col gap-4 overflow-y-auto">
          {TRANSACTIONS.map((t) => (
            <li key={t.id} className="flex items-center gap-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{t.name}</p>
                <p className="truncate text-xs text-white/50">{t.when}</p>
              </div>

              <span
                className={`text-sm font-semibold tabular-nums ${
                  t.amount < 0 ? "text-accent" : "text-emerald-400"
                }`}
              >
                {formatAmount(t.amount)}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </aside>
  );
}
