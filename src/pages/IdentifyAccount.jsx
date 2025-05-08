// components
import DocumentTitle from '@components/DocumentTitle';
import IdentifyEmail from '../components/IdentifyEmail';
import Header from '@layout/Header';
import Footer from '@layout/Footer.jsx';

const IdentifyAccount = () => {
    return (
        <>
            <DocumentTitle title="Đặt lại mật khẩu" />
            <IdentifyEmail />
        </>
    );
};

export default IdentifyAccount;
