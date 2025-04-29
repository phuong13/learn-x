// components
import DocumentTitle from '@components/DocumentTitle';
import IdentifyEmail from '../components/IdentifyEmail';
import Header from '@layout/Header';
import Footer from '@layout/Footer.jsx';

const IdentifyAccount = () => {
    return (
        <>
            {/* <div className="sticky top-0 z-50">
                <Header />
            </div> */}
            <DocumentTitle title="Đặt lại mật khẩu" />
            <IdentifyEmail />
            {/* <Footer /> */}
        </>
    );
};

export default IdentifyAccount;
