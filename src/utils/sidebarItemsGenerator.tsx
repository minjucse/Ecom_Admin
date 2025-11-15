import { TSidebarItem, IUserPath } from '../types';
import type { ReactNode } from 'react';

const createSidebarItems = (items: IUserPath[], role: string, parentKey = ''): TSidebarItem[] => {
  return items
    .filter(Boolean) // remove undefined items
    .map((item, index) => {
      const key = parentKey ? `${parentKey}-${index}` : `${index}`;

      // Skip dynamic paths for sidebar
      const isDynamic = item.path?.includes(':');

      const sidebarItem: TSidebarItem = {
        key,
        label: item.name,
        to: item.path && !isDynamic ? `/${role.toLowerCase()}/${item.path.toLowerCase()}` : undefined,
        icon: item.icon ? renderIcon(item.icon) : undefined,
      };

      if (item.children && item.children.length > 0) {
        const children = createSidebarItems(item.children, role, key);
        if (children.length > 0) sidebarItem.children = children;
      }

      // Only return items that have a path or children
      if (!sidebarItem.to && (!sidebarItem.children || sidebarItem.children.length === 0)) return null;

      return sidebarItem;
    })
    .filter(Boolean) as TSidebarItem[];
};

// Helper to convert ComponentType to ReactNode
const renderIcon = (Icon: React.ComponentType): ReactNode => <Icon />;

export const sidebarItemsGenerator = (items: IUserPath[], role: string): TSidebarItem[] => {
  return createSidebarItems(items, role);
};
