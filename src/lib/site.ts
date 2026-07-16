export const SITE = {
  name: "Rakesh Shoe Store",
  tagline: "Premium Footwear for Every Occasion",
  subtagline: "Quality Shoes • Affordable Prices • Trusted Since Years",
  phone: "+91 9828270127",
  phoneRaw: "919828270127",
  address: "Jama Masjid, Bharatpur, Rajasthan, India",
  hours: [
    { day: "Monday – Saturday", time: "10:00 AM – 9:30 PM" },
    { day: "Sunday", time: "11:00 AM – 8:30 PM" },
  ],
  categories: [
    "Sports Shoes",
    "Running Shoes",
    "Casual Shoes",
    "Formal Shoes",
    "School Shoes",
    "Sandals",
    "Slippers",
    "Women's Footwear",
    "Kids Footwear",
    "Clearance Deals",
  ] as const,
};

export function whatsappUrl(message: string): string {
  const text = encodeURIComponent(message);
  return `https://wa.me/${SITE.phoneRaw}?text=${text}`;
}

export function whatsappBuyUrl(productName: string): string {
  return whatsappUrl(
    `Hello, I want to buy this footwear listed on your website:\n\n${productName}\n\nIs it still available?`,
  );
}
