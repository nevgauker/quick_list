'use client'
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation';
import { Product, useMyData } from '@/providers/my_data_provider';
import ProductRow from "@/components/ui/product_row"
import { getAllObjectFromRedis } from "@/utils/redis";
import { AlertModal } from "@/components/modals/alert_modal";
import { useAuth } from "@/providers/auth_provider";
export default function Admin() {
  const router = useRouter();
  const auth = useAuth()

  const { data,deleteProduct } = useMyData();
  
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)

  const goToProduct = (productId: string) => {
    if (!auth.user) { router.push('/signin') }

    router.push(`/${productId}`);
  };

  useEffect(() => { 
    console.log(auth.user)
  }, [auth.user])
  
  
  const tappedDeleteProduct = (product:Product) => {
    if (!auth.user) {
       router.push('/signin') 
        return
      }
   
    setProductToDelete(product)
    setIsOpen(true);
  };

  const confirmDelete = () => {
    if (productToDelete) {
      setIsOpen(false);
      deleteProduct(productToDelete)

    }
  };

  const dismissPopup = () => {
    setIsOpen(false);
  };

  
  return (
      <main className="flex min-h-screen flex-col p-5">
        <AlertModal
          isOpen={isOpen}
          onClose={() => dismissPopup()}
          onConfirm={() => confirmDelete()}
          loading={loading} />
                <div className="flex space-x-1 items-center justify-between">
                  <Button className="bg-red-600" onClick={() => {
                  auth.signOut()
                  router.push('/')
          }}>התנתק</Button>
                <h1 className="text-2xl underline" >מוצרים</h1>

          <Button onClick={() => goToProduct("new")}>הוסף חדש</Button>

                </div>
                       
                <div className='flex flex-col space-x-2 border-spacing-1 space-y-4 '>
                    {data.map((product) => (
                      <ProductRow
                        key={product.id}
                        product={product}
                        goTo={() => goToProduct(product.id)}
                        tappedDeleteProduct={()=> tappedDeleteProduct(product)}
                        isGuest={false} />
                    ))}        
             </div>
      </main>
  )
}

