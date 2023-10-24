'use client'

import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation';
import { useMyData } from '@/providers/my_data_provider';


import ProductRow from "@/components/ui/product_row"


export default function Guests() {
  const router = useRouter();
  const { data } = useMyData();

  const goToProduct = (productId:string) => {
    router.push(`/${productId}`);
  };

  return (
        <main className="flex min-h-screen flex-col p-5">
              <div className='flex justify-between items-center'>
        <h1>מוצרים</h1>
        <Button onClick={() => { 
                    router.push('/admin')
                }}>אני מנהל</Button>
              </div>
      <div className='flex flex-col space-x-2 border-spacing-1 space-y-4 '>
        {data.map((product) => (
          <ProductRow key={product.id} product={product} goTo={() => goToProduct(product.id.toString())} tappedDeleteProduct={()=>{}} isGuest={true} />
        ))}        
      </div>
      </main>
  )
}

