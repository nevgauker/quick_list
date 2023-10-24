"use client"
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from 'react';
import { useMyData } from '@/providers/my_data_provider';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation'
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
// import { saveObjectToRedis }  from '../../utils/redis'
import toast from "react-hot-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { generateUniqueID } from '@/lib/utils'
import { useAuth } from '@/providers/auth_provider'

export default function Product() {
    const router = useRouter();
    const { data,addProduct,updateProduct } = useMyData();
    const [newProduct, setNewProduct] = useState({
        id: generateUniqueID(),
        name: '',
        amount: '',
        category: '',
        floor: '',
        needToReturn: false
    });

    const { productId } = useParams();
    const auth = useAuth()


    const handleFormSubmit = async (e:any) => {
    e.preventDefault();
    
        // Create a new Product object from the form input values
        
         const productToAddOrUpdate = {
                id: newProduct.id, // Assign a unique ID (you may need a more robust method)
                name: newProduct.name,
                amount: newProduct.amount,
                category: newProduct.category,
                floor: newProduct.floor,
                needToReturn: newProduct.needToReturn
                };
   
        
        const selectedItem = data.find(item => item.id === productId)
        if (selectedItem) {
              //update existing product
            updateProduct(productToAddOrUpdate)
            toast.success("פרטי המוצר עודכנו")
        } else {
            addProduct(productToAddOrUpdate)
            toast.success('נוסף מוצר חדש')
        }
        
    router.push('/admin');
    };

     useEffect(() => { 
      if (!auth.user){ router.push('/signin')}
  },[auth.user, router])

    useEffect(() => { 
        const selectedItem = data.find(item => item.id === productId)
        if (selectedItem == null) { return }
        setNewProduct({
            id: selectedItem.id,
            name: selectedItem.name,
            amount: selectedItem.amount,
            category: selectedItem.category,
            floor: selectedItem.floor,
            needToReturn: selectedItem.needToReturn
            });

    },[data, productId])
    
    return (
        <div className='flex flex-col items-center justify-evenly'>
            <h1>הסברים</h1>
            <Accordion type="single" collapsible>
                <AccordionItem value="name">
                    <AccordionTrigger>שם</AccordionTrigger>
                    <AccordionContent>
                    שם המוצר - קצר וקל להבנה
                    </AccordionContent>
                </AccordionItem>
                  <AccordionItem value="name">
                    <AccordionTrigger>כמות</AccordionTrigger>
                    <AccordionContent>
                    הכמות הזמינה כעת
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="category">
                    <AccordionTrigger>קטגוריה</AccordionTrigger>
                    <AccordionContent>
                    מוצרי  הגיינה,נקיון,מזון וכדומה
                    </AccordionContent>
                </AccordionItem>
                 <AccordionItem value="floor">
                    <AccordionTrigger>קומה</AccordionTrigger>
                    <AccordionContent>
                    הקומה בהם הם מאוכסנים. 0 ללובי
                    </AccordionContent>
                </AccordionItem>
                 <AccordionItem value="need">
                    <AccordionTrigger>האם צריך להחזיר</AccordionTrigger>
                    <AccordionContent>
                    עבור מוצרים גדולים או לשימוש רב פעמי
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
            <Separator />
            <h1>פרטי המוצר</h1>
            <form onSubmit={handleFormSubmit}>
                <div className='py-3 flex flex-col items-end'>
                <Label className='text-right mb-2' htmlFor="name">שם</Label>
                    <Input
                        className='text-right'
                        type="text"
                        id="name"
                        placeholder="שם"
                         value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    />
                </div>
                <div className='py-3 flex flex-col items-end'>
                    <Label className='text-right mb-2' htmlFor="amount">כמות</Label>
                    <Input
                        className='text-right'
                        type="text"
                        id="amount"
                        placeholder="כמות"
                        value={newProduct.amount}
                        onChange={(e) => setNewProduct({ ...newProduct, amount: e.target.value })}
                    />
                </div>
                <div className='py-3 flex flex-col items-end'>
                    <Label className='text-right mb-2' htmlFor="category">קטגוריה</Label>
                    <Input
                        className='text-right'
                        type="text"
                        id="category"
                        placeholder="קטגוריה"
                        value={newProduct.category}
                        onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    />
                </div>
                <div className='py-3 flex flex-col items-end'>
                    <Label className='text-right mb-2' htmlFor="floor">קומה</Label>
                    <Input
                        className='text-right'
                        type="text"
                        id="floor"
                        placeholder="קומה"
                        value={newProduct.floor}
                        onChange={(e) => setNewProduct({ ...newProduct, floor: e.target.value })}
                    />
                </div>
                 <div className='py-3 flex flex-col items-end'>
                    <Label className='text-right mb-2' htmlFor="floor">האם צריך להחזיר</Label>
                    <Switch
                        checked={newProduct.needToReturn}
                         onCheckedChange={(checked) => setNewProduct({ ...newProduct, needToReturn: checked })}
                    />
                </div>
                <Button type="submit" >שמור</Button>
            </form>
        </div>
    )
}