import react from "react";
import Navbar from "./Navbar";
import HeaderText from "./HeaderText";


function Header(props) {
    return(
        <header className="header">
          <Navbar/>
          <HeaderText/>
      </header>);
}

export default Header;