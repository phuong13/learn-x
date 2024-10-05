import React from 'react';
import UserMenuDropdown from './UserMenuDropDown';
function Header() {
  return (
    <nav >
      {/* Top Navbar */}
      <div className="bg-gradient-to-r from-[#45DFB1] to-[#213A57] p-2 px-4 sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center ">
          {/* Left Icons */}
          <div className="flex space-x-4">
            <a href="" className="hover:text-gray-300">
              <i className="fa-solid fa-earth-europe text-2xl"></i>
            </a>
            <a href="#facebook" className="hover:text-gray-300">
              <i className="fab fa-facebook text-2xl "></i> {/* Facebook Icon */}
            </a>
          </div>

          {/* Right Notifications and Profile */}
          <div className="flex items-center space-x-4 text-xl">
            <a href="#notifications" className="relative hover:text-gray-300">
              <i className="fas fa-bell text-gray"></i> {/* Bell Icon */}
            </a>
            <a href="#messages" className="hover:text-gray-300">
              <i className="fas fa-comment text-gray"></i> {/* Message Icon */}
            </a>
            <div className="flex items-center">
              <UserMenuDropdown />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Header;
