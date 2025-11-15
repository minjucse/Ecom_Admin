
export interface IBrand {
    _id: string;
    name: string;
    brandCode: string;
    address: string;
    phone: string;
    contactPersonName: string;
    country: string;
    madeInCountry: string;
    email: string;
    remarks: string;
    isActive: boolean;
    isDeleted: boolean;
};

export interface IShop {
    _id: string;
    name: string;
    phone: string;
    streetAddress: string;
    contactPersonName: string;
    contactPersonPhone: string;
    website?: string;
    email?: string;
    facebook?: string;
    accountNumber?: string;
    remarks?: string;
    registrationDate: Date;
    expiryDate: Date;
    logoUrl?: string;
};

export interface IBanner {
    _id: string;
    name: string;
    imgPath?: string;
    imageUrl?: string;
    isActive: boolean;
    isDeleted: boolean;
};

export interface ISupplier {
  _id: string;
  companyName: string;
  name: string;

  streetAddress: string | null;   // match nullable
  phone: string;
  country: string | null;   // match optional + nullable
  email: string;
  remarks: string | null;   // match optional + nullable

  contactPersonName: string | null;         // match schema
  contactPersonDesignation: string | null;  // match schema

  isActive: boolean;
  isDeleted: boolean;
};