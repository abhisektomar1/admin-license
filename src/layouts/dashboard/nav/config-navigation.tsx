// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const ICONS = {
  user: icon('ic_user'),
  ecommerce: icon('ic_ecommerce'),
  analytics: icon('ic_analytics'),
  dashboard: icon('ic_dashboard'),
  booking: icon('ic_booking'),
  invoice: icon('ic_invoice'),
};

const navConfig = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    subheader: 'Main',
    items: [
      { title: 'Dashboard', path: PATH_DASHBOARD.home, icon: ICONS.dashboard },
      { title: 'Client Access', path: PATH_DASHBOARD.clientAccess.list, icon: ICONS.user },
      { title: 'Client Master', path: PATH_DASHBOARD.clientMaster.list, icon: ICONS.user },
      { title: 'Ip Master', path: PATH_DASHBOARD.ipMaster.root, icon: ICONS.booking},
     
    ],
  },
];

export default navConfig;
