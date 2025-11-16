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
  useGetAllBannersQuery,
  useUpdateBannerMutation,
} from '@/redux/features/admin/shops/bannerManagement.api';
import { useAppSelector } from '@/redux/hooks';
import { selectCurrentRole } from '@/redux/features/auth/authSlice';
import { IBanner } from '@/types/shops.type';
//import config from '@/config';

// Table head definition
const headCells = [
  { id: 'number', label: '#' },
  { id: 'name', label: 'Name' },
  { id: 'image', label: 'Image' },
  { id: 'status', label: 'Status' },
  { id: 'update', label: 'Update', disableSorting: true },
];

export default function List() {
  const [updateBanner] = useUpdateBannerMutation();
  const currentRole = useAppSelector(selectCurrentRole) ?? 'admin';

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const params = useMemo(
    () => ({
      page: page + 1,
      limit: rowsPerPage,
    }),
    [page, rowsPerPage]
  );

  const { data: apiResponse, isFetching } = useGetAllBannersQuery(params);
  const records = apiResponse?.data || [];
  const meta = apiResponse?.meta || { page: 1, limit: rowsPerPage, total: 0, totalPage: 1 };
  const filterFn = { fn: (items: IBanner[]) => items };

  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    subTitle: '',
    onConfirm: () => {},
  });

  const { TblPaginationSimple, recordsAfterPagingAndSorting } = useTable<IBanner>({
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

  const handleStatusUpdate = async (item: IBanner, newStatus: boolean) => {
    setConfirmDialog({ isOpen: false, title: '', subTitle: '', onConfirm: () => {} });
    const toastId = toast.loading('Updating...', { position: 'top-right' });

    const formData = new FormData();
    formData.append('name', item.name ?? '');
    if (item.imgPath) formData.append('imgPath', item.imgPath);
    if (item.imageUrl) formData.append('imageUrl', item.imageUrl);
    formData.append('isActive', String(newStatus));
    formData.append('isDeleted', String(item.isDeleted ?? false));

    try {
      await updateBanner({ id: item._id, requestData: formData }).unwrap();
      toast.success('Banner status updated successfully', { id: toastId, position: 'top-right' });
    } catch (error) {
      toast.error('Failed to update Banner status', { id: toastId, position: 'top-right' });
      console.error(error);
    }
  };

  const updateStatus = (e: React.ChangeEvent<HTMLInputElement>, item: IBanner) => {
    const newStatus = e.target.checked;
    setConfirmDialog({
      isOpen: true,
      title: 'Confirm Update',
      subTitle: 'Are you sure you want to change the status?',
      onConfirm: () => handleStatusUpdate(item, newStatus),
    });
  };

  const linkStyle = { textDecoration: 'none', color: '#6691B1', fontWeight: 500 };
  //const BASE_URL = config.baseUrl.replace(/\/$/, ''); // remove trailing slash

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
          <PageHeader title="Banner" subTitle="A list of all of your Banners" />
          <Controls.Button
            text="Add Banner"
            component={Link}
            to={`/${currentRole.toLowerCase()}/Banner`}
            sx={{ backgroundColor: '#5cb85c', '&:hover': { opacity: 0.8 } }}
          />
        </Box>

        {isFetching ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ width: '100%', overflowX: 'auto', mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  {headCells.map((headCell) => (
                    <TableCell
                      key={headCell.id}
                      sx={{ minWidth:
                        headCell.id === 'image' ? 100 :
                        headCell.id === 'name' ? 150 :
                        headCell.id === 'status' ? 120 :
                        headCell.id === 'update' ? 80 : 50
                      }}
                    >
                      {headCell.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {recordsAfterPagingAndSorting().length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={headCells.length} align="center">
                      No Banners found
                    </TableCell>
                  </TableRow>
                ) : (
                  recordsAfterPagingAndSorting().map((item, index) => {
                    // const imageUrl = item.imgPath
                    //   ? `${BASE_URL}/uploads/${item.imgPath.replace(/^\/uploads\//, '')}`
                    //   : '';

                    return (
                      <TableRow key={item._id}>
                        <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>
                          {item.imgPath ? (
                            <Box
                              component="img"
                              src={item.imgPath}
                              alt={item.name}
                              sx={{
                                width: 80,
                                height: 50,
                                objectFit: 'cover',
                                borderRadius: 1,
                                border: '1px solid #ddd',
                              }}
                            />
                          ) : (
                            <Box
                              sx={{
                                width: 80,
                                height: 50,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                bgcolor: '#f5f5f5',
                                color: '#999',
                                fontSize: 12,
                              }}
                            >
                              No Image
                            </Box>
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
                            sx={{ color: item.isActive ? 'green' : 'red', fontWeight: 500, ml: 1 }}
                          >
                            {item.isActive ? 'Active' : 'Deactivated'}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Link to={`/${currentRole.toLowerCase()}/Banner/${item._id}`} style={linkStyle}>
                            Update
                          </Link>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </Box>
        )}

        <TblPaginationSimple />
      </Paper>

      <ConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} />
    </>
  );
}
