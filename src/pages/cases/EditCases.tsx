import { Helmet } from 'react-helmet-async';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import { useSettingsContext } from '../../components/settings';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
// sections
import EditCasesPostForm from 'src/sections/blog/EditCasesPostForm';

// ----------------------------------------------------------------------

export default function BlogNewPostPage() {
    const { themeStretch } = useSettingsContext();

    return (
        <>
            <Helmet>
                <title> Cases: Edit Case | UrgentER</title>
            </Helmet>

            <Container maxWidth={themeStretch ? false : 'lg'}>
                <CustomBreadcrumbs
                    heading="Edit Case"
                    links={[
                        {
                            name: 'Dashboard',
                            href: PATH_DASHBOARD.root,
                        },
                        {
                            name: 'Cases',
                            href: PATH_DASHBOARD.clientAccess.list,
                        },
                        {
                            name: 'Edit',
                        },
                    ]}
                />

                <EditCasesPostForm />
            </Container>
        </>
    );
}
