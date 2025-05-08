import { useAuth } from '@hooks/useAuth.js';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';

function LinkTab(props) {
  return (
    <Tab
      component={Link}
      to={props.href}
      aria-current={props.selected && 'page'}
      {...props}
    />
  );
}

function Navbar() {
  const { authUser } = useAuth();
  const { t } = useTranslation();
  const location = useLocation();

  // Map pathname to tab index
  const tabPaths = ['/', '/my-course', '/dashboard', '/forum'];
  const currentTab = tabPaths.indexOf(location.pathname);

  return (
    <nav className="bg-slate-200 shadow-lg pt-2">
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end', px: 3 }}>
        <Tabs
          value={currentTab === -1 ? false : currentTab}
          aria-label="nav tabs"
          textColor="primary"
          indicatorColor="primary"
          sx={{
            '& .MuiTab-root': {
              fontSize: '1rem',
              fontWeight: 600,
              fontFamily: 'Inter, sans-serif',
              textTransform: 'none',
            },
          }}
        >
          <LinkTab label={t('home_page')} href="/" />
          <LinkTab
            label={authUser.role === "TEACHER" ? t('manage_courses') : t('my_courses')}
            href="/my-course"
          />
          <LinkTab label={t('dashboard')} href="/dashboard" />
          <LinkTab label="Forum" href="/forum" />
        </Tabs>
      </Box>
    </nav>

  );
}

export default Navbar;
