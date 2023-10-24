import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col p-5 space-y-5 justify-center items-center">
        <h1 className='text-2xl font-bold'>בחר תפקיד</h1>
        <Link className='underline text-xl' href="/admin">ניהול</Link>
        <Link className='underline text-xl' href="/guests">אורח</Link>
      </main>
  )
}

