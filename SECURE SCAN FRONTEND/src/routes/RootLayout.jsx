import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";
function RootLayout (){
    return(
     <>
      <Navbar />
        <Outlet />
        <footer className="bg-gray-800 text-white p-6">
        <div className="mx-auto text-center">
          <p>© 2024 API Vulnerability Scanner. All rights reserved.</p>
        </div>
      </footer>
      </>
    )
}

export default RootLayout;