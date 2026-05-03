export default function Loading() {
  return (
    <div className="min-h-screen bg-[#F9F9F9] pt-6 pb-20 overflow-hidden">
      <div className="max-w-380 mx-auto px-4 md:px-8 space-y-10 md:space-y-16 animate-pulse">
        {/* 1. LotteryHero Skeleton */}
        <div className="w-full h-87.5 md:h-112.5 bg-gray-200 rounded-3xl md:rounded-[40px] shadow-sm" />

        {/* 2. LotteryPrizeFund Skeleton */}
        <div>
          <div className="w-48 h-8 bg-gray-200 rounded-xl mb-6 md:mb-8" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-28 md:h-36 bg-gray-200 rounded-2xl md:rounded-3xl"
              />
            ))}
          </div>
        </div>

        {/* 3. LotteryHowToPlay Skeleton */}
        <div>
          <div className="w-64 h-8 bg-gray-200 rounded-xl mb-6 md:mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-40 md:h-52 bg-white border border-gray-100 rounded-3xl md:rounded-4xl p-6 flex flex-col gap-4"
              >
                <div className="w-12 h-12 bg-gray-200 rounded-full" />
                <div className="w-3/4 h-5 bg-gray-200 rounded-md" />
                <div className="w-full h-4 bg-gray-200 rounded-md mt-auto" />
                <div className="w-5/6 h-4 bg-gray-200 rounded-md" />
              </div>
            ))}
          </div>
        </div>

        {/* 4. LotteryConditions Skeleton */}
        <div>
          <div className="w-40 h-8 bg-gray-200 rounded-xl mb-6 md:mb-8" />
          <div className="bg-white border border-gray-100 rounded-3xl md:rounded-4xl p-6 md:p-10 space-y-4">
            <div className="w-full h-4 bg-gray-200 rounded-md" />
            <div className="w-11/12 h-4 bg-gray-200 rounded-md" />
            <div className="w-4/5 h-4 bg-gray-200 rounded-md" />
            <div className="w-full h-4 bg-gray-200 rounded-md" />
            <div className="w-3/4 h-4 bg-gray-200 rounded-md" />
          </div>
        </div>

        {/* 5. Winners Slider / Popular Tickets Skeleton */}
        <div>
          <div className="flex justify-between items-center mb-6 md:mb-8">
            <div className="w-52 h-8 bg-gray-200 rounded-xl" />
            <div className="w-20 h-6 bg-gray-200 rounded-lg hidden md:block" />
          </div>
          <div className="flex gap-4 md:gap-6 overflow-hidden">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="min-w-65 md:min-w-[320px] h-85 bg-white border border-gray-100 rounded-3xl md:rounded-4xl p-5 flex flex-col shrink-0"
              >
                <div className="w-full h-40 bg-gray-200 rounded-2xl mb-4" />
                <div className="w-2/3 h-6 bg-gray-200 rounded-md mb-2" />
                <div className="w-1/2 h-4 bg-gray-200 rounded-md mb-auto" />
                <div className="w-full h-12 bg-gray-200 rounded-xl mt-4" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
