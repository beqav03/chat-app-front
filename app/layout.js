import './styles/globals.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ChatSection from './components/ChatSection';

export default function Layout() {
  return (
    <html lang="en">
      <head />
      <body>
        <Header />
        <div className="mainContent">
            <div className="mainContent">
                <Sidebar />
                <ChatSection />
            </div>
        </div>
      </body>
    </html>
  );
}
