import { MyDataProvider } from '@/providers/my_data_provider';
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { createContext, useContext, useState } from 'react';
import { ToastProvider } from '@/providers/toast-provider';
import { AuthProvider } from '@/providers/auth_provider';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Quick List',
  description: 'Simmple inventory list',
}

 


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
  }) {
  
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <MyDataProvider>
            <ToastProvider/>
            {children}
          </MyDataProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
