"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const PlaceholderContent = () => (
  <div className="flex-grow flex flex-col items-center justify-center p-8 2xl:p-10 3xl:p-12 bg-white dark:bg-getstarted-card-dark">
    <div className="max-w-sm 2xl:max-w-md 3xl:max-w-lg text-center space-y-6 2xl:space-y-8">
      <div className="relative mx-auto size-48 2xl:size-56 3xl:size-64">
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-50 to-indigo-50 dark:from-getstarted-primary/10 dark:to-getstarted-primary/5 rounded-full opacity-50 blur-2xl"></div>
        <div className="relative flex items-center justify-center h-full">
          <span className="material-symbols-outlined text-slate-200 dark:text-white/10 text-[120px] 2xl:text-[140px] 3xl:text-[160px] select-none">
            graphic_eq
          </span>
        </div>
      </div>
      <div className="space-y-2 2xl:space-y-3">
        <h2 className="text-xl 2xl:text-2xl 3xl:text-3xl font-bold text-slate-900 dark:text-white">
          Ready to process
        </h2>
        <p className="text-sm 2xl:text-base 3xl:text-lg text-slate-500 dark:text-slate-400">
          Import a video file on the left to generate a transcript and
          structured minutes instantly.
        </p>
      </div>
      <div className="flex justify-center gap-2 2xl:gap-3 pt-4 2xl:pt-6">
        <div className="h-1.5 2xl:h-2 3xl:h-2.5 w-1.5 2xl:w-2 3xl:w-2.5 rounded-full bg-slate-300 dark:bg-white/20"></div>
        <div className="h-1.5 2xl:h-2 3xl:h-2.5 w-1.5 2xl:w-2 3xl:w-2.5 rounded-full bg-slate-300 dark:bg-white/20"></div>
        <div className="h-1.5 2xl:h-2 3xl:h-2.5 w-1.5 2xl:w-2 3xl:w-2.5 rounded-full bg-slate-300 dark:bg-white/20"></div>
      </div>
    </div>
  </div>
);

export default function ContentTabs() {
  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-slate-200 dark:border-white/5 px-6 2xl:px-8 3xl:px-10 pt-2 2xl:pt-3">
        <Tabs defaultValue="transcript" className="w-full">
          <TabsList className="h-auto p-0 bg-transparent gap-8 2xl:gap-10 3xl:gap-12">
            <TabsTrigger
              value="transcript"
              className="group inline-flex items-center py-4 2xl:py-5 3xl:py-6 border-b-2 border-primary-light dark:border-getstarted-primary px-1 text-sm 2xl:text-base 3xl:text-lg font-bold text-slate-900 dark:text-white data-[state=active]:border-primary-light dark:data-[state=active]:border-getstarted-primary data-[state=inactive]:border-transparent data-[state=inactive]:text-slate-500 data-[state=inactive]:hover:text-slate-700 dark:data-[state=inactive]:text-slate-400 dark:data-[state=inactive]:hover:text-slate-300 hover:border-slate-300 dark:hover:border-white/20 transition-all rounded-none"
            >
              <span className="material-symbols-outlined text-[20px] 2xl:text-[24px] 3xl:text-[28px] mr-2 2xl:mr-3 text-primary-light dark:text-getstarted-primary">
                description
              </span>
              Transcript
            </TabsTrigger>
            <TabsTrigger
              value="mom"
              className="group inline-flex items-center py-4 2xl:py-5 3xl:py-6 border-b-2 border-transparent px-1 text-sm 2xl:text-base 3xl:text-lg font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 hover:border-slate-300 dark:hover:border-white/20 transition-all rounded-none"
            >
              <span className="material-symbols-outlined text-[20px] 2xl:text-[24px] 3xl:text-[28px] mr-2 2xl:mr-3">
                summarize
              </span>
              Minutes of Meeting
            </TabsTrigger>
          </TabsList>
          <TabsContent value="transcript" className="m-0 flex-1">
            <PlaceholderContent />
          </TabsContent>
          <TabsContent value="mom" className="m-0 flex-1">
            <PlaceholderContent />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
