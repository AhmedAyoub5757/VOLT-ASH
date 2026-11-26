export interface LookProduct {
  name: string;
  price: string;
  image: string; // filename in /public/assets/lookbook/products/
}

export interface Look {
  id: string;
  number: number; // display number (01-06)
  modelImage: string; // filename in /public/assets/lookbook/models/
  ratio: number; // width/height ratio used to size the model container
  products: LookProduct[];
}

export const LOOKS: Look[] = [
  {
    id: "streetwear",
    number: 1,
    modelImage: "model-streetwear.png",
    ratio: 0.4,
    products: [
      { name: "Feather-weight Bomber", price: "$285", image: "streetwear-1.png" },
      { name: "Cargo Utility Trousers", price: "$180", image: "streetwear-2.png" },
    ],
  },
  {
    id: "casual-wear",
    number: 2,
    modelImage: "model-casual-wear.png",
    ratio: 0.34,
    products: [
      { name: "Soft Ground Tee", price: "$95", image: "casual-wear-1.png" },
      { name: "Relaxed Straight Trousers", price: "$140", image: "casual-wear-2.png" },
    ],
  },
  {
    id: "smart-casual",
    number: 3,
    modelImage: "model-smart-casual.png",
    ratio: 0.3,
    products: [
      { name: "Quiet Leverage Blazer", price: "$340", image: "smart-casual-1.png" },
      { name: "Tailored Wool Trousers", price: "$220", image: "smart-casual-2.png" },
    ],
  },
  {
    id: "activewear",
    number: 4,
    modelImage: "model-activewear.png",
    ratio: 0.28,
    products: [
      { name: "Full Voltage Top", price: "$120", image: "activewear-1.png" },
      { name: "Compression Leggings", price: "$110", image: "activewear-2.png" },
    ],
  },
  {
    id: "modest-wear",
    number: 5,
    modelImage: "model-modest-wear.png",
    ratio: 0.42,
    products: [
      { name: "Quiet Architecture Dress", price: "$265", image: "modest-wear-1.png" },
      { name: "Cream Wrap Layer", price: "$195", image: "modest-wear-2.png" },
    ],
  },
  {
    id: "boho-chic",
    number: 6,
    modelImage: "model-boho-chic.png",
    ratio: 0.38,
    products: [
      { name: "Wild Field Top", price: "$145", image: "boho-chic-1.png" },
      { name: "Fringed Kimono Jacket", price: "$210", image: "boho-chic-2.png" },
    ],
  },
];