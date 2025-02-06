import './styles/globals.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ChatSection from './components/ChatSection';

const Layout: React.FC = () => {
    return (
      <html lang="en">
        <head />
        <body>
          <Header />
          <div className="mainContent">
            <Sidebar />
            <ChatSection />
          </div>
        </body>
      </html>
    );
  };
  
  export default Layout;