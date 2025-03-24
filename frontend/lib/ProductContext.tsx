"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import api from "@/utils/api";
import { Product } from "@/types/products";
import { toast } from "sonner";

interface ProductContextType {
    products: Product[];
    loading: boolean;
    error: string | null;
    refetchProducts: () => Promise<void>;
    updateProduct: (productId: string, updates: {name: string, category: string, description: string}) => Promise<void>;
    deleteProduct: (productId: string) => Promise<void>;
}

const ProductContext = createContext<ProductContextType>({
    products: [],
    loading: false,
    error: null,
    refetchProducts: async () => {},
    updateProduct: async () => {},
    deleteProduct: async () => {},
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

    // Update product
    const updateProduct = async (product_id: string, updates: {name: string, category: string, description: string}) => {
        try {
          const res = await api.put(`/products/${product_id}`, updates);
          const updatedProduct = res.data;

          // Update product in state
          setProducts((prevProducts) =>
            prevProducts.map((product) =>
              product.product_id === product_id ? updatedProduct : product
            )
          );

          toast.success("Product updated successfully!", {id: "update-product-toast"});
        } catch (error: any) {
          console.error("Update error:", error);
          toast.error("Failed to update product. Please try again.");
        }
    };
    

    // Delete product
    const deleteProduct = async (product_id: string) => {
      try {
        await api.delete(`/products/${product_id}`);

        // Remove deleted product from state
        setProducts((prevProducts) => prevProducts.filter((product) => product.product_id !== product_id));

        toast.success("Product deleted successfully!", {id: "delete-product-toast"});
      } catch (error: any) {
        console.error("Delete error:", error);
        toast.error("Failed to delete product. Please try again.");
      }
    };

    // Initial fetch
    useEffect(() => {
      fetchProducts();
    }, []);
  
    return (
      <ProductContext.Provider value={{ products, loading, error, refetchProducts: fetchProducts, updateProduct, deleteProduct }}>
        {children}
      </ProductContext.Provider>
    );
};