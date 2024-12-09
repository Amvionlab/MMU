import React from 'react'
import { FaFilter } from "react-icons/fa";
import { PiDotsThreeOutlineThin } from "react-icons/pi";
import { VscSettings } from "react-icons/vsc";
import { MdSpaceDashboard } from "react-icons/md";
import { BiCctv } from "react-icons/bi";
import { FaFingerprint } from "react-icons/fa6";
import { MdOutlineGpsFixed } from "react-icons/md";
import { MdNoteAlt } from "react-icons/md";

function MMU() {
  return (
    <main className='p-4 bg-white h-full'>
        <section>
            <div>
                <h1 className='font-semibold text-2xl'>MMU-1</h1>
            </div>
        </section>

        {/* <section>
          <div className='mt-4 grid grid-cols-2 gap-2'>
            <div className='flex gap-2'>
        <form class="form relative">
  <button class="absolute left-2 -translate-y-1/2 top-1/2 p-1">
    <svg
      width="17"
      height="16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-labelledby="search"
      class="w-5 h-5 text-gray-700"
    >
      <path
        d="M7.667 12.667A5.333 5.333 0 107.667 2a5.333 5.333 0 000 10.667zM14.334 14l-2.9-2.9"
        stroke="currentColor"
        stroke-width="1.333"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></path>
    </svg>
  </button>
  <input
    class="input rounded-md w-96 px-8 py-2 border-2 border-gray-100 focus:outline-none focus:border-gray-200 placeholder-gray-400 transition-all duration-300"
    placeholder="Search..."
    required=""
    type="text"
  />
  <button type="reset" class="absolute right-3 -translate-y-1/2 top-1/2 p-1">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="w-5 h-5 text-gray-700"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M6 18L18 6M6 6l12 12"
      ></path>
    </svg>
  </button>
</form>
<div>
  <div className='border-2 border-black w-24 flex items-center justify-center gap-4 py-2 bg-white rounded-md'><FaFilter /> Filter</div>

</div>
</div>

<div>
  <div className='flex justify-end items-center gap-4'>
    <h2 className='font-semibold'>Grouped By</h2>
    <select name="" id="" className='p-3 w-52 border-2 border-black rounded-md'>
      <option value="">Warehouse</option>
      <option value="">Bio Metric</option>
      <option value="">Gps Tracker</option>
    </select>
    <div className='border-2 border-black bg-white p-4 w-12 rounded-md'>
    <PiDotsThreeOutlineThin />
    </div>
    <div className='border-2 border-black bg-white p-4 w-12 rounded-md'>
    <VscSettings />
    </div>
  </div>
</div>

</div>
        </section> */}

        <section className='mt-8 border border-gray-200 p-4 rounded-sm'>
          <h2 className='flex items-center gap-4 font-semibold text-xl mt-8'><MdSpaceDashboard size={24}/>Dashboard</h2>

          <div className='grid grid-cols-4 gap-4 mt-8'>

              <div className='bg-white w-full min-h-80 flex justify-center items-center rounded-md shadow-md'>
                <div className=''>
                  <BiCctv size={100}/>
                  <h2 className='font-semibold mt-4'>IP Surveillance</h2>
                </div>
              
              </div>

              <div className='bg-white w-full min-h-80 flex justify-center items-center rounded-md shadow-md'>
                <div>
              <FaFingerprint size={80}/>
               <h2 className='font-semibold mt-4'>Bio - Metric</h2>
              </div>
              </div>
              <div className='bg-white w-full min-h-80 flex justify-center items-center rounded-md shadow-md'>
                <div>
              <MdOutlineGpsFixed size={80}/>
              <h2 className='font-semibold mt-4 text-center'>GPS</h2>
              </div>
              </div>
                 <div className='bg-white w-full min-h-80 flex justify-center items-center rounded-md shadow-md'>
                  <div className=''>
                 <MdNoteAlt size={80} className='ml-8'/>
                 <h2 className='font-semibold mt-4'>E-Presribing Software</h2>
                 </div>
                 </div>
          </div>

        </section>
    </main>
  )
}

export default MMU