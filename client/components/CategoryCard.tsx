interface CategoryCardProps {
  name: string;
  icon: string;
  bgColor: string;
}

export function CategoryCard({ name, icon, bgColor }: CategoryCardProps) {
  return (
    <div
      className={`w-[120px] flex flex-col items-center ${bgColor} border-[0.5px] border-brand-navy rounded-[15px] hover:shadow-md transition-shadow cursor-pointer`}
    >
      <div className="w-[60px] flex justify-center items-center py-2.5">
        <span
          className="text-brand-navy text-sm font-bold text-center"
          style={{ fontFamily: "Gabarito, Inter, sans-serif" }}
        >
          {name}
        </span>
      </div>
      <div className="w-[120px] h-[120px] overflow-hidden">
        <img src={icon} alt={name} className="w-full h-full object-cover" />
      </div>
    </div>
  );
}
