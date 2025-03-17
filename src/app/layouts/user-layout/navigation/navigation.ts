export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  translate?: string;
  icon?: string;
  hidden?: boolean;
  url?: string;
  classes?: string;
  groupClasses?: string;
  exactMatch?: boolean;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  children?: NavigationItem[];
  link?: string;
  description?: string;
  path?: string;
  isAdminOnly?: boolean
}

export const NavigationItems: NavigationItem[] = [
  {
    id: 'general',
    title: 'General',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'dashboard',
        title: 'Dashboard',
        type: 'item',
        classes: 'nav-item',
        url: '/dashboard',
        icon: 'dashboard',
      },
      {
        id: 'broadcast',
        title: 'Broadcast',
        type: 'item',
        classes: 'nav-item',
        url: '/broadcast',
        icon: 'global',
      }
    ]
  },
  {
    id: 'files',
    title: 'File Upload',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'files',
        title: 'Files',
        type: 'item',
        classes: 'nav-item',
        url: '/files',
        icon: 'cloud-upload',
      },
      {
        id: 'sharedwithme',
        title: 'Shared With Me',
        type: 'item',
        classes: 'nav-item',
        url: '/shared-with-me',
        icon: 'share-alt',
      },
      {
        id: 'bin',
        title: 'Bin',
        type: 'item',
        classes: 'nav-item',
        url: '/bin',
        icon: 'delete',
      }
    ]
  },
  {
    id: 'manage',
    title: 'Manage',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'user',
        title: 'User',
        type: 'item',
        classes: 'nav-item',
        url: '/user',
        icon: 'user',
      },
      {
        id: 'audit',
        title: 'Audit Logs',
        type: 'item',
        classes: 'nav-item',
        url: '/audit',
        icon: 'audit',
      }
    ]
  }
];
