import { ComponentType, ReactNode } from "react";
export * from './global';
export * from './sidebar.type';
export * from './userManagement.type';
export * from './shops.type';
export * from './products.type';
export type { ISendOtp, IVerifyOtp, ILogin } from "./auth.type";

export interface IResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
}

export interface ISidebarItem {
  title: string;
  icon?: ReactNode;
  items: {
    title: string;
    url: string;
    component: ComponentType;
    icon?: ReactNode;
  }[];
}

export type TRole = "SUPER_ADMIN" | "ADMIN" | "USER";