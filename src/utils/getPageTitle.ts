import { IUserPath } from "@/types";

export const getPageTitle = (
  paths: IUserPath[],
  currentPath: string,
  parentTitle: string | null = null
): string | null => {
  // Remove role prefix from URL (like /admin/, /superAdmin/)
  const cleanPath = currentPath.replace(/^\/(admin|superAdmin|faculty|student)\//, "");

  for (const item of paths) {
    // 🔹 Search in children first (recursive)
    if (item.children && item.children.length > 0) {
      const childResult = getPageTitle(item.children, cleanPath, item.pageTitle || parentTitle);
      if (childResult) return childResult;
    }

    // 🔹 If item has a path, check if it matches
    if (item.path) {
      // Handle dynamic segments (:id)
      const pattern = item.path.replace(/:\w+/g, "[^/]+");
      const regex = new RegExp(`^${pattern}$`);

      if (regex.test(cleanPath)) {
        return item.pageTitle || parentTitle;
      }
    }
  }

  return null;
};
