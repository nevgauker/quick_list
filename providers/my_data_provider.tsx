"use client"

import { createContext, useContext, useState, ReactNode, useMemo } from 'react'
import { updateRedisData,getAllObjectFromRedis } from '../utils/redis'
import { useEffect } from 'react'
import io from "socket.io-client";
import { generateUniqueID } from '@/lib/utils';

const clientId = generateUniqueID()

export interface Product {
  id: string;
  name: string;
  category: string;
  floor: string;
  amount: string;
  needToReturn: boolean;
}

export function productToJson(product: Product): string {
  try {
    const json = JSON.stringify(product);
    return json;
  } catch (error) {
    console.error("Error converting product to JSON: " + error);
    return "";
  }
}

export function createProductFromJSON(json: any): Product {
  
  // Validate and map JSON properties to the Product interface
  return {
    id: json.id || 0, // Use a default value if 'id' is missing
    name: json.name || '',
    category: json.category || '',
    floor: json.floor || '',
    amount: json.amount || '',
    needToReturn: json.needToReturn || false,
  };
}

interface MyData {
  data: Product[];
  addProduct: (product: Product) => void
  updateProduct: (product: Product) => void
  deleteProduct: (product: Product) => void
 // setData: React.Dispatch<React.SetStateAction<Product[]>>;
}

const MyDataContext = createContext<MyData | undefined>(undefined);

export function MyDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<Product[]>([]);
  const socket = io("https://quick-list-socket-server-de5db0877e75.herokuapp.com/");

 interface EventListeners {
  [eventName: string]: (socketData: any) => void;
 }
  
 const eventListeners:EventListeners = useMemo(() => {
    const listeners = {
      newObject: (socketData:any) => {
      
        console.log('New Object:', socketData);
        if (clientId !== socketData.sender) {
          const newProduct = createProductFromJSON(socketData.product)
          setData((prevData) => [...prevData, newProduct]);
        }

      },
      updateObject: (socketData:any) => {
        
        console.log('Update Object:', socketData);
        if (clientId !== socketData.sender) { 
          const updatedProduct = createProductFromJSON(socketData.product)
          setData((prevData) => {
             const updatedData = prevData.map((product) =>
              product.id === updatedProduct.id ? updatedProduct : product
             );
            return updatedData
          });
        }
      },
      deleteObject: (socketData:any) => {
        
        console.log('Delete Object:', socketData);
        if (clientId !== socketData.sender) { 
          const deletedProduct = createProductFromJSON(socketData.product)
          console.log('Deleted Product:', deletedProduct);
          setData((prevData) => {
            const updatedData = prevData.filter((product) => product.id !== deletedProduct.id);
            console.log('Updated Data:', updatedData);
            return updatedData;
        });

        }
      },

    };

    return listeners;
 }, [data]);
  
 const addSocketEventListeners = () => {
  for (const eventName in eventListeners) {
    if (eventListeners.hasOwnProperty(eventName)) {
      socket.on(eventName, eventListeners[eventName]);
    }
  }
};
  
  useEffect(() => {
    addSocketEventListeners()
    const fetchAndSetData = async () => {
      const redisData = await getAllObjectFromRedis()
      if (redisData) {
        setData(redisData);
      }
    };
    fetchAndSetData();
    return () => {
    for (const eventName in eventListeners) {
      if (eventListeners.hasOwnProperty(eventName)) {
        socket.off(eventName, eventListeners[eventName]);
      }
    }
  };
  }, []);
  
  function addProduct(newProduct: Product) {
    const updatedData = [...data, newProduct];
    updateRedisData(updatedData); // Update Redis with the new data
    setData(updatedData)
    const json = createProductFromJSON(newProduct)
    const encapsulatedJSON = {
      product: json,
      sender: clientId,
    };
    socket.emit("newObject", encapsulatedJSON);
  }
  
  function updateProduct(updatedProduct: Product) {
    const updatedData = data.map((product) =>
        product.id === updatedProduct.id ? updatedProduct : product
      ); 

    updateRedisData(updatedData) // Update Redis with the updated data
    setData(updatedData)
    const json = createProductFromJSON(updatedProduct)
    const encapsulatedJSON = {
      product: json,
      sender: clientId,
    };
    socket.emit("updateObject", encapsulatedJSON);
  }
  function deleteProduct(product: Product) {
    console.log("deleting product...")
    console.log(data.length)
    const updatedData = data.filter(item => item !== product)
    console.log(updatedData.length)

    updateRedisData(updatedData)
    setData(updatedData)
    const json = createProductFromJSON(product)

    const encapsulatedJSON = {
          product: json,
          sender: clientId,
    };
    socket.emit("deleteObject", encapsulatedJSON);
  }
  
  return (
    <MyDataContext.Provider value={{ data,addProduct,updateProduct,deleteProduct }}>
      {children}
    </MyDataContext.Provider>
  );
}

export function useMyData() {
  const context = useContext(MyDataContext);
  if (context === undefined) {
    throw new Error('useMyData must be used within a MyDataProvider');
  }
  return context;
}
