import { Product } from "./Product";

export type GetProductsApiResponse = {
  products: Product[];
  total: number;
  limit: number;
  skip: number;
};
