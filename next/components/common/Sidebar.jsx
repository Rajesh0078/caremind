'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import { FiSearch } from 'react-icons/fi'
import { FaMoneyBillWave, FaPlug, FaUsers } from "react-icons/fa6";
import { BsActivity, BsDatabaseFill, BsFillMoonStarsFill, BsGearFill, BsGridFill, BsHousesFill, BsShieldLockFill } from "react-icons/bs";
import { MdLightMode } from "react-icons/md";

const Sidebar = () => {
  const pathname = usePathname()

  const links = [
    {
      name: 'Dashboard',
      icon: <BsGridFill className='text-[20px]'/>,
      path: '/'
    },
    {
      name: 'Tenants',
      icon: <BsHousesFill  className='text-[19px]'/>,
      path: '/tenants'
    },
    {
      name: 'Users',
      icon: <FaUsers  className='text-[21px]'/>,
      path: '/users'
    },
    {
      name: "Access Control",
      icon: <BsShieldLockFill className="text-[18px]" />,
      path: "/access-control",
    },
    {
      name: "Audit Logs",
      icon: <BsActivity className="text-[19px]" />,
      path: "/audit-logs",
    },
    {
      name: "Billing",
      icon: <FaMoneyBillWave className="text-[18px]" />,
      path: "/billing",
    },
    {
      name: "Integrations",
      icon: <FaPlug className="text-[19px]" />,
      path: "/integrations",
    },
    {
      name: "Data Management",
      icon: <BsDatabaseFill className="text-[18px]" />,
      path: "/data-manage",
    },
    {
      name: "Settings",
      icon: <BsGearFill className="text-[18px]" />,
      path: "/settings",
    },
  ]

  return (
    <aside className='min-w-60'>
      <div className='h-16 flex items-center gap-2 px-4 pt-2'>
        <div className='h-10 w-10 bg-linear-to-t from-primary-2 to-primary rounded-md text-white flex items-center justify-center'>
          CM
        </div>
        <div className='pt-1'>
          <p className='text-[20px] uppercase font-medium text-primary leading-5 tracking-wide'>CareMind</p>
          <p className='text-[12px] text-gray-500'>Minding operations</p>
        </div>
      </div>
      <div className='px-4 pt-2 pb-4 flex flex-col justify-between h-[calc(100%-64px)]'>
        <div>
          <div className='flex px-2 items-center gap-1.5 border border-line rounded-[10px]'>
            <FiSearch className='text-[22px] mb-0.5 text-[#8e8f93]'/>
            <input
              type="text"
              placeholder='Search...'
              className='outline-none h-10'
            />
          </div>
          <div className='py-3'>
            {
              links.map(link => {
                const isActive = pathname === link.path;
                console.log(pathname);
                return (
                  <Link
                    key={link.name}
                    href={link.path}
                    className={`${isActive ? 'bg-background text-primary border border-line' : 'text-gray-600 border-transparent'} border rounded-[10px] p-3 flex items-center gap-2`}
                  >
                    {link.icon}
                    {link.name}
                  </Link>
                )
              })
            }
          </div>
        </div>
        <div className='rounded-[10px] flex p-2 bg-[#F5F6F8]'>
          <div className={`h-10 flex-1 bg-white rounded-[10px] shadow flex items-center justify-center gap-2 font-medium`}>
            <MdLightMode className='text-[20px]'/>
            Light
          </div>
          <div className={`h-10 flex-1 text-[#83899F] flex items-center justify-center gap-2`}>
            <BsFillMoonStarsFill />
            Dark
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar