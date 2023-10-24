"use client"

import { generateUniqueID } from '@/lib/utils';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type AuthContextType = {
  user: User | null;
  signIn: (email: string, password: string) => Promise<{id:string,email:string}| Error>;
  signOut: () => void;
};

type User = {
  id: string;
  email: string;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
 
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        const email = localStorage.getItem('email');
        const user = { id: token, email: email || '' };
        console.log("auth setup");
        setUser(user);
      }
    };

    const fetchDataPromise = fetchData();
    fetchDataPromise.then(() => {
      
    });
  }, []);
    
  // const signIn = async (email: string, password: string) => {
  //   if (process.env.NEXT_PUBLIC_ADMIN === email &&
  //           process.env.NEXT_PUBLIC_ADMIN_PASS === password
  //   ) {
  //           const id = generateUniqueID()
  //           console.log('login success: ' + JSON.stringify(email));
  //           const user = { id: id, email: email };
  //           setUser(user);
  //           const token = id
  //           localStorage.setItem('authToken', token);
  //           localStorage.setItem('email', email);
  //       } else {
           
  //       }
  // };
  
  const signIn = async (email: string, password: string): Promise<{id:string,email:string}| Error> => {

    return new Promise((resolve, reject) => {
      if (process.env.NEXT_PUBLIC_ADMIN === email && process.env.NEXT_PUBLIC_ADMIN_PASS === password) {
        const id = generateUniqueID();
        console.log('login success: ' + JSON.stringify(email));
        const user = { id: id, email: email };
        setUser(user);
        const token = id;
        localStorage.setItem('authToken', token);
        localStorage.setItem('email', email);
        resolve(user); // Resolve the promise after state update
      } else {
        reject(new Error('Login failed')); // Reject the promise in case of failure
      }
    });
  };
  

  const signOut = () => {
    // Clear the user and the token
    setUser(null);
    localStorage.removeItem('authToken');
  };

  const contextValue: AuthContextType = {
    user,
    signIn,
    signOut,
  };

  return <AuthContext.Provider
    value={contextValue}>{children}</AuthContext.Provider>;
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuth };
