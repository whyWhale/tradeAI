import React from 'react';

const Layout = ({ticker, children}) => {
  return (
    <div className="chart-container">
        <h3 className="chart-ticker">
          {ticker}
        </h3>
        {children}
      </div>
  )
}

export default Layout;