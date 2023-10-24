'use client'

import Image from 'next/image'
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Product, useMyData } from '@/providers/my_data_provider'
import toast from "react-hot-toast";

interface ProductRowProps{
  product: Product
  goTo: (productId: string) => void
  tappedDeleteProduct:(product: Product) => void
  isGuest: boolean
}


const ProductRow: React.FC<ProductRowProps> = ({ product, goTo, tappedDeleteProduct, isGuest }) => {
const { data, updateProduct } = useMyData();
function takeProduct(productId: string) {
  var selectedItem = data.find(item => item.id === productId)
  if (!selectedItem) return
  const count = parseInt(selectedItem.amount) - 1
  if (count < 0) {
    toast.error("לא ניתן לקחת .לא קיים במלאי")
    return
  } 
  selectedItem.amount = count.toString();
  updateProduct(selectedItem)
  toast.success(`${product.name} נלקח. ${count} נותרו`);

}
function bringProduct(productId: string) {
    const selectedItem = data.find(item => item.id === productId)
  if (!selectedItem) return
  const count = parseInt(selectedItem.amount) + 1
  selectedItem.amount = count.toString()
  updateProduct(selectedItem)
    toast.success(`${product.name} הוחזר. ${count} נותרו`);


}
  // function update(product: Product, amount: number) {
  //   updateProduct(product)
  
  // }
  return (
       <div key={product.id} className='flex flex-col space-x-5 my-5 border-solid border-2 border-gray-500 items-center p-1 md:flex-row'>
            <Image src={'/new.png'} alt="item image" width={40} height={40}/>
            <div className='flex flex-col my-4'>
              <Label className='text-right underline' htmlFor="name">שם</Label>
              <h2 className='break-words whitespace-normal'>{product.name}</h2>
            </div>
            <div className='flex flex-col my-4'>
              <Label className='text-right underline' htmlFor="category">קטגוריה</Label>
               <h2>{product.category}</h2>  
            </div>
            <div className='flex flex-col my-4'>
              <Label className='text-right underline' htmlFor="amount">כמות</Label>
               <h2>{product.amount}</h2>
             </div>
            <div className='flex flex-col my-4'>
               <Label className='text-right underline' htmlFor="floor">קומה</Label>
                <h2>{product.floor}</h2>
            </div>
            <div className='flex flex-col my-4'>
               <Label className='text-right underline' htmlFor="floor">האם צריך להחזיר</Label>
                <h2>{product.needToReturn ? 'כן' : 'לא'}</h2>
            </div>
            {
        isGuest ? (<div className='flex space-x-1'>
          <Button onClick={() => takeProduct(product.id)}>לוקח</Button>
            {product.needToReturn ? <Button onClick={() => bringProduct(product.id)}>מחזיר</Button> :null}
        </div>) : (
            <div className='flex space-x-1'>
              <Button onClick={() => goTo(product.id)}>ערוך</Button>
              <Button className='bg-red-500' onClick={() => tappedDeleteProduct(product)}>מחק</Button>
            </div>
                  )
            }
           
          </div>
    )
}

export default ProductRow