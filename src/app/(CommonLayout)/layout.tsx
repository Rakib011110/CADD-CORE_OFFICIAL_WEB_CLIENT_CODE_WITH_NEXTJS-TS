import FloatingContactMenu from "@/components/UI/FloatingContactMenu/FloatingContactMenu";
import Footer from "@/components/UI/Footer/Footer";
import NavbarWrapper from "@/components/UI/NavbarWrapper/NavbarWrapper";
import PopupBanner from "@/components/UI/PopupBanner/IndustrialPopupBanner/IndustrialPopupBanner";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      style={{ fontFamily: "banglaFont" }}
      className="min-h-screen flex flex-col"
    >
      <NavbarWrapper />

      <main className="flex-1">{children}</main>
      <PopupBanner />
      <FloatingContactMenu />
      <Footer />
    </div>
  );
};

export default Layout;
