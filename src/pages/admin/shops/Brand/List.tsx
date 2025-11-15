import React, { useState, useMemo } from 'react';
import {
  Paper,
  TableBody,
  TableCell,
  TableRow,
  CircularProgress,
  Checkbox,
  Box,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

import PageHeader from '@/components/ui/PageHeader';
import Controls from '@/components/controls';
import useTable from '@/components/ui/useTable';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import {
  useGetAllBrandsQuery,
  useUpdateBrandMutation,
} from '@/redux/features/admin/shops/brandsManagement.api';
import { useAppSelector } from '@/redux/hooks';
import { selectCurrentRole } from '@/redux/features/auth/authSlice';
import { IBrand } from '@/types/shops.type';
import BrandFilter, { FilterValues } from '@/components/modules/Shops/BrandFilter';

const headCells = [
  { id: 'number', label: '#' },
  { id: 'name', label: 'Name' },
  { id: 'brandCode', label: 'Brand Code' },
  { id: 'address', label: 'Address' },
  { id: 'phoneNo', label: 'Phone No' },
  { id: 'contactPersonName', label: 'Contact Person Name' },
  { id: 'status', label: 'Status' },
  { id: 'update', label: 'Update', disableSorting: true },
];

export default function Brands() {
  const [updateBrand] = useUpdateBrandMutation();
  const currentRole = useAppSelector(selectCurrentRole) ?? 'admin';

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
 const [filters, setFilters] = useState<FilterValues>({ keyword: '', phone: '' });

  const params = useMemo(
    () => ({
      page: page + 1,
      limit: rowsPerPage,
      name: filters.keyword || undefined,
      phone: filters.phone || undefined,
    }),
    [page, rowsPerPage, filters]
  );

  const { data: apiResponse, isFetching } = useGetAllBrandsQuery(params);
  const records = apiResponse?.data || [];
  const meta = apiResponse?.meta || { page: 1, limit: rowsPerPage, total: 0, totalPage: 1 };
  const filterFn = { fn: (items: IBrand[]) => items };

  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    subTitle: '',
    onConfirm: () => { },
  });

  const { TblContainer, TblHead, TblPaginationSimple, recordsAfterPagingAndSorting } =
    useTable<IBrand>({
      records,
      headCells,
      filterFn,
      meta,
      page,
      rowsPerPage,
      handleChangePage: (_e, newPage) => setPage(newPage),
      handleChangeRowsPerPage: (e) => {
        setRowsPerPage(parseInt(e.target.value, 10));
        setPage(0);
      },
      onSimplePageChange: (_e, newPage) => setPage(newPage - 1),
    });

  const handleFilterSubmit = (data: FilterValues) => {
    setPage(0);
    setFilters(data);
  };

  const handleStatusUpdate = async (item: IBrand, newStatus: boolean) => {
    setConfirmDialog({ isOpen: false, title: '', subTitle: '', onConfirm: () => { } });

    const updatedItem: IBrand = { ...item, isActive: newStatus };
    const toastId = toast.loading('Updating...', { position: 'top-right' });

    try {
      await updateBrand({ id: item._id, requestData: updatedItem }).unwrap();
      toast.success('Brand status updated successfully', { id: toastId, position: 'top-right' });
    } catch (error) {
      toast.error('Failed to update brand status', { id: toastId, position: 'top-right' });
      console.error(error);
    }
  };

  const updateStatus = (e: React.ChangeEvent<HTMLInputElement>, item: IBrand) => {
    const newStatus = e.target.checked;
    setConfirmDialog({
      isOpen: true,
      title: 'Confirm Update',
      subTitle: 'Are you sure you want to change the status?',
      onConfirm: () => handleStatusUpdate(item, newStatus),
    });
  };

  const linkStyle = { textDecoration: 'none', color: '#6691B1', fontWeight: 500 };

  return (
    <>
      <Paper sx={{ overflow: 'hidden', p: 2 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            pr: 4,
            gap: 2,
            flexWrap: 'wrap',
          }}
        >
          <PageHeader title="Brand" subTitle="A list of all of your brands" />
          <Controls.Button
            text="Add Brand"
            component={Link}
            to={`/${currentRole.toLowerCase()}/brand`}
            sx={{ backgroundColor: '#5cb85c', '&:hover': { opacity: 0.8 } }}
          />
        </Box>

        <BrandFilter defaultValues={filters} onSubmit={handleFilterSubmit} />

        {isFetching ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TblContainer>
            <TblHead />
            <TableBody>
              {recordsAfterPagingAndSorting().length === 0 ? (
                <TableRow>
                  <TableCell colSpan={headCells.length} align="center">
                    No brands found
                  </TableCell>
                </TableRow>
              ) : (
                recordsAfterPagingAndSorting().map((item, index) => (
                  <TableRow key={item._id}>
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.brandCode}</TableCell>
                    <TableCell>{item.address}</TableCell>
                    <TableCell>{item.phone}</TableCell>
                    <TableCell>{item.contactPersonName}</TableCell>
                    <TableCell sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Checkbox
                        checked={item.isActive}
                        onChange={(event) => updateStatus(event, item)}
                        color="primary"
                      />
                      <Box component="span" sx={{ color: item.isActive ? 'green' : 'red', fontWeight: 500 }}>
                        {item.isActive ? 'Active' : 'Deactivated'}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Link to={`/${currentRole.toLowerCase()}/brand/${item._id}`} style={linkStyle}>
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

      <ConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} />
    </>
  );
}
