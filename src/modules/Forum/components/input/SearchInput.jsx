import React from 'react'
import { Search } from 'lucide-react'

export const SearchInput = () => {
  return (
    <div className="relative flex-grow">
      <input
        type="text"
        placeholder="Search by course name"
        className="w-full bg-white border rounded-md py-2 pl-10 pr-3 text-sm leading-5 focus:outline-none  focus:border-blue-500"
      />
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
    </div>
  )
}
