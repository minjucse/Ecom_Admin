
import React, { useState, useMemo } from 'react';
import {
  Paper,
  TableBody,
  TableCell,
  TableRow,
  CircularProgress,
  Checkbox,
  Box,
  TextField,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

import PageHeader from '@/components/ui/PageHeader';
import Controls from '@/components/controls';
import useTable from '@/components/ui/useTable';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import {
  useGetAllAttributeGroupsQuery,
  useUpdateAttributeGroupMutation,
} from '@/redux/features/admin/products/attribute.api';
import { useAppSelector } from '@/redux/hooks';
import { selectCurrentRole } from '@/redux/features/auth/authSlice';
import { IAttributeGroup } from '@/types';

const headCells = [
  { id: 'number', label: '#' },
  { id: 'name', label: 'Name' },
  { id: 'status', label: 'Status' },
  { id: 'update', label: 'Update', disableSorting: true },
];

export default function AttributeGroups() {
  const [updateAttributeGroup] = useUpdateAttributeGroupMutation();
  const currentRole = useAppSelector(selectCurrentRole) ?? 'admin';

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterKeyword, setFilterKeyword] = useState('');

  const params = useMemo(
    () => ({
      page: page + 1,
      limit: rowsPerPage,
      name: filterKeyword || undefined,
    }),
    [page, rowsPerPage, filterKeyword]
  );

  const { data: apiResponse, isFetching } = useGetAllAttributeGroupsQuery(params);
  const records = apiResponse?.data || [];
  const meta = apiResponse?.meta || { page: 1, limit: rowsPerPage, total: 0, totalPage: 1 };
  const filterFn = { fn: (items: IAttributeGroup[]) => items };

  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    subTitle: '',
    onConfirm: () => { },
  });

  const { TblContainer, TblHead, TblPaginationSimple, recordsAfterPagingAndSorting } =
    useTable<IAttributeGroup>({
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

  const handleStatusUpdate = async (item: IAttributeGroup, newStatus: boolean) => {
    setConfirmDialog({ isOpen: false, title: '', subTitle: '', onConfirm: () => { } });

    const updatedItem: Partial<IAttributeGroup> = { isActive: newStatus };
    const toastId = toast.loading('Updating...', { position: 'top-right' });

    try {
      await updateAttributeGroup({ id: item._id, requestData: updatedItem }).unwrap();
      toast.success('Status updated successfully', { id: toastId, position: 'top-right' });
    } catch (error) {
      toast.error('Failed to update status', { id: toastId, position: 'top-right' });
      console.error(error);
    }
  };

  const updateStatus = (e: React.ChangeEvent<HTMLInputElement>, item: IAttributeGroup) => {
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
            mb: 2
          }}
        >
          <PageHeader title="Attribute Groups" subTitle="Manage your attribute groups (e.g. Color, Size)" />
          <Controls.Button
            text="Add Attribute Group"
            component={Link}
            to={`/${currentRole.toLowerCase()}/attribute-group`}
            sx={{ backgroundColor: '#5cb85c', '&:hover': { opacity: 0.8 } }}
          />
        </Box>

        {/* Simple Filter */}
        <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
          <TextField
            label="Search by Name"
            variant="outlined"
            size="small"
            value={filterKeyword}
            onChange={(e: any) => {
              setFilterKeyword(e.target.value);
              setPage(0);
            }}
          />
        </Box>

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
                    No attribute groups found
                  </TableCell>
                </TableRow>
              ) : (
                recordsAfterPagingAndSorting().map((item, index) => (
                  <TableRow key={item._id}>
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell>{item.name}</TableCell>
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
                      <Link to={`/${currentRole.toLowerCase()}/attribute-group/${item._id}`} style={linkStyle}>
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
