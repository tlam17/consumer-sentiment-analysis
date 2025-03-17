"use client";

import { ProductProvider } from "@/lib/ProductContext";
import ProductList from "./products-list";

export default function Products() {
  return (
    <ProductProvider>
      <ProductList />
    </ProductProvider>
  );
}