export interface Testimonial {
  id: number;
  quote: string;
  name: string;
  role: string;
  imageSrc: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    quote:
      "The fit held up exactly the way the stats page promised — relaxed but never sloppy. First piece I've bought where the construction notes actually matched the garment.",
    name: "Amara R.",
    role: "Streetwear capsule",
    imageSrc: "/assets/testimonials/testimonial-1.jpg",
  },
  {
    id: 2,
    quote:
      "Ordered the blazer for a work trip on a whim. It moved through three flights and two meetings and still looked tailored at the end of the day.",
    name: "Ines M.",
    role: "Smart Casual capsule",
    imageSrc: "/assets/testimonials/testimonial-2.jpg",
  },
  {
    id: 3,
    quote:
      "The fringe jacket is the first 'statement' piece I've owned that I actually reach for every week. Fabric feels better in person than in the photos, somehow.",
    name: "Priya K.",
    role: "Boho-Chic capsule",
    imageSrc: "/assets/testimonials/testimonial-3.jpg",
  },
];