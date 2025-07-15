import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ShoppingCart, ChevronDown, ChevronUp } from "lucide-react";

interface BudgetCartInfoProps {
  totalItems?: number;
  subtotal?: number;
  totalCarts?: number;
  className?: string;
}

export default function BudgetCartInfo({
  totalItems = 2,
  subtotal = 1362,
  totalCarts = 2,
  className = "",
}: BudgetCartInfoProps) {
  const [selectedVendors, setSelectedVendors] = useState<string[]>([]);
  const [isBudgetExpanded, setIsBudgetExpanded] = useState(false);
  const [isVendorsExpanded, setIsVendorsExpanded] = useState(false);

  const budgets = [
    {
      period: "This Week",
      current: 0,
      total: 1000,
      percentage: 0,
    },
    {
      period: "This Month",
      current: 340,
      total: 5000,
      percentage: 6.8,
    },
    {
      period: "This Year",
      current: 8920,
      total: 50000,
      percentage: 17.84,
    },
  ];

  const vendors = ["Flurry", "Cure By Design"];

  const toggleVendor = (vendor: string) => {
    setSelectedVendors((prev) =>
      prev.includes(vendor)
        ? prev.filter((v) => v !== vendor)
        : [...prev, vendor],
    );
  };

  return (
    <div
      className={`w-full max-w-sm flex flex-col gap-4 md:gap-6 ${className}`}
    >
      {/* All Cart Summary */}
      <Card className="border border-neutral-30 rounded-lg">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4">
            {/* Header */}
            <div className="flex justify-center items-center py-2 border-b border-dashed border-neutral-30">
              <span className="text-neutral-60 text-xl font-gilroy font-bold leading-7">
                All Cart
              </span>
            </div>

            {/* Stats Grid */}
            <div className="flex justify-center items-center gap-2 sm:gap-4">
              <div className="flex-1 flex flex-col items-center gap-1 sm:gap-2">
                <div className="flex justify-center items-center">
                  <span className="text-primary-dark-blue text-lg sm:text-xl font-gabarito font-bold">
                    {totalItems}
                  </span>
                </div>
                <div className="flex justify-center items-center">
                  <span className="text-black font-gilroy font-light text-xs sm:text-sm">
                    Items
                  </span>
                </div>
              </div>

              <div className="flex-1 flex flex-col items-center gap-1 sm:gap-2">
                <div className="flex justify-center items-center">
                  <span className="text-primary-dark-blue text-lg sm:text-xl font-gabarito font-bold">
                    {subtotal}
                  </span>
                </div>
                <div className="flex justify-center items-center">
                  <span className="text-black font-gilroy font-light text-xs sm:text-sm">
                    Subtotal
                  </span>
                </div>
              </div>

              <div className="flex-1 flex flex-col items-center gap-1 sm:gap-2">
                <div className="flex justify-center items-center">
                  <span className="text-primary-dark-blue text-lg sm:text-xl font-gabarito font-bold">
                    {totalCarts}
                  </span>
                </div>
                <div className="flex justify-center items-center">
                  <span className="text-black font-gilroy font-light text-xs sm:text-sm">
                    Carts
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Budget Section */}
      <div className="flex flex-col">
        {/* Budgets */}
        <div className="flex flex-col gap-4 py-4 border-b border-neutral-20">
          <Button
            variant="ghost"
            className="flex items-center justify-between p-0 h-auto hover:bg-transparent md:cursor-default md:pointer-events-none"
            onClick={() => setIsBudgetExpanded(!isBudgetExpanded)}
          >
            <span className="text-primary-dark-blue font-gabarito font-bold leading-6">
              Budgets
            </span>
            <div className="md:hidden">
              {isBudgetExpanded ? (
                <ChevronUp className="w-4 h-4 text-primary-dark-blue" />
              ) : (
                <ChevronDown className="w-4 h-4 text-primary-dark-blue" />
              )}
            </div>
          </Button>

          <div
            className={`transition-all duration-300 overflow-hidden ${isBudgetExpanded || window.innerWidth >= 768 ? "max-h-96 opacity-100" : "max-h-0 opacity-0 md:max-h-96 md:opacity-100"}`}
          >
            {budgets.map((budget, index) => (
              <div key={index} className="w-full relative mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-black text-xs sm:text-sm font-gilroy font-light">
                    {budget.period}
                  </span>
                  <span className="text-black text-xs sm:text-sm font-gilroy font-light">
                    ₹{budget.total}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="relative">
                  <div className="w-full h-1 bg-neutral-30 rounded-full">
                    <div
                      className="h-1 bg-primary-dark-blue rounded-full transition-all duration-300"
                      style={{ width: `${budget.percentage}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-black text-xs font-gabarito leading-5">
                      ₹{budget.current}
                    </span>
                    <span className="text-black text-xs font-gabarito leading-5">
                      ₹{budget.total}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Vendors */}
        <div className="flex flex-col gap-4 py-4 border-b border-neutral-20">
          <Button
            variant="ghost"
            className="flex items-center justify-between p-0 h-auto hover:bg-transparent md:cursor-default md:pointer-events-none"
            onClick={() => setIsVendorsExpanded(!isVendorsExpanded)}
          >
            <span className="text-primary-dark-blue font-gilroy font-bold leading-6">
              Vendors
            </span>
            <div className="md:hidden">
              {isVendorsExpanded ? (
                <ChevronUp className="w-4 h-4 text-primary-dark-blue" />
              ) : (
                <ChevronDown className="w-4 h-4 text-primary-dark-blue" />
              )}
            </div>
          </Button>
          <div
            className={`transition-all duration-300 overflow-hidden ${isVendorsExpanded || window.innerWidth >= 768 ? "max-h-32 opacity-100" : "max-h-0 opacity-0 md:max-h-32 md:opacity-100"}`}
          >
            <div className="flex flex-col gap-3">
              {vendors.map((vendor) => (
                <div
                  key={vendor}
                  className="flex items-center gap-3 cursor-pointer"
                  onClick={() => toggleVendor(vendor)}
                >
                  <Checkbox
                    checked={selectedVendors.includes(vendor)}
                    onCheckedChange={() => toggleVendor(vendor)}
                    className="w-4 h-4 border-neutral-30 data-[state=checked]:bg-primary-dark-blue data-[state=checked]:border-primary-dark-blue"
                  />
                  <span className="text-primary-dark-blue text-sm font-gilroy font-light">
                    {vendor}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* My List */}
        <div className="flex flex-col gap-4 py-4">
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-6 h-6 text-primary-dark-blue" />
            <span className="text-black font-gilroy font-light">My List</span>
          </div>
        </div>
      </div>
    </div>
  );
}
