import UserService from '@/services/user'

export default [
  { path: '/', component: () => import('@/layouts/home.vue'), meta: { breadcrumb: 'Home' }, children: [
    { path: '', redirect: 'audits' },
    { path: 'audits', component: () => import('@/pages/audits/index.vue'), meta: { breadcrumb: 'Audits' }, children: [
      { path: '', name: 'audits', component: () => import('@/pages/audits/list/index.vue') },
      { path: ':finding', name: 'audits_by_find', component: () => import('@/pages/audits/list/index.vue') },

      { path: ':auditId', component: () => import('@/pages/audits/edit/index.vue'), meta: { breadcrumb: 'Edit Audit' }, children: [
        { path: '', redirect: 'general' },
        { path: 'general', name: 'general', component: () => import('@/pages/audits/edit/general/index.vue') },
        { path: 'network', name: 'network', component: () => import('@/pages/audits/edit/network/index.vue') },
        { path: 'charts', name: 'charts', component: () => import('@/pages/charts/index.vue'), meta: { breadcrumb: 'Charts' } },
        { path: 'findings/add', name: 'addFindings', component: () => import('@/pages/audits/edit/findings/add/index.vue') },
        { path: 'findings/:findingId', name: 'editFinding', component: () => import('@/pages/audits/edit/findings/edit/index.vue') },
        { path: 'sections/:sectionId', name: 'editSection', component: () => import('@/pages/audits/edit/sections/index.vue') },
      ] },
    ] },
    { path: 'data', component: () => import('@/pages/data/index.vue'), meta: { breadcrumb: 'Datas' }, children: [
      { path: '', redirect: 'collaborators' },
      { path: 'collaborators', component: () => import('@/pages/data/collaborators/index.vue') },
      { path: 'companies', component: () => import('@/pages/data/companies/index.vue') },
      { path: 'clients', component: () => import('@/pages/data/clients/index.vue') },
      { path: 'templates', component: () => import('@/pages/data/templates/index.vue') },
      { path: 'dump', component: () => import('@/pages/data/dump/index.vue') },
      { path: 'custom', component: () => import('@/pages/data/custom/index.vue') },
    ] },
    { path: 'vulnerabilities', component: () => import('@/pages/vulnerabilities/index.vue'), meta: { breadcrumb: 'Vulnerabilities' } },
    { path: 'profile', component: () => import('@/pages/profile/index.vue') },
    { path: 'settings', component: () => import('@/pages/settings/index.vue') },
    { path: '403', name: '403', component: () => import('@/pages/403.vue') },
    { path: '404', name: '404', component: () => import('@/pages/404.vue') },
  ] },
  { path: '/login', component: () => import('@/pages/login.vue') },
  { path: '/:pathMatch(.*)*', redirect: '/' },
]
