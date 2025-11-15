import React from "react";
import { TRoute, IUserPath } from "../types";

const createRoutes = (items: IUserPath[]): TRoute[] =>
  items.reduce<TRoute[]>((acc, item) => {
    const route: TRoute | null =
      item.path && item.element
        ? { path: item.path, element: React.createElement(item.element) }
        : null;

    if (item.children?.length) {
      const childRoutes = createRoutes(item.children);
      if (route) {
        route.children = childRoutes; // ✅ now allowed
        acc.push(route);
      } else {
        acc.push(...childRoutes);
      }
    } else if (route) {
      acc.push(route);
    }

    return acc;
  }, []);

export const routeGenerator = (items: IUserPath[]): TRoute[] => createRoutes(items);
