
import HomeIcon from "@mui/icons-material/Home";
import BookmarkAdd from "@mui/icons-material/BookmarkAdd";
import Assessment from "@mui/icons-material/BarChart";
import PlaylistAddCircleTwoToneIcon from "@mui/icons-material/PlaylistAddCircleTwoTone";

import { IUserPath } from "@/types";

import { AdminDashboard, ColorList, ColorNew, SizeList, SizeNew } from '../pages/admin';
import {
  MyShop,
  SupplierNew,
  SupplierList,
  BannerEntry,
  BannerList,
  BrandNew,
  BrandList,

  CategoryNew,
  CategoryList,
  SubCategoryNew,
  SubCategoryList,

  // AttributeGroupNew, 
  // AttributeGroupList, 
  // ProductAttributeEntry, 
  // ProductAttributes, 
  // MeasurementEntry, 
  // Measurements, 
  // AttributeValueEntry, 
  // AttributeValues, 
  ProductDetailEntry,
  ProductDetail,
  CustomerNew,
  CustomerList
} from '../pages/admin'

export const adminSidebarItems: IUserPath[] = [
  {
    name: "Dashboard",
    path: "dashboard",
    element: AdminDashboard,
    icon: HomeIcon,
    pageTitle:"Dashboard",
  },
  {
    name: "Setup",
    icon: BookmarkAdd,
    children: [
      {
        name: "My Shop",
        path: "shop",
        element: MyShop,
        pageTitle:"My Shop"
      },
      {
        name: "Home Page",
        children: [
          {
            name: "Banner",
            pageTitle:"Home Page",
            children: [
              { name: "New", path: "banner/new", element: BannerEntry },
              { path: "banner/:id", element: BannerEntry },
              { name: "List", path: "banner/list", element: BannerList },
            ],
          }

        ],
      },
      {
        name: "Brand",
        pageTitle:"Product Brand",
        children: [
          { name: "New", path: "brand", element: BrandNew },
          { path: "brand/:id", element: BrandNew },
          { name: "List", path: "brands", element: BrandList },
        ],
      },
      {
        name: "Products",
        children: [
          // {
          //   name: "Group",
          //   children: [
          //     { name: "New", path: "productgroup/new", element: GroupEntry },
          //     { name: "List", path: "productgroup/list", element: ProductGroupList },
          //   ],
          // },
          {
            name: "Category",
             pageTitle:"Product Category",
            children: [
              { name: "New", path: "category", element: CategoryNew },
              { path: "category/:id", element: CategoryNew },
              { name: "List", path: "categories", element: CategoryList },
            ],
          },
          {
            name: "Sub Category",
             pageTitle:"Product Sub Category",
            children: [
              { name: "New", path: "sub-category", element: SubCategoryNew },
              { path: "sub-category/:id", element: SubCategoryNew },
              { name: "List", path: "sub-categories", element: SubCategoryList },
            ],
          },
          {
            name: "Color",
            pageTitle:"Product Color",
            children: [
              { name: "New", path: "color", element: ColorNew },
              { path: "color/:id", element: ColorNew },
              { name: "List", path: "colors", element: ColorList },
            ],
          },
          {
            name: "Size",
            pageTitle:"Product Size",
            children: [
              { name: "New", path: "size", element: SizeNew },
              {  path: "size/:id", element: SizeNew },
              { name: "List", path: "sizes", element: SizeList },
            ],
          },
          {
            name: "Detail",
             pageTitle:"Product Detail",
            children: [
              { name: "New", path: "productdetail/new", element: ProductDetailEntry },
              { name: "List", path: "productdetail/list", element: ProductDetail },
            ],
          },
        ],
      },
      {
        name: "Supplier",
        pageTitle:"Supplier",
        children: [
          { name: "New", path: "supplier", element: SupplierNew },
            { path: "supplier/:id", element: SupplierNew },
          { name: "List", path: "suppliers", element: SupplierList },
        ],
      },
      {
        name: "Customer",
         pageTitle:"Customer",
        children: [
          { name: "New", path: "customer/new", element: CustomerNew },
          { name: "List", path: "customer/list", element: CustomerList },
        ],
      },
    ],
  },
  {
    name: "Operation",
    icon: PlaylistAddCircleTwoToneIcon,
    children: [
      {
        name: "Purchase Order",
        pageTitle:"Purchase Order",
        children: [
          { name: "New", path: "purchase/new" },
          { name: "List", path: "purchase/list" },
        ],
      },
      {
        name: "Purchase Received",
        pageTitle:"Purchase Received",
        children: [
          { name: "New", path: "purchase-receive/new" },
          { name: "List", path: "purchase-receive/list" },
        ],
      },
      {
        name: "Sale",
         pageTitle:"Sale",
        children: [
          { name: "New", path: "pos-sale/new" },
          { name: "List", path: "pos-sale/list" },
        ],
      },
    ],
  },
  {
    name: "Reports",
    icon: Assessment,
    pageTitle:"Reports",
    children: [
      { name: "Daily Sales", path: "reports/daily-sales" },
      { name: "Monthly Sales", path: "reports/monthly-sales" },
      { name: "Yearly Sales", path: "reports/yearly-sales" },
      { name: "Stock Report", path: "reports/stock-report" },
      { name: "Payment Wise Sales", path: "reports/payment-wise-sales" },
      { name: "Sales By Product Category", path: "reports/sales-by-category" },
      { name: "Sales By Product Detail", path: "reports/sales-by-detail" },
    ],
  },
];
