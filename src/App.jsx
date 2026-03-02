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
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Row 1: 3 status cards */}
          <CyclePosition />
          <FearGreed fearGreed={fearGreed} />
          <ATHTracker />

          {/* Row 2: Peak analysis 2-col + CycleStats 1-col */}
          <div className="md:col-span-2">
            <PeakAnalysis />
          </div>
          <CycleStats />

          {/* Row 3: Chart full-width 3-col */}
          <div className="md:col-span-2 lg:col-span-3">
            <CycleOverlay priceHistory={prices} />
          </div>

          {/* Row 4: 3 utility cards */}
          <BestDays priceHistory={prices} />
          <HalvingCountdown />
          <DCASimulator priceHistory={prices} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
