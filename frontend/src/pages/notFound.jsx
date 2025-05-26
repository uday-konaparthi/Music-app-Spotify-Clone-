import React from 'react'
import { Link } from 'react-router-dom'

const Notfound = () => {
  return (
    <div className='flex flex-col justify-center items-center gap-2 mt-[30%]'>
      <h1 className='font-bold text-7xl'>404</h1>
      <h4>Not Found</h4>
      <Link to={'/'} className='text-blue-500 hover:underline cursor-pointer'>Go to Home</Link>
    </div>
  )
}

export default Notfound