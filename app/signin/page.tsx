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
import { useAuth } from '@/providers/auth_provider';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { generateUniqueID } from '@/lib/utils'

export default function Signin() {
    const router = useRouter();
    const auth = useAuth()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleFormSubmit = async (e:any) => {
        e.preventDefault();

        auth.signIn(email, password)
        .then((user:{id:string,email:string}|Error) => {
          console.log('User:', user);
          toast.success('התחברת בהצלחה')
          router.back()
        })
        .catch((error: Error) => {
          // Handle the error if login fails.
          console.error('Login failed:', error);
          toast.error('ניסון חיבור כושל. ודא אימייל וסיסמה תקינים')
        });

    };

    
    
    return (
        <div className='flex flex-col items-center justify-evenly'>
            <h1>התחברות</h1>
            <form onSubmit={handleFormSubmit}>
                <div className='py-3 flex flex-col items-end'>
                <Label className='text-right mb-2' htmlFor="email">אימייל</Label>
                    <Input
                        required
                        className='text-right'
                        type="text"
                        id="email"
                        placeholder="example@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className='py-3 flex flex-col items-end'>
                <Label className='text-right mb-2' htmlFor="password">סיסמה</Label>
                    <Input
                        required
                        className='text-right'
                        type="password"
                        id="password"
                        placeholder="******"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className='flex flex-col space-y-4'>
                <Button type="submit">התחבר</Button>
                <Button onClick={() => { 
                    router.push('/guests')
                }}>אני אורח</Button>

                </div>
              
            </form>
        </div>
    )
}