import { Header } from "../components/Header";
import { ProductCard } from "../components/ProductCard";
import { CategoryCard } from "../components/CategoryCard";
import { Footer } from "../components/Footer";
import { ChevronRight, ChevronLeft, Info, Play } from "lucide-react";

export default function Index() {
  const featuredProducts = [
    {
      id: 1,
      image: "https://picsum.photos/264/264?random=1",
      title: "Relief 500mg CBD Oil for Cats & Dogs",
      vendor: "CureByDesign",
      price: "₹2000",
    },
    {
      id: 2,
      image: "https://picsum.photos/264/264?random=2",
      title: "Hemp Healing Balm (Unscented)",
      vendor: "CureByDesign",
      price: "₹320",
    },
    {
      id: 3,
      image: "https://picsum.photos/264/264?random=3",
      title: "Dog Coat Cotton Quilted | Double Strap | Navy Blue",
      vendor: "Flury",
      price: "₹1699",
    },
    {
      id: 4,
      image: "https://picsum.photos/264/264?random=4",
      title: "Hemp Spray for Dogs - Pain 100mg CBD",
      vendor: "CureByDesign",
      price: "₹800",
    },
  ];

  const additionalProducts = [
    {
      id: 5,
      image: "https://picsum.photos/264/264?random=5",
      title: "Dog Coat Cotton Quilted | Double Strap | Blue Matrix",
      vendor: "Flury",
      price: "₹2000",
    },
    {
      id: 6,
      image: "https://picsum.photos/264/264?random=6",
      title: "Hemp Oil for Equine 3000mg CBD",
      vendor: "CureByDesign",
      price: "₹1700",
    },
    {
      id: 7,
      image: "https://picsum.photos/264/264?random=7",
      title: "Dog Coat Cotton Quilted | Double Strap | Geometric Phool",
      vendor: "Flury",
      price: "₹1900",
    },
    {
      id: 8,
      image: "https://picsum.photos/264/264?random=8",
      title: "Relief 1000mg CBD MCT for Large Dogs",
      vendor: "CureByDesign",
      price: "₹200",
    },
  ];

  const petAccessories = [
    {
      id: 9,
      image: "https://picsum.photos/264/264?random=9",
      title: "Flury | Assorted Bandanas for Your Stylish Pet|",
      vendor: "Flury",
      price: "₹499",
    },
    {
      id: 10,
      image: "https://picsum.photos/264/264?random=10",
      title: "Flury | Assorted Bandanas for Your Stylish Pet|",
      vendor: "Flury",
      price: "₹599",
    },
    {
      id: 11,
      image: "https://picsum.photos/264/264?random=11",
      title: "Flury | Assorted Bandanas for Your Stylish Pet|",
      vendor: "Flury",
      price: "₹699",
    },
    {
      id: 12,
      image: "https://picsum.photos/264/264?random=12",
      title: "Flury | Assorted Bandanas for Your Stylish Pet|",
      vendor: "Flury",
      price: "₹699",
    },
  ];

  const categories = [
    {
      name: "Pet Cares",
      icon: "https://picsum.photos/120/120?random=20",
      bgColor: "bg-[#FFE7BA]",
    },
    {
      name: "Pet Health",
      icon: "https://picsum.photos/120/120?random=21",
      bgColor: "bg-[#EEC77E]",
    },
    {
      name: "CBP for Pet",
      icon: "https://picsum.photos/120/120?random=22",
      bgColor: "bg-[#F7DBA7]",
    },
    {
      name: "Pet Accessories",
      icon: "https://picsum.photos/120/120?random=23",
      bgColor: "bg-[#EEC77E]",
    },
    {
      name: "Frocks",
      icon: "https://picsum.photos/120/120?random=24",
      bgColor: "bg-[#F7DBA7]",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="w-full h-[695px] bg-hero-gradient rounded-br-[40px] rounded-bl-[40px] relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0">
          <div className="w-[635px] h-[635px] bg-brand-navy rounded-[99px] absolute left-[699px] top-[268px] rotate-[9.35deg]"></div>
          <div className="w-[635px] h-[635px] bg-brand-light-yellow rounded-[99px] absolute left-[866px] top-[180px] rotate-[25.23deg]"></div>
          <div className="w-[635px] h-[635px] bg-brand-light-yellow rounded-[99px] opacity-40 absolute left-[438px] top-[564px] rotate-[56.47deg]"></div>
          <div className="w-[635px] h-[635px] bg-brand-light-yellow rounded-[99px] absolute left-[-64px] top-[-697px] rotate-[25.23deg]"></div>
          <div className="w-[67px] h-[67px] bg-brand-light-yellow rounded-[20px] absolute left-[141px] top-[163px] rotate-[25.23deg]"></div>
          <div className="w-[14px] h-[14px] bg-brand-light-yellow rounded-full absolute left-[762px] top-[148px] rotate-[20.79deg]"></div>
          <div className="w-[27px] h-[27px] bg-brand-light-yellow rounded-[9px] absolute left-[728px] top-[211px] rotate-[-22.85deg]"></div>
          <div className="w-[21px] h-[21px] bg-brand-dark-navy rounded-md absolute left-[727px] top-[224px] rotate-[-43deg]"></div>
        </div>

        {/* Header */}
        <Header />

        {/* Hero Content */}
        <div className="relative z-10 px-[130px] max-lg:px-8 max-sm:px-4 pt-12">
          <div className="flex items-center justify-between">
            <div className="max-w-md">
              <h1
                className="text-brand-neutral-80 text-6xl max-lg:text-4xl max-sm:text-3xl font-light leading-[68px] max-lg:leading-tight mb-4"
                style={{ fontFamily: "SVN-Gilroy, Inter, sans-serif" }}
              >
                One more friend
              </h1>
              <h2
                className="text-brand-navy text-[46px] max-lg:text-3xl max-sm:text-2xl font-bold leading-[60px] max-lg:leading-tight mb-6"
                style={{ fontFamily: "SVN-Gilroy, Inter, sans-serif" }}
              >
                Thousands more fun!
              </h2>
              <p
                className="text-brand-neutral-80 font-bold mb-8 max-w-sm"
                style={{ fontFamily: "Gabarito, Inter, sans-serif" }}
              >
                Having a pet means you have more joy, a new friend, a happy
                person who will always be with you to have fun. We have 200+
                different pets that can meet your needs!
              </p>
              <button
                className="flex items-center gap-2.5 pt-3.5 pb-2.5 px-7 bg-brand-navy rounded-[57px] text-white font-bold hover:bg-brand-dark-navy transition-colors"
                style={{ fontFamily: "Gabarito, Inter, sans-serif" }}
              >
                Explore Now
              </button>
            </div>
            <div className="hidden lg:block">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2Fe33c04ad181d47968df9f3990555750a%2F4a5c546fecc64bb5a0e3be69d1984208?format=webp&width=800"
                alt="Happy person with dog - One more friend, thousands more fun!"
                className="w-[600px] h-[450px] object-cover rounded-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Notification Banner */}
      <section className="w-full h-[102px] flex justify-center items-center py-7 px-[130px] max-lg:px-8 max-sm:px-4">
        <div className="w-full h-[44px] flex items-center justify-between gap-4 p-2.5 border-l-[3px] border-brand-dark-navy rounded-[5px] bg-hero-gradient">
          <p
            className="text-brand-navy text-sm font-bold"
            style={{ fontFamily: "Gabarito, Inter, sans-serif" }}
          >
            New offers just dropped! Check them out before they're gone. Up to
            50% off on winter wear—new arrivals included!
          </p>
          <Info className="w-6 h-6 text-brand-navy flex-shrink-0" />
        </div>
      </section>

      {/* Dashboard and Categories Section */}
      <section className="w-full bg-white px-[130px] max-lg:px-8 max-sm:px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Dashboard */}
          <div className="lg:w-[386px] bg-white p-4">
            <h3 className="text-black text-sm font-gabarito font-bold mb-4">
              Seven Pet Vet Hospital
            </h3>
            <div className="grid grid-cols-4 gap-4 text-xs">
              <div className="text-center">
                <div className="font-gabarito font-bold mb-2">DATE</div>
                <div className="space-y-2">
                  <div className="font-gilroy font-light">JUN 26</div>
                  <div className="font-gilroy font-light">JUN 26</div>
                  <div className="font-gilroy font-light">JUN 26</div>
                  <div className="font-gilroy font-light">JUN 26</div>
                  <div className="font-gilroy font-light">JUN 26</div>
                </div>
              </div>
              <div className="text-center">
                <div className="font-gabarito font-bold mb-2">SUPPLIER</div>
                <div className="space-y-2">
                  <div className="font-gilroy font-light">Coveture</div>
                  <div className="font-gilroy font-light">Amatheon</div>
                  <div className="font-gilroy font-light">Zootice</div>
                  <div className="font-gilroy font-light">Pet Shop</div>
                  <div className="font-gilroy font-light">Amour</div>
                </div>
              </div>
              <div className="text-center">
                <div className="font-gabarito font-bold mb-2">Total</div>
                <div className="space-y-2">
                  <div className="font-gilroy font-light">₹1000</div>
                  <div className="font-gilroy font-light">₹2500</div>
                  <div className="font-gilroy font-light">₹7000</div>
                  <div className="font-gilroy font-light">₹9020</div>
                  <div className="font-gilroy font-light">₹6000</div>
                </div>
              </div>
              <div className="text-center">
                <div className="font-gabarito font-bold mb-2">STATUS</div>
                <div className="space-y-2">
                  <div className="text-red-500 font-gabarito font-bold">
                    Processed
                  </div>
                  <div className="text-green-500 font-gabarito font-bold">
                    Completed
                  </div>
                  <div className="text-green-500 font-gabarito font-bold">
                    Completed
                  </div>
                  <div className="text-green-500 font-gabarito font-bold">
                    Completed
                  </div>
                  <div className="text-green-500 font-gabarito font-bold">
                    Completed
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="flex-1">
            <div className="mb-6">
              <h3 className="text-black text-sm font-gabarito font-bold mb-4">
                Featured Categories
              </h3>
              <div className="flex items-center justify-between gap-4">
                <button className="h-6 w-6 flex items-center justify-center bg-[rgba(16,53,89,0.18)] rounded-[5px]">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-4 overflow-x-auto">
                  {categories.map((category, index) => (
                    <CategoryCard
                      key={index}
                      name={category.name}
                      icon={category.icon}
                      bgColor={category.bgColor}
                    />
                  ))}
                </div>
                <button className="h-6 w-6 flex items-center justify-center bg-[rgba(16,53,89,0.18)] rounded-[5px]">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="w-full px-[130px] max-lg:px-8 max-sm:px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <div className="flex flex-col gap-0.5">
            <span className="text-black font-gabarito font-bold">
              Featured Products from your search
            </span>
            <span className="text-brand-navy text-2xl font-gilroy font-bold leading-9">
              Our Products
            </span>
          </div>
          <button className="flex items-center gap-2 py-3 px-7 border-[1.5px] border-brand-navy rounded-[57px] text-brand-navy text-sm font-gabarito font-bold hover:bg-brand-navy hover:text-white transition-colors">
            View more
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {additionalProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>

        {/* Vendors Section */}
        <div className="flex justify-between items-center mt-16 mb-8">
          <div className="flex items-end gap-2">
            <span className="text-black font-gilroy font-light leading-[31px]">
              Proud to be part of
            </span>
            <span className="text-brand-navy text-2xl font-gilroy font-bold leading-9">
              Vendors
            </span>
          </div>
          <button className="flex items-center gap-2 py-3 px-7 border-[1.5px] border-brand-navy rounded-[57px] text-brand-navy text-sm font-gabarito font-bold hover:bg-brand-navy hover:text-white transition-colors">
            View all Our Vendors
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-5">
          <img
            src="https://picsum.photos/151/112?random=vendor1"
            alt="Vendor 1"
            className="w-[151px] h-[112px] object-cover"
          />
          <img
            src="https://picsum.photos/151/112?random=vendor2"
            alt="Vendor 2"
            className="w-[151px] h-[112px] object-cover"
          />
          <div className="flex-1 h-[112px] bg-gray-100 rounded-lg"></div>
          <div className="flex-1 h-[112px] bg-gray-100 rounded-lg"></div>
          <div className="flex-1 h-[112px] bg-gray-100 rounded-lg"></div>
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="w-full px-[127px] max-lg:px-8 max-sm:px-4 py-8">
        <div className="w-full h-[378px] bg-brand-navy rounded-[20px] relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0">
            <div className="w-[782px] h-[635px] bg-brand-cream rounded-[99px] absolute left-[777px] top-[-360px] rotate-[25.23deg]"></div>
            <div className="w-[787px] h-[787px] bg-brand-dark-navy rounded-[99px] absolute left-[41px] top-[29px] rotate-[28.25deg]"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 h-full flex items-center justify-end pr-16 max-lg:pr-8">
            <div className="text-right max-w-md">
              <h2 className="text-brand-navy text-[52px] max-lg:text-3xl font-gilroy font-light leading-[68px] max-lg:leading-tight mb-2">
                One more friend
              </h2>
              <h3 className="text-brand-navy text-4xl max-lg:text-2xl font-gilroy font-bold leading-[54px] max-lg:leading-tight mb-4">
                Thousands more fun!
              </h3>
              <p className="text-brand-dark-gray text-xs font-gabarito font-bold mb-6 max-w-sm ml-auto">
                Having a pet means you have more joy, a new friend, a happy
                person who will always be with you to have fun. We have 200+
                different pets that can meet your needs!
              </p>
              <div className="flex items-center gap-4 justify-end">
                <button className="flex items-center gap-2 pt-3.5 pb-2.5 px-7 border-[1.5px] border-brand-navy rounded-[57px] text-brand-navy font-gabarito font-bold hover:bg-brand-navy hover:text-white transition-colors">
                  View Intro
                  <Play className="w-6 h-6" />
                </button>
                <button className="flex items-center gap-2.5 pt-3.5 pb-2.5 px-7 bg-brand-navy rounded-[57px] text-white font-gabarito font-bold hover:bg-brand-dark-navy transition-colors">
                  Explore Now
                </button>
              </div>
            </div>
          </div>

          {/* Background Image Overlay */}
          <img
            src="https://picsum.photos/1180/378?random=promo"
            alt="Promotional background"
            className="absolute inset-0 w-full h-full object-cover opacity-20"
          />
        </div>
      </section>

      {/* Pet Accessories */}
      <section className="w-full px-[130px] max-lg:px-8 max-sm:px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <div className="flex flex-col gap-0.5">
            <span className="text-black font-gabarito font-bold">
              Pet Accessories
            </span>
            <span className="text-brand-navy text-2xl font-gilroy font-bold leading-9">
              Do not miss the current offers until the end of June
            </span>
          </div>
          <button className="flex items-center gap-2 py-3 px-7 border-[1.5px] border-brand-navy rounded-[57px] text-brand-navy text-sm font-gabarito font-bold hover:bg-brand-navy hover:text-white transition-colors">
            View more
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Accessories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-5">
          {petAccessories.map((product) => (
            <div key={product.id} className="lg:col-span-2">
              <ProductCard {...product} />
            </div>
          ))}
        </div>

        {/* Large background image */}
        <div className="mt-8">
          <img
            src="https://picsum.photos/1182/394?random=accessories"
            alt="Pet accessories banner"
            className="w-full h-[394px] object-cover rounded-2xl"
          />
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
