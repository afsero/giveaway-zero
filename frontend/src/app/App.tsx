import { useState } from "react";
import Navbar from "../components/layout/Navbar";
import BoardPage from "../components/board/BoardPage";
import FeatureCard from "../components/landing/FeatureCard";
import HeroSection from "../components/landing/HeroSection";
import PipelinePreview from "../components/landing/PipelinePreview";
import { features } from "../data/mockGame";
import type { View } from "../data/mockGame";

function App() {
  const [activeView, setActiveView] = useState<View>("landing");

  return (
    <div className="min-h-screen overflow-x-hidden text-slate-100">
      <Navbar activeView={activeView} onNavigate={setActiveView} />
      <main className="mx-auto flex w-full max-w-[88rem] flex-col px-4 pb-10 pt-6 sm:px-6 lg:px-8">
        {activeView === "landing" ? (
          <div className="flex flex-col gap-8 lg:gap-10">
            <HeroSection onLaunch={() => setActiveView("board")} />
            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              {features.map((feature) => (
                <FeatureCard key={feature.title} {...feature} />
              ))}
            </section>
            <PipelinePreview />
          </div>
        ) : (
          <BoardPage />
        )}
      </main>
    </div>
  );
}

export default App;
