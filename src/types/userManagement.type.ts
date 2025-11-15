
export type TUser = {
  _id: string;
  id: string;
  name: string;
  email: string;
  needsPasswordChange: boolean;
  picture?: string;
  role: string;
  status: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type TName = {
  firstName: string;
  middleName: string;
  lastName: string;
  _id: string;
};

