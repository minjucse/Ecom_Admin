// useTable.tsx
import * as React from "react";
import {
  Table, TableHead, TableRow, TableCell, TableSortLabel,
  Box, Typography, Pagination, PaginationItem, Select, MenuItem
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { makeStyles } from "@mui/styles";
import { TMeta } from "@/types";

const useStyles = makeStyles({
  table: {
    "& thead th": {
      fontWeight: 600,
      color: "#fff",
      backgroundColor: "#3D4955",
    },
    "& tbody td": {
      fontWeight: 300,
      padding: "10px 16px",
    },
    "& tbody tr:hover": {
      backgroundColor: "#F0F0F0",
      cursor: "pointer",
    },
  },
});

export type HeadCell = {
  id: string;
  label: string;
  disableSorting?: boolean;
};

type UseTableProps<T> = {
  records: T[];
  headCells: HeadCell[];
  filterFn: { fn: (items: T[]) => T[] };
  meta: TMeta;
  page: number;                     
  rowsPerPage: number;
  handleChangePage: (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => void;
  handleChangeRowsPerPage: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onSimplePageChange?: (event: React.ChangeEvent<unknown>, page: number) => void;
};

function useTable<T>({
  records,
  headCells,
  filterFn,
  meta,
  rowsPerPage,
  handleChangeRowsPerPage,
  onSimplePageChange,
}: UseTableProps<T>) {
  const classes = useStyles();
  const [order, setOrder] = React.useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = React.useState<string>("");

  const TblContainer = ({ children }: { children: React.ReactNode }) => (
    <Table className={classes.table}>{children}</Table>
  );

  const TblHead = () => {
    const handleSortRequest = (cellId: string) => {
      const isAsc = orderBy === cellId && order === "asc";
      setOrder(isAsc ? "desc" : "asc");
      setOrderBy(cellId);
    };
    return (
      <TableHead>
        <TableRow>
          {headCells.map((h) => (
            <TableCell key={h.id} sortDirection={orderBy === h.id ? order : false}>
              {h.disableSorting ? (
                h.label
              ) : (
                <TableSortLabel
                  active={orderBy === h.id}
                  direction={orderBy === h.id ? order : "asc"}
                  onClick={() => handleSortRequest(h.id)}
                >
                  {h.label}
                </TableSortLabel>
              )}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  };

  /** 🔑 Simplified footer with a rows-per-page dropdown */
  const TblPaginationSimple = () => {
    const totalPages = meta.totalPage ?? Math.ceil(meta.total / rowsPerPage);
    if (!onSimplePageChange) return null;

    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 2,
          px: 1,
          gap: 4,
        }}
      >
        <Typography variant="body2">
          Page {meta.page} of {totalPages} — Total: {meta.total}
        </Typography>

        {/* --- Rows per page dropdown --- */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mr:5 }}>
          <Typography variant="body2">Rows:</Typography>
          <Select
            size="small"
            value={rowsPerPage}
            onChange={(e) =>
              handleChangeRowsPerPage(
                e as unknown as React.ChangeEvent<HTMLInputElement>
              )
            }
          >
            {[10, 25, 50, 100].map((size) => (
              <MenuItem key={size} value={size}>
                {size}
              </MenuItem>
            ))}
          </Select>

          {/* --- Page number pagination --- */}
          <Pagination
            color="primary"
            shape="rounded"
            page={meta.page}
            count={totalPages}
            onChange={onSimplePageChange}
            renderItem={(item) => (
              <PaginationItem
                slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
                {...item}
              />
            )}
          />
        </Box>
      </Box>
    );
  };

  const descendingComparator = (a: T, b: T, orderBy: string) => {
    if ((b as any)[orderBy] < (a as any)[orderBy]) return -1;
    if ((b as any)[orderBy] > (a as any)[orderBy]) return 1;
    return 0;
  };
  const getComparator = (o: "asc" | "desc", ob: string) =>
    o === "desc"
      ? (a: T, b: T) => descendingComparator(a, b, ob)
      : (a: T, b: T) => -descendingComparator(a, b, ob);
  const stableSort = (arr: T[], comp: (a: T, b: T) => number) =>
    arr
      .map((el, idx) => [el, idx] as [T, number])
      .sort((a, b) => {
        const order = comp(a[0], b[0]);
        return order !== 0 ? order : a[1] - b[1];
      })
      .map((el) => el[0]);

  const recordsAfterPagingAndSorting = () =>
    stableSort(filterFn.fn(records), getComparator(order, orderBy));

  return { TblContainer, TblHead, TblPaginationSimple, recordsAfterPagingAndSorting };
}

export default useTable;
