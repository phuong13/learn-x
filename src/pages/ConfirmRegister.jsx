import DocumentTitle from '@components/DocumentTitle';
import ConfirmOTP from '../components/ConfirmOTP';
import Header from '../layout/Header';
import Footer from '@layout/Footer.jsx';

const ConfirmRegister = () => {
    return (
        <>
            <div className="sticky top-0 z-50">
                <Header />
            </div>
            {/*<Navbar />*/}
            <DocumentTitle title="Xác nhận tài khoản" />
            <ConfirmOTP />
            <Footer />
        </>
    );
};

export default ConfirmRegister;
