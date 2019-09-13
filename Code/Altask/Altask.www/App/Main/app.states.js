// This is the parent state for the entire application.
//
// This state's primary purposes are:
// 1) Shows the outermost chrome (including the navigation and logout for authenticated users)
// 2) Provide a viewport (ui-view) for a substate to plug into
export const appState = {
    name: 'app',
    redirectTo: 'login',
    component: 'app'
};

// This is a home screen for authenticated users.
//
// It shows giant buttons which activate their respective submodules: Messages, Contacts, Preferences
export const homeState = {
    parent: 'app',
    name: 'home',
    url: '/home',
    component: 'home',
    // Mark this state as requiring authentication.  See ../global/requiresAuth.hook.js.
    data: { requiresAuth: true, roles: ['Administrator', 'Supervisor', 'User'] }
};

// This is the login state.  It is activated when the user navigates to /login, or if a unauthenticated
// user attempts to access a protected state (or substate) which requires authentication. (see routerhooks/requiresAuth.js)
export const loginState = {
    parent: 'app',
    name: 'login',
    url: '/login',
    component: 'login',
    params: { credentials: undefined },
    resolve: { returnTo: returnTo }
};

export const assetsState = {
    parent: 'app',
    name: 'assets',
    url: '/assets',
    component: 'assets',
    data: { requiresAuth: true, roles: ['Administrator'] }
};

export const assetGroupsState = {
    parent: 'app',
    name: 'assetGroups',
    url: '/asset/groups',
    component: 'assetGroups',
    data: { requiresAuth: true, roles: ['Administrator'] }
};

export const assetLogTypesState = {
    parent: 'app',
    name: 'assetLogTypes',
    url: '/asset/log-types',
    component: 'assetLogTypes',
    data: { requiresAuth: true, roles: ['Administrator'] }
};

export const assetLogTypeCategoriesState = {
    parent: 'app',
    name: 'assetLogTypeCategories',
    url: '/asset/log-type-categories',
    component: 'assetLogTypeCategories',
    data: { requiresAuth: true, roles: ['Administrator'] }
};

export const assetTypesState = {
    parent: 'app',
    name: 'assetTypes',
    url: '/asset/types',
    component: 'assetTypes',
    data: { requiresAuth: true, roles: ['Administrator'] }
};

export const reportsState = {
	parent: 'app',
	name: 'reports',
	url: '/reports',
	component: 'reports',
	data: { requiresAuth: true, roles: ['Administrator'] }
};

// This is the users state.  It is activated when a user navigates to the /users.
export const usersState = {
    parent: 'app',
    name: 'users',
    url: '/users',
    component: 'users',
    // Mark this state as requiring authentication.  See ../global/requiresAuth.hook.js.
    data: { requiresAuth: true, roles: ['Administrator'] }
};

// This is the tasks state.  It is activated when a user navigates to the /tasks.
export const tasksState = {
    parent: 'app',
    name: 'tasks',
    url: '/tasks',
    component: 'tasks',
    // Mark this state as requiring authentication.  See ../global/requiresAuth.hook.js.
    data: { requiresAuth: true, roles: ['Administrator'] }
};

// This is the task types state.  It is activated when a user navigates to the /task/categories.
export const taskCategoriesState = {
    parent: 'app',
    name: 'taskCategories',
    url: '/task/categories',
    component: 'taskCategories',
    // Mark this state as requiring authentication.  See ../global/requiresAuth.hook.js.
    data: { requiresAuth: true, roles: ['Administrator'] }
};

export const formsState = {
    parent: 'app',
    name: 'forms',
    url: '/forms',
    component: 'forms',
    // Mark this state as requiring authentication.  See ../global/requiresAuth.hook.js.
    data: { requiresAuth: true, roles: ['Administrator'] }
};

export const departmentsState = {
    parent: 'app',
    name: 'departments',
    url: '/departments',
    component: 'departments',
    data: { requiresAuth: true, roles: ['Administrator'] }
};

export const manufacturersState = {
    parent: 'app',
    name: 'manufacturers',
    url: '/manufacturers',
    component: 'manufacturers',
    data: { requiresAuth: true, roles: ['Administrator'] }
};

export const servicesPanelState = {
    parent: 'app',
    name: 'servicesPanel',
    url: '/services-panel',
    component: 'servicesPanel',
    data: { requiresAuth: true, roles: ['Administrator'] }
};

export const settingsState = {
    parent: 'app',
    name: 'settings',
    url: '/settings',
    component: 'settings',
    data: { requiresAuth: true, roles: ['Administrator'] }
};

// A resolve function for 'login' state which figures out what state to return to, after a successful login.
//
// If the user was initially redirected to login state (due to the requiresAuth redirect), then return the toState/params
// they were redirected from.  Otherwise, if they transitioned directly, return the fromState/params.  Otherwise
// return the main "home" state.
returnTo.$inject = ['$transition$'];
function returnTo($transition$) {
    let $state = $transition$.router.stateService;
    return $state.target('home');

    //if ($transition$.redirectedFrom() != null) {
    //    // The user was redirected to the login state (e.g., via the requiresAuth hook)
    //    // Return to the original attempted target state
    //    return $transition$.redirectedFrom().targetState();
    //}

    //let $state = $transition$.router.stateService;

    //// The user was not redirected to the login state; they directly activated the login state somehow.
    //// Return them to the state they came from.
    //if ($transition$.from().name !== '') {
    //    return $state.target($transition$.from(), $transition$.params("from"));
    //}

    //// If the fromState's name is empty, then this was the initial transition. Just return them to the home state
    //return $state.target('home');
}

