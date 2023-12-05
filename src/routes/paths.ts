// ----------------------------------------------------------------------

function path(root: string, sublink: string) {
  return `${root}${sublink}`;
}

const ROOTS_DASHBOARD = '/dashboard';

// ----------------------------------------------------------------------

export const PATH_AUTH = {
  login: '/login',
};

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  home: path(ROOTS_DASHBOARD, '/home'),
  clientAccess: {
    root: path(ROOTS_DASHBOARD, '/clientAccess'),
    new: path(ROOTS_DASHBOARD, '/clientAccess/new'),
    list: path(ROOTS_DASHBOARD, '/clientAccess/list'),
  
  },
  clientMaster: {
    root: path(ROOTS_DASHBOARD, '/clientMaster'),
    new: path(ROOTS_DASHBOARD, '/clientMaster/new'),
    list: path(ROOTS_DASHBOARD, '/clientMaster/list'),
   // edit: (name: string) => path(ROOTS_DASHBOARD, `/clientMaster/${name}/edit`),
  },
  ipMaster: {
    root: path(ROOTS_DASHBOARD, '/ipMaster'),
     new: path(ROOTS_DASHBOARD, '/ipMaster/new'),
    list: path(ROOTS_DASHBOARD, '/ipMaster/list'),
    // edit: (name: string) => path(ROOTS_DASHBOARD, `/category/${name}/edit`),
  },
  slots: {
    root: path(ROOTS_DASHBOARD, '/slots'),
    // new: path(ROOTS_DASHBOARD, '/category/new'),
    list: path(ROOTS_DASHBOARD, '/category/list'),
    // edit: (name: string) => path(ROOTS_DASHBOARD, `/category/${name}/edit`),
  },
};
