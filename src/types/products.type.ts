/* =======================
   CATEGORY
======================= */
export interface ICategory {
  _id: string;
  name: string;
  isActive: boolean;
  isDeleted: boolean;
}

/* =======================
   SUB CATEGORY
======================= */
export interface ISubCategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  categoryId: string;
  categoryName?: string;
  isActive: boolean;
  isDeleted: boolean;
}

/* =======================
   SIZE
======================= */
export interface ISize {
  _id: string;
  name: string;
  isActive: boolean;
  isDeleted: boolean;
}

/* =======================
   COLOR
======================= */
export interface IColor {
  _id: string;
  name: string;
  hexCode: string;
  isActive: boolean;
  isDeleted: boolean;
}

/* =======================
   MEASUREMENT UNIT
======================= */
export interface IMeasurementUnit {
  _id: string;
  name: string;
  measurementUnitSymbol?: string;
  isActive: boolean;
  isDeleted: boolean;
}

/* =======================
   ATTRIBUTE GROUP
======================= */
export interface IAttributeGroup {
  _id: string;
  name: string;
  isActive: boolean;
  isDeleted: boolean;
}

/* =======================
   ATTRIBUTE VALUE
======================= */
export interface IAttributeValue {
  _id: string;
  name: string;
  value?: string;
  attributeGroupId: string;
  attributeGroupName?: string;
  isActive: boolean;
  isDeleted: boolean;
}

/* =======================
   PRODUCT ATTRIBUTE (VARIANT)
======================= */
export interface ProductAttributeValue {
  attributeValueId: string;
  attributeValueName: string;
  attributeGroupId?: string;
  attributeGroupName?: string;
}

export interface ProductAttribute {
  attributes: ProductAttributeValue[];
  barCode: string;
  startingInventory: number;
  minimumStockToNotify: number;
}

/* =======================
   PRODUCT
======================= */
export interface IProductDetail {
  _id?: string;
  name: string;
  productCode?: string;
  productSku?: string;

  price?: number;
  vatRate?: number;

  startingInventory: number;
  minimumStockToNotify: number;

  categoryId: string;
  subCategoryId?: string;
  brandId: string;
  measurementUnitId?: string;

  isNew: boolean;
  isBestSeller: boolean;
  isActive: boolean;
  isDeleted?: boolean;

  productAttributes: ProductAttribute[];
}
