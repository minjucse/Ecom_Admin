export interface ICategory {
    _id: string;
    name: string;
    isActive: boolean;
    isDeleted: boolean;
};

export interface ISubCategory {
    _id: string;
    name: string;
    slug: string;
    description?: string ;  
    categoryId: string;
    categoryName?: string;
    isActive: boolean;
    isDeleted: boolean;
}; 

export interface ISize {
    _id: string;
    name: string;
    isActive: boolean;
    isDeleted: boolean;
};

export interface IColor {
    _id: string;
    name: string;
    hexCode: string;
    isActive: boolean;
    isDeleted: boolean;
}; 