import Preloader from "./Preloader";
import Header from "./Header";
import Footer from "./Footer";

/* Public website chrome — used by the (site) layout and the 404 page.
   The admin area (/admin) has its own shell. */
export default function SiteChrome({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Preloader />
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
