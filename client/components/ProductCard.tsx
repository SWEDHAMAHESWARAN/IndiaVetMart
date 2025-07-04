interface ProductCardProps {
  image: string;
  title: string;
  vendor: string;
  price: string;
}

export function ProductCard({ image, title, vendor, price }: ProductCardProps) {
  return (
    <div className="flex flex-col gap-2 p-2 bg-white rounded-xl shadow-[0px_4px_28px_-2px_rgba(0,0,0,0.08)] hover:shadow-lg transition-shadow">
      <div className="w-full h-[264px] overflow-hidden rounded-lg">
        <img src={image} alt={title} className="w-full h-full object-cover" />
      </div>
      <div className="flex flex-col gap-2.5 pt-2 pb-5 px-2">
        <div className="flex flex-col gap-1">
          <p className="text-[#00171F] font-gilroy font-light leading-6 line-clamp-2">
            {title}
          </p>
          <div className="flex items-center gap-1.5">
            <span className="text-[#667479] text-xs font-gabarito font-medium leading-[18px]">
              Vendor:
            </span>
            <span className="text-[#667479] text-xs font-gabarito font-medium leading-[18px]">
              {vendor}
            </span>
          </div>
          <p className="text-[#00171F] text-sm font-gilroy font-light leading-5">
            {price}
          </p>
        </div>
      </div>
    </div>
  );
}
