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
  cases: {
    root: path(ROOTS_DASHBOARD, '/cases'),
    new: path(ROOTS_DASHBOARD, '/cases/new'),
    list: path(ROOTS_DASHBOARD, '/cases/list'),
    edit: (id: string) => path(ROOTS_DASHBOARD, `/cases/edit/${id}`),
  },
  category: {
    root: path(ROOTS_DASHBOARD, '/category'),
    new: path(ROOTS_DASHBOARD, '/category/new'),
    list: path(ROOTS_DASHBOARD, '/category/list'),
    edit: (name: string) => path(ROOTS_DASHBOARD, `/category/${name}/edit`),
  },
  appointment: {
    root: path(ROOTS_DASHBOARD, '/appointment'),
    // new: path(ROOTS_DASHBOARD, '/category/new'),
    list: path(ROOTS_DASHBOARD, '/category/list'),
    // edit: (name: string) => path(ROOTS_DASHBOARD, `/category/${name}/edit`),
  },
  slots: {
    root: path(ROOTS_DASHBOARD, '/slots'),
    // new: path(ROOTS_DASHBOARD, '/category/new'),
    list: path(ROOTS_DASHBOARD, '/category/list'),
    // edit: (name: string) => path(ROOTS_DASHBOARD, `/category/${name}/edit`),
  },
};
