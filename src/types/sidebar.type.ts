import type { ReactNode } from "react";
import { ComponentType } from "react";

export type TRoute = {
  path: string;
  element: ReactNode;
  children?: TRoute[];
};

export type TSidebarItem = {

  key: string;
  name?: string;
  label: ReactNode;
  to?: string;
  icon?: ReactNode;
  children?: TSidebarItem[];
};

export interface IUserPath {
  name?: string;
  path?: string;
  pageTitle?: string;
  element?: ComponentType;
  icon?: ComponentType;
  children?: IUserPath[];

}
