const CarouselItemSkeleton = () => {
  return (
    <div className="relative h-[650px] aspect-[1/1.5]">
      <div className="relative w-full h-full transform transition-transform duration-500">
        <div className="z-[1] absolute w-full h-full bg-gray-200 animate-pulse rounded-lg shadow-md flex flex-col items-center p-6">
          <div className="w-full h-44 bg-gray-300 rounded-t-lg"></div>
          <div className="flex flex-col items-start gap-2 p-4 flex-grow w-full">
            <div className="h-6 bg-gray-300 w-3/4 rounded"></div>
            <div className="h-5 bg-gray-300 w-1/2 rounded"></div>
            <div className="h-4 bg-gray-300 w-1/4 rounded"></div>
            <div className="h-4 bg-gray-300 w-1/3 rounded"></div>
            <div className="h-4 bg-gray-300 w-1/2 rounded"></div>
            <div className="h-4 bg-gray-300 w-2/3 rounded"></div>
            <div className="flex flex-wrap gap-1 mt-4 w-full">
              <div className="h-6 bg-gray-300 w-1/4 rounded"></div>
              <div className="h-6 bg-gray-300 w-1/4 rounded"></div>
            </div>
            <div className="mt-4 w-full h-10 bg-gray-300 rounded-lg"></div>
          </div>
        </div>

        <div className="z-[2] absolute w-full h-full bg-gray-200 animate-pulse rounded-lg shadow-md flex flex-col items-start p-6">
          <div className="h-6 bg-gray-300 w-3/4 mb-4 rounded"></div>
          <div className="flex flex-col gap-2 w-full">
            <div className="h-4 bg-gray-300 w-2/3 rounded"></div>
            <div className="h-4 bg-gray-300 w-1/2 rounded"></div>
            <div className="h-4 bg-gray-300 w-1/3 rounded"></div>
            <div className="h-4 bg-gray-300 w-3/4 rounded"></div>
          </div>
          <div className="mt-4 w-full h-10 bg-gray-300 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
};
export default CarouselItemSkeleton;
