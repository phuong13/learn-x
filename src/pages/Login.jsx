// components
import DocumentTitle from '@components/DocumentTitle';
import AuthLayout from '@components/AuthLayout';

const Login = () => {
    return (
        <>
            <DocumentTitle title="Login" />
            <AuthLayout type="login" />
        </>
    );
};

export default Login;
