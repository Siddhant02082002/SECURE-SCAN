import { Link } from 'react-router-dom';
function Navbar(){
    return (
        <nav className="bg-gray-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-white text-xl font-bold">
            API Dashboard
          </div>
          <ul className="flex space-x-4">
            <li><Link to="/" className="text-gray-300 hover:text-white">Home</Link></li>
            <li><Link to="/dashboard" className="text-gray-300 hover:text-white">Dashboard</Link></li>
            <li><Link href="#services" className="text-gray-300 hover:text-white">Services</Link></li>
            <li><Link href="#contact" className="text-gray-300 hover:text-white">Contact</Link></li>
          </ul>
        </div>
      </nav>
    )


}

export default Navbar;