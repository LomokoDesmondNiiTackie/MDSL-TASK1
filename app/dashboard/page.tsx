import Header from "@/components/header";
import MarketChart from "@/components/MarketChart";
import MyAccounts from "@/components/MyAccount";
import AreaStatCard from "@/components/AreaStat";

export default function Home() {
  return (
    <main className="flex flex-1 gap-5  text-foreground">
      <div className="dash-left h-full w-[80%] ">
        <Header />
        <MarketChart />
        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <AreaStatCard
            label="Revenue"
            value={12638}
            change={3.2}
            color="#34d399"
            data={[22, 30, 28, 36, 44, 38, 18, 30]}
          />
          <AreaStatCard
            label="Expenses"
            value={5875}
            change={-1.35}
            color="#fb3b5c"
            data={[12, 20, 30, 24, 16, 28, 38, 40]}
          />
        </div>
      </div>
      <MyAccounts />
    </main>
  );
}
