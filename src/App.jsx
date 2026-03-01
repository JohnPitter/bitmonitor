import { useBitcoinData } from "./hooks/useBitcoinData";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Loader from "./components/common/Loader";
import ErrorState from "./components/common/ErrorState";
import CycleOverlay from "./components/charts/CycleOverlay";
import CyclePosition from "./components/cards/CyclePosition";
import BestDays from "./components/cards/BestDays";
import FearGreed from "./components/cards/FearGreed";
import HalvingCountdown from "./components/cards/HalvingCountdown";
import DCASimulator from "./components/cards/DCASimulator";
import CycleStats from "./components/cards/CycleStats";

export default function App() {
  const { priceHistory, currentPrice, fearGreed, loading, error } = useBitcoinData();

  if (loading) return <Loader />;
  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />;

  return (
    <div className="min-h-screen flex flex-col">
      <Header currentPrice={currentPrice} />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <CycleOverlay priceHistory={priceHistory} />
          <CyclePosition />
          <BestDays priceHistory={priceHistory} />
          <FearGreed fearGreed={fearGreed} />
          <HalvingCountdown />
          <DCASimulator priceHistory={priceHistory} />
          <CycleStats />
        </div>
      </main>
      <Footer />
    </div>
  );
}
