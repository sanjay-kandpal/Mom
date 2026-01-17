import GetStartedHeader from "@/components/get-started/GetStartedHeader";
import HeroSection from "@/components/get-started/HeroSection";
import FeaturesSection from "@/components/get-started/FeaturesSection";
import GetStartedFooter from "@/components/get-started/GetStartedFooter";

export const metadata = {
  title: "Local MoM Generator - Get Started",
  description: "Private, browser-only meeting minutes generator",
};

export default function GetStartedPage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col group/design-root overflow-x-hidden font-outfit bg-white dark:bg-getstarted-bg-dark text-slate-900 dark:text-slate-300 transition-colors duration-200 antialiased">
      <GetStartedHeader />
      <div className="layout-container flex h-full grow flex-col relative">
        <div className="absolute inset-0 bg-circuit-grid pointer-events-none z-0 opacity-0 dark:opacity-100 transition-opacity"></div>
        <main className="flex flex-1 justify-center py-10 z-10">
          <div className="layout-content-container flex flex-col max-w-[1100px] flex-1 px-4 sm:px-6 lg:px-8">
            <HeroSection />
            <FeaturesSection />
          </div>
        </main>
      </div>
      <GetStartedFooter />
    </div>
  );
}
