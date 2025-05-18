import FloatingContactMenu from "@/components/UI/FloatingContactMenu/FloatingContactMenu";
import Footer from "@/components/UI/Footer/Footer";
import Navbar from "@/components/UI/Navbar/Navbar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div style={{ fontFamily: "banglaFont" }} className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">{children}</main>
      <FloatingContactMenu />

      <Footer />
    </div>
  );
};

export default Layout;
