import { useContext, useState, useEffect } from "react";
import { fetchDataFromApi } from "@/lib/api";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Tooltip from "@mui/material/Tooltip";
import SecurityIcon from "@mui/icons-material/Security";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import { Card, CardContent } from "@/components/ui/card";
const Discount = () => {
  const [discountData, setDiscountData] = useState([]);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDiscountData();
  }, []);
  const fetchDiscountData = async () => {
    try {
      setLoading(true);
      const response = await fetchDataFromApi(
        "/api/discount/discounts?role=admin",
      );
      const filtered =
        response?.Response?.filter((item: any) => item.status === true) || [];
      setDiscountData(filtered);
    } catch (error) {
      console.error("Error fetching discount data:", error);
      setDiscountData([]);
    } finally {
      setLoading(false);
    }
  };

  const getScopeIcon = (scope: any) => {
    if (scope?.toLowerCase() === "cart") return <ShoppingCartIcon />;
    if (scope?.toLowerCase() === "product") return <Inventory2Icon />;
    if (scope?.toLowerCase() === "platform") return <SecurityIcon />;
    return <LocalOfferIcon />;
  };

  const getDiscountIcon = (offer: any) => {
    const title = offer.title?.toLowerCase() || "";
    if (title.includes("flash")) return <FlashOnIcon />;
    if (title.includes("special") || title.includes("weekend"))
      return <CardGiftcardIcon />;
    return getScopeIcon(offer.scope);
  };

  return (
    <>
      {discountData
        .sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
        )
        .slice(0, 24)
        .map((feature, index) => (
          <Card
            className={`min-w-[240px] bg-neutral-0 border-2 hover:shadow-lg transition-all duration-300 cursor-pointer group flex-shrink-0`}
            key={index}
          >
            <CardContent className="p-4 flex flex-col gap-2">
              <div className="flex justify-between items-start">
                <div className="p-2 rounded">
                  <span className="text-xl">{getDiscountIcon(feature)}</span>
                </div>
                <div className="text-right">
                  <h4 className="text-md font-semibold">
                    {feature.discountValue}
                    {feature.discountType === "percent" ? "%" : "₹"}
                  </h4>
                  <p className="text-xs text-neutral-500">OFF</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold">{feature.couponCode}</h3>
                <p className="text-xs text-neutral-500">
                  Save more on your order
                </p>
              </div>

              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-1 rounded-full font-mono">
                    {feature.couponCode}
                  </span>
                  <Tooltip
                    title={copiedIndex === feature._id ? "Copied!" : "Copy"}
                    arrow
                  >
                    <div
                      onClick={() => {
                        const copyText =
                          feature.scope?.toLowerCase() === "platform"
                            ? "IVM Platform"
                            : feature.category || feature.couponCode;
                        navigator.clipboard.writeText(copyText);
                        setCopiedIndex(feature._id);
                        setTimeout(() => setCopiedIndex(null), 2000);
                      }}
                      style={{
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {copiedIndex === feature._id ? (
                        <CheckCircleIcon
                          fontSize="small"
                          sx={{ color: "#444 !important" }}
                          style={{ color: "#4", marginLeft: "5px" }}
                        />
                      ) : (
                        <ContentCopyIcon
                          fontSize="small"
                          sx={{ color: "#444 !important" }}
                          style={{ color: "#000", marginLeft: "5px" }}
                        />
                      )}
                    </div>
                  </Tooltip>
                </div>
                <div className="text-xs px-2 py-1 rounded-full whitespace-nowrap">
                  {feature.vendorName}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
    </>
  );
};

export default Discount;
