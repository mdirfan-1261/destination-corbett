import "./globals.css";
import TopBar from "@/components/layout/TopBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
// import EnquiryWidget from "@/components/EnquiryWidget";
import { StickyActions } from "@/components/ConversionKit";
import QuickEnquiryPopup from "@/components/QuickEnquiryPopup";

export const metadata = {
  title: "Destination Corbett",
  description: "Your Complete Jim Corbett Experience",
  icons: {
    icon: "/logo/corbett-logo.webp",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <TopBar />
        <Navbar />

        {children}

        <div className="pb-20 md:pb-0">
          <Footer />
        </div>

        {/* <EnquiryWidget /> */}
        <StickyActions />
        {/*<QuickEnquiryPopup />*/}
      </body>
    </html>
  );
}