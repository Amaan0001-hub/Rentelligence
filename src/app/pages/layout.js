import "../globals.css"
import Header from "../components/Header";
import Footer from "../components/Footer";
import LeaseModal from "../components/LeaseModal";
// import App from "../components/Prompt";


export default function DashboardLayout({ children }) {
    return (
        <>
           
            <Header />
            {/* <App/> */}
            <LeaseModal />
            <main>
                {children}
            </main>
            <Footer />
        </>
    );
}
