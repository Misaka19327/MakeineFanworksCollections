import { Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './Layout.css';

const Layout = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className={`layout ${isMobile ? 'mobile' : 'desktop'}`}>
      <header className="header">
        <nav className="nav">
          <div className="logo">Logo</div>
          {!isMobile && (
            <ul className="nav-links">
              <li><a href="/">首页</a></li>
              <li><a href="/about">关于</a></li>
            </ul>
          )}
          {isMobile && (
            <button className="menu-button">菜单</button>
          )}
        </nav>
      </header>
      <main className="main-content">
        <Outlet />
      </main>
      <footer className="footer">
        <p>© 2024 Your Company</p>
      </footer>
    </div>
  );
};

export default Layout; 