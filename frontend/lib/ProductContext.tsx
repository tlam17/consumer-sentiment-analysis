"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import api from "@/utils/api";
import { Product } from "@/types/products";

interface ProductContextType {
    products: Product[];
    loading: boolean;
    error: string | null;
    refetchProducts: () => Promise<void>;
}

const ProductContext = createContext<ProductContextType>({
    products: [],
    loading: false,
    error: null,
    refetchProducts: async () => {},
});

export const useProducts = () => useContext(ProductContext);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
  
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await api.get("/products");
        setProducts(res.data);
        setError(null);
      } catch (error: any) {
        // If it's a 404, it just means there are no products yet
        if (error.response && error.response.status === 404) {
          setProducts([]);
          setError(null);
        } else {
          setError("Failed to load products. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };
  
    // Initial fetch
    useEffect(() => {
      fetchProducts();
    }, []);
  
    return (
      <ProductContext.Provider value={{ products, loading, error, refetchProducts: fetchProducts }}>
        {children}
      </ProductContext.Provider>
    );
};