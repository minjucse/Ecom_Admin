import React, { useState, useMemo } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  CircularProgress,
  Checkbox,
  Box,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

import PageHeader from '@/components/ui/PageHeader';
import Controls from '@/components/controls';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import useTable from '@/components/ui/useTable';
import {
  useGetAllSubCategoriesQuery,
  useUpdateSubCategoryMutation,
} from '@/redux/features/admin/products/subCategoryManagement.api';
import { useAppSelector } from '@/redux/hooks';
import { selectCurrentRole } from '@/redux/features/auth/authSlice';
import { ISubCategory } from '@/types/products.type';

const headCells = [
  { id: 'number', label: '#' },
  { id: 'category', label: 'Category Name' },
  { id: 'name', label: 'Name' },
  { id: 'status', label: 'Status' },
  { id: 'update', label: 'Update', disableSorting: true },
];

export default function List() {
  const currentRole = useAppSelector(selectCurrentRole) ?? 'admin';
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    subTitle: '',
    onConfirm: () => {},
  });

  const params = useMemo(
    () => ({
      page: page + 1,
      limit: rowsPerPage,
    }),
    [page, rowsPerPage]
  );

  const { data: apiResponse, isFetching } = useGetAllSubCategoriesQuery(params);
  const [updateCategory] = useUpdateSubCategoryMutation();

  const records: ISubCategory[] = apiResponse?.data || [];
  const meta = apiResponse?.meta || { page: 1, limit: rowsPerPage, total: 0, totalPage: 1 };
  const filterFn = { fn: (items: ISubCategory[]) => items };

  const { TblPaginationSimple, recordsAfterPagingAndSorting } = useTable<ISubCategory>({
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

  const handleStatusUpdate = async (item: ISubCategory, newStatus: boolean) => {
    setConfirmDialog({ isOpen: false, title: '', subTitle: '', onConfirm: () => {} });
    const toastId = toast.loading('Updating...', { position: 'top-right' });

    try {
      await updateCategory({ id: item._id, requestData: { ...item, isActive: newStatus } }).unwrap();
      toast.success('Category status updated successfully', { id: toastId, position: 'top-right' });
    } catch (error) {
      toast.error('Failed to update Category status', { id: toastId, position: 'top-right' });
      console.error(error);
    }
  };

  const updateStatus = (e: React.ChangeEvent<HTMLInputElement>, item: ISubCategory) => {
    const newStatus = e.target.checked;
    setConfirmDialog({
      isOpen: true,
      title: 'Confirm Update',
      subTitle: 'Are you sure you want to change the status?',
      onConfirm: () => handleStatusUpdate(item, newStatus),
    });
  };

  if (isFetching)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );

  return (
    <>
      <Paper sx={{ overflow: 'hidden', p: 2, width: '100%' }}>
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
          <PageHeader title="Sub Categories" subTitle="A list of all Sub Categories" />
          <Controls.Button
            text="Add SubCategory"
            component={Link}
            to={`/${currentRole.toLowerCase()}/sub-category`}
            sx={{ backgroundColor: '#5cb85c', '&:hover': { opacity: 0.8 } }}
          />
        </Box>

        <Box sx={{ width: '100%', overflowX: 'auto', mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                {headCells.map((headCell) => (
                  <TableCell key={headCell.id} sx={{ minWidth: 100 }}>
                    {headCell.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {recordsAfterPagingAndSorting().length === 0 ? (
                <TableRow>
                  <TableCell colSpan={headCells.length} align="center">
                    No Categories found
                  </TableCell>
                </TableRow>
              ) : (
                recordsAfterPagingAndSorting().map((item, index) => (
                  <TableRow key={item._id}>
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                     <TableCell>{item.categoryName}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Checkbox
                        checked={item.isActive}
                        onChange={(event) => updateStatus(event, item)}
                        color="primary"
                      />
                      <Box
                        component="span"
                        sx={{
                          color: item.isActive ? 'green' : 'red',
                          fontWeight: 500,
                          ml: 1,
                        }}
                      >
                        {item.isActive ? 'Active' : 'Deactivated'}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Link
                        to={`/${currentRole.toLowerCase()}/sub-category/${item._id}`}
                        style={{ textDecoration: 'none', color: '#6691B1', fontWeight: 500 }}
                      >
                        Update
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Box>

        <TblPaginationSimple />
      </Paper>

      <ConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} />
    </>
  );
}
