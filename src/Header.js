import React from 'react';

const Header = (props) => {
    return(
        <header className="header">
          <div className="center">
            <div className="caption">
              <h2 className="title display-5 text-center mt-5 mb-10">{props.title}</h2>
            </div>
          </div>
        </header>
    )
}

export default Header;