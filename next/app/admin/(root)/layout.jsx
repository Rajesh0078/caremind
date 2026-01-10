import Sidebar from '@/components/common/Sidebar';
import React from 'react'

const layout = ({ children }) => {
  return (
    <div className='flex min-h-dvh bg-white'>
      <Sidebar/>
      <div className='flex-1'>
        <header className='h-16 flex justify-between items-center p-4'>
          Dashboard
          <button className='bg-linear-to-t from-primary-2 to-primary text-white rounded-sm px-4 py-2'>
            + New
          </button>
        </header>
        <div className='bg-[#f5f7fb] border border-slate-200 h-[calc(100%-64px)] rounded-tl-2xl'>
          {children}
        </div>
      </div>
    </div>
  )
}

export default layout