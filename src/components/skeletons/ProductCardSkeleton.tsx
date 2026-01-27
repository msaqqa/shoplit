import Skeleton from "react-loading-skeleton";

export default function ProductCardSkeleton() {
  return (
    <div className="shadow-lg rounded-lg overflow-hidden border border-gray-100 p-4">
      {/* Image Placeholder */}
      <div className="relative aspect-[2/3] mb-4">
        <Skeleton height="100%" borderRadius="8px" />
      </div>

      {/* Content Placeholder */}
      <div className="flex flex-col gap-3">
        <Skeleton width="80%" height={20} /> {/* Title */}
        <Skeleton count={2} height={12} /> {/* Description */}
        <div className="flex justify-between items-center mt-2">
          <Skeleton width={60} height={20} /> {/* Price */}
          <Skeleton width={100} height={35} borderRadius="6px" /> {/* Button */}
        </div>
      </div>
    </div>
  );
}
