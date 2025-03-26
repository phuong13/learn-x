// components
import DocumentTitle from '@components/DocumentTitle';
import AuthLayout from '../layout/AuthLayout';

const Login = () => {
    return (
        <>
            <DocumentTitle title="Đăng nhập" />
            <AuthLayout type="login" />
        </>
    );
};

export default Login;
