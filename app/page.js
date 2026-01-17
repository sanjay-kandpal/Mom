import Header from "@/components/Header";
import FileUpload from "@/components/FileUpload";
import ContentTabs from "@/components/ContentTabs";
import StatusFooter from "@/components/StatusFooter";
import { Card } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f6f6f8] dark:bg-[#101622] text-slate-900 dark:text-white transition-colors duration-200">
      <Header />
      <main className="flex-grow flex flex-col justify-center py-8 px-4 sm:px-6 lg:px-8 2xl:px-12 3xl:px-16 max-w-7xl 2xl:max-w-[1600px] 3xl:max-w-[1800px] mx-auto w-full h-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 2xl:gap-8 3xl:gap-10 h-full min-h-[600px] 2xl:min-h-[700px]">
          <div className="lg:col-span-5 flex flex-col h-full">
            <Card className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col h-full overflow-hidden">
              <FileUpload />
            </Card>
          </div>
          <div className="lg:col-span-7 flex flex-col h-full">
            <Card className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col h-full overflow-hidden">
              <ContentTabs />
              <StatusFooter />
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
