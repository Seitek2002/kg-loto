export const ScannerOverlay = () => {
  return (
    <div className='absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none'>
      <div className='relative w-64 h-64 border-2 border-white/80 rounded-3xl'>
        {/* Уголки */}
        <div className='absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-white -mt-1 -ml-1 rounded-tl-xl' />
        <div className='absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-white -mt-1 -mr-1 rounded-tr-xl' />
        <div className='absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-white -mb-1 -ml-1 rounded-bl-xl' />
        <div className='absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-white -mb-1 -mr-1 rounded-br-xl' />

        {/* Анимация */}
        <div className='absolute left-2 right-2 h-0.5 bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)] animate-scan' />
      </div>
      <p className='mt-6 text-white/90 font-rubik font-medium bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/10'>
        Наведите камеру на QR-код
      </p>

      <style jsx global>{`
        @keyframes scan {
          0% {
            top: 5%;
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            top: 95%;
            opacity: 0;
          }
        }
        .animate-scan {
          animation: scan 2s linear infinite;
        }
      `}</style>
    </div>
  );
};
