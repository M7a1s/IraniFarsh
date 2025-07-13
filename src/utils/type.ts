export type ProductType = {
  id: string;
  title: string;
  image: string;
  price: number;
  size: string;
  type: string;
  company: string;
  feature: { backgroundColor: string; carpetQuality: string; weftMaterial: string; shape: string; pileMaterial: string; warpMaterial: string };
  rate: { performance: string; rate: number };
  comments: string[];
};

export type UserType = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
};

export type BlogType = {
  id: string;
  title: string;
  content: string;
  image: string;
  created_at: Date;
};