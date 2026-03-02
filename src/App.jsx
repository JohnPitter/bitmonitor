import { useBitcoinData } from "./hooks/useBitcoinData";
import { useTranslation } from "./i18n";
import historicalPrices from "./lib/historical-prices.json";
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
import ATHTracker from "./components/cards/ATHTracker";
import PeakAnalysis from "./components/cards/PeakAnalysis";

export default function App() {
  const { priceHistory, currentPrice, fearGreed, loading, error } = useBitcoinData();
  const { t } = useTranslation();

  if (loading) return <Loader />;
  if (error) return <ErrorState message={t("error.allFailed")} onRetry={() => window.location.reload()} />;

  const prices = priceHistory || historicalPrices;

  return (
    <div className="min-h-screen flex flex-col">
      <Header currentPrice={currentPrice} />
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6 sm:px-6">
        <div className="space-y-4">
          {/* Main: Cycle position + Fear & Greed + ATH */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <CyclePosition />
            <FearGreed fearGreed={fearGreed} />
            <ATHTracker />
          </div>

          {/* Peak analysis: full width */}
          <PeakAnalysis />

          {/* Chart: full width */}
          <CycleOverlay priceHistory={prices} />

          {/* Secondary cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <BestDays priceHistory={prices} />
            <HalvingCountdown />
            <DCASimulator priceHistory={prices} />
          </div>

          {/* Cycle history */}
          <CycleStats />
        </div>
      </main>
      <Footer />
    </div>
  );
}
