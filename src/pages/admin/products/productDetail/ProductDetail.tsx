import { useState, useMemo } from 'react';
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
  Chip,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

import PageHeader from '@/components/ui/PageHeader';
import Controls from '@/components/controls';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import useTable from '@/components/ui/useTable';
import {
  useGetAllProductDetailQuery,
  useUpdateProductDetailMutation,
} from '@/redux/features/admin/products/productsManagement.api';
import { useAppSelector } from '@/redux/hooks';
import { selectCurrentRole } from '@/redux/features/auth/authSlice';
import { IProductDetail } from '@/types';

const headCells = [
  { id: 'number', label: '#' },
  { id: 'name', label: 'Product Name' },
  { id: 'productCode', label: 'Code' },
  { id: 'price', label: 'Price' },
  { id: 'stock', label: 'Stock' },
  { id: 'variants', label: 'Variants' },
  { id: 'status', label: 'Status' },
  { id: 'update', label: 'Update', disableSorting: true },
];

const ProductDetail = () => {
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

  const { data: apiResponse, isFetching } = useGetAllProductDetailQuery(params);
  const [updateProduct] = useUpdateProductDetailMutation();

  const records: IProductDetail[] = apiResponse?.data || [];
  const meta = apiResponse?.meta || { page: 1, limit: rowsPerPage, total: 0, totalPage: 1 };
  const filterFn = { fn: (items: IProductDetail[]) => items };

  const { TblPaginationSimple, recordsAfterPagingAndSorting } = useTable<IProductDetail>({
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

  const handleStatusUpdate = async (item: IProductDetail, newStatus: boolean) => {
    setConfirmDialog({ isOpen: false, title: '', subTitle: '', onConfirm: () => {} });
    const toastId = toast.loading('Updating...', { position: 'top-right' });

    try {
      await updateProduct({ id: item._id!, requestData: { ...item, isActive: newStatus } }).unwrap();
      toast.success('Product status updated successfully', { id: toastId, position: 'top-right' });
    } catch (error) {
      toast.error('Failed to update product status', { id: toastId, position: 'top-right' });
      console.error(error);
    }
  };

  const updateStatus = (e: React.ChangeEvent<HTMLInputElement>, item: IProductDetail) => {
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
          <PageHeader title="Products" subTitle="A list of all products" />
          <Controls.Button
            text="Add Product"
            component={Link}
            to={`/${currentRole.toLowerCase()}/productdetail`}
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
                    No products found
                  </TableCell>
                </TableRow>
              ) : (
                recordsAfterPagingAndSorting().map((item, index) => (
                  <TableRow key={item._id}>
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.productCode || '-'}</TableCell>
                    <TableCell>${Number(item.price || 0).toFixed(2)}</TableCell>
                    <TableCell>{item.startingInventory || 0}</TableCell>
                    <TableCell>
                      {item.productAttributes && item.productAttributes.length > 0 ? (
                        <Chip 
                          label={`${item.productAttributes.length} variants`} 
                          size="small" 
                          color="primary" 
                          variant="outlined"
                        />
                      ) : (
                        <Chip label="No variants" size="small" />
                      )}
                    </TableCell>
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
                        {item.isActive ? 'Active' : 'Inactive'}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Link
                        to={`/${currentRole.toLowerCase()}/productdetail/${item._id}`}
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
};

export default ProductDetail;
