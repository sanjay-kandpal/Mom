import { Button } from "@/components/ui/button";

export default function FileUpload() {
  return (
    <div className="p-6 md:p-8 2xl:p-10 3xl:p-12 flex flex-col flex-grow items-center justify-center text-center">
      <div className="w-full max-w-md 2xl:max-w-lg 3xl:max-w-xl aspect-[4/3] rounded-xl border-2 border-dashed border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 hover:border-primary-light/50 dark:hover:border-getstarted-primary/50 transition-all cursor-pointer group flex flex-col items-center justify-center p-8 2xl:p-10 3xl:p-12 gap-6 2xl:gap-8">
        <div className="size-16 2xl:size-20 3xl:size-24 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          <span className="material-symbols-outlined text-primary-light dark:text-getstarted-primary text-[32px] 2xl:text-[40px] 3xl:text-[48px]">
            cloud_upload
          </span>
        </div>
        <div className="space-y-2 2xl:space-y-3">
          <h3 className="text-lg 2xl:text-xl 3xl:text-2xl font-bold text-slate-900 dark:text-white">
            Drag & drop your recording
          </h3>
          <p className="text-sm 2xl:text-base 3xl:text-lg text-slate-500 dark:text-slate-400 px-4 2xl:px-6">
            Supports MP4, MOV, WEBM. <br /> Max file size depends on your browser
            limits.
          </p>
        </div>
        <Button className="w-auto min-w-[140px] 2xl:min-w-[160px] 3xl:min-w-[180px] 2xl:h-11 3xl:h-12 2xl:text-base 3xl:text-lg bg-primary-light dark:bg-getstarted-primary hover:bg-primary-light-hover dark:hover:bg-getstarted-primary/90 text-white dark:text-black">
          Choose Video
        </Button>
      </div>
      <div className="mt-8 2xl:mt-10 3xl:mt-12 max-w-xs 2xl:max-w-sm 3xl:max-w-md mx-auto space-y-3 2xl:space-y-4">
        <div className="flex items-start gap-3 2xl:gap-4 text-left p-3 2xl:p-4 3xl:p-5 rounded-lg bg-blue-50 dark:bg-getstarted-primary/5 border border-blue-100 dark:border-getstarted-primary/20">
          <span className="material-symbols-outlined text-primary-light dark:text-getstarted-primary text-[20px] 2xl:text-[24px] 3xl:text-[28px] shrink-0 mt-0.5">
            lock
          </span>
          <p className="text-xs 2xl:text-sm 3xl:text-base text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
            Your file is processed locally via WebAssembly. No audio or video
            data is ever sent to a server.
          </p>
        </div>
      </div>
    </div>
  );
}
