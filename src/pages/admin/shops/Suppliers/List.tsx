import React, { useState, useMemo } from "react";
import {
  Paper,
  TableBody,
  TableCell,
  TableRow,
  CircularProgress,
  Checkbox,
  Box,
} from "@mui/material";
import { Link } from "react-router-dom";
import { toast } from "sonner";

import PageHeader from "@/components/ui/PageHeader";
import Controls from "@/components/controls";
import useTable from "@/components/ui/useTable";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

import {
  useGetAllSuppliersQuery,
  useUpdateSupplierMutation,
} from "@/redux/features/admin/shops/supplierManagement.api";

import { useAppSelector } from "@/redux/hooks";
import { selectCurrentRole } from "@/redux/features/auth/authSlice";

import type { ISupplier } from "@/types/shops.type";
import SupplierFilter, {
  FilterValues,
} from "@/components/modules/Shops/SupplierFilter";

const headCells = [
  { id: "number", label: "#" },
  { id: "companyName", label: "Company Name" },
  { id: "name", label: "Supplier Name" },
  { id: "SupplierCode", label: "Supplier Code" },
  { id: "phone", label: "Phone" },
  { id: "country", label: "Country" },
  { id: "contactPersonName", label: "Contact Person" },
  { id: "status", label: "Status" },
  { id: "update", label: "Update", disableSorting: true },
];

export default function Suppliers() {
  const [updateSupplier] = useUpdateSupplierMutation();
  const currentRole = (useAppSelector(selectCurrentRole) || "admin").toLowerCase();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [filters, setFilters] = useState<FilterValues>({
    keyword: "",
    phone: "",
    //country: "",
  });

  const params = useMemo(
    () => ({
      page: page + 1,
      limit: rowsPerPage,
      name: filters.keyword || undefined,
      phone: filters.phone || undefined,
      //country: filters.country || undefined,
    }),
    [page, rowsPerPage, filters]
  );

  const { data: apiResponse, isFetching } = useGetAllSuppliersQuery(params);

  const records = apiResponse?.data ?? [];
  const meta = apiResponse?.meta ?? {
    page: 1,
    limit: rowsPerPage,
    total: 0,
    totalPage: 1,
  };

  const filterFn = { fn: (items: ISupplier[]) => items };

  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    subTitle: "",
    onConfirm: () => {},
  });

  const {
    TblContainer,
    TblHead,
    TblPaginationSimple,
    recordsAfterPagingAndSorting,
  } = useTable<ISupplier>({
    records,
    headCells,
    filterFn,
    meta,
    page,
    rowsPerPage,
    handleChangePage: (_e, newPage) => setPage(newPage),
    handleChangeRowsPerPage: (e) => {
      setRowsPerPage(Number(e.target.value));
      setPage(0);
    },
    onSimplePageChange: (_e, newPage) => setPage(newPage - 1),
  });

  const handleFilterSubmit = (data: FilterValues) => {
    setFilters(data);
    setPage(0); // reset page after filter change
  };

  const handleStatusUpdate = async (item: ISupplier, newStatus: boolean) => {
    // close confirm dialog
    setConfirmDialog({
      isOpen: false,
      title: "",
      subTitle: "",
      onConfirm: () => {},
    });

    const toastId = toast.loading("Updating supplier...", {
      position: "top-right",
    });

    try {
      await updateSupplier({
        id: item._id,
        requestData: { isActive: newStatus }, // ✅ only send the changed field
      }).unwrap();

      toast.success("Supplier status updated successfully", {
        id: toastId,
        position: "top-right",
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to update supplier status", {
        id: toastId,
        position: "top-right",
      });
    }
  };

  const updateStatus = (
    e: React.ChangeEvent<HTMLInputElement>,
    item: ISupplier
  ) => {
    const newStatus = e.target.checked;

    setConfirmDialog({
      isOpen: true,
      title: "Confirm Update",
      subTitle: "Are you sure you want to change the status?",
      onConfirm: () => handleStatusUpdate(item, newStatus),
    });
  };

  const linkStyle = {
    textDecoration: "none",
    color: "#6691B1",
    fontWeight: 500,
  };

  return (
    <>
      <Paper sx={{ overflow: "hidden", p: 2 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            pr: 4,
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <PageHeader title="Suppliers" subTitle="A list of all suppliers" />

          <Controls.Button
            text="Add Supplier"
            component={Link}
            to={`/${currentRole}/supplier`}
            sx={{
              backgroundColor: "#5cb85c",
              "&:hover": { opacity: 0.8 },
            }}
          />
        </Box>

        <SupplierFilter defaultValues={filters} onSubmit={handleFilterSubmit} />

        {isFetching ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TblContainer>
            <TblHead />

            <TableBody>
              {recordsAfterPagingAndSorting().length === 0 ? (
                <TableRow>
                  <TableCell colSpan={headCells.length} align="center">
                    No suppliers found
                  </TableCell>
                </TableRow>
              ) : (
                recordsAfterPagingAndSorting().map((item, index) => (
                  <TableRow key={item._id}>
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell>{item.companyName}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.streetAddress}</TableCell>
                    <TableCell>{item.phone}</TableCell>
                    <TableCell>{item.country}</TableCell>
                    <TableCell>{item.contactPersonName}</TableCell>

                    <TableCell>
                      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                        <Checkbox
                          checked={item.isActive}
                          onChange={(event) => updateStatus(event, item)}
                          color="primary"
                        />
                        <Box
                          component="span"
                          sx={{
                            color: item.isActive ? "green" : "red",
                            fontWeight: 500,
                          }}
                        >
                          {item.isActive ? "Active" : "Deactivated"}
                        </Box>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Link
                        to={`/${currentRole}/supplier/${item._id}`}
                        style={linkStyle}
                      >
                        Update
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </TblContainer>
        )}

        <TblPaginationSimple />
      </Paper>

      <ConfirmDialog
        confirmDialog={confirmDialog}
        setConfirmDialog={setConfirmDialog}
      />
    </>
  );
}
