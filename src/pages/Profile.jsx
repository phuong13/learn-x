import DocumentTitle from '@components/DocumentTitle';
import ProfileInfo from '../components/ProfileInfo';
import Header from '../layout/Header';
import Navbar from '@layout/NavBar.jsx';

const Profile = () => {
    return (
        <>
            <div className="sticky top-0 z-50">
                <Header />
            </div>
            <Navbar />
            <DocumentTitle title="Hồ sơ" />
            <ProfileInfo />
        </>
    );
};

export default Profile;
