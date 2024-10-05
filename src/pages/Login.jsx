// components
import DocumentTitle from '@components/DocumentTitle';
import AuthLayout from '@components/AuthLayout';

const Login = () => {
    return (
        <>
            <DocumentTitle title="Đăng nhập" />
            <AuthLayout type="login" />
        </>
    );
};

export default Login;
