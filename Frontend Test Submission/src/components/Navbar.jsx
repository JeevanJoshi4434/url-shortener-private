import React from 'react'
import SearchBar from './SearchBar'

const Navbar = () => {
    return (
        <nav className='h-16 bg-black text-white flex items-center justify-between p-2'>
            <h1 className='text-2xl'>URL Shortner</h1>
            <SearchBar />
        </nav>
    )
}

export default Navbar