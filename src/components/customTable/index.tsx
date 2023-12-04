import { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, TextField, Box, IconButton, Button, Card, Stack, CircularProgress } from '@mui/material';
import Iconify from '../iconify';
import Label from '../label';



export interface Column {
  id: string;
  label: string;
  minWidth?: number;
  align?: any;
  format?: (value: number) => string;
  type?: "string" | "image" | "action" | "badge" | "serial" | "description"  | "delete" | "update" ; // Add "serial" type
}

interface Row {
  [key: string]: string | number | null;
}



  interface Props {
    columns: Column[];
    rows: any[];
    rowsPerPageOptions?: number[];
    defaultRowsPerPage?: number;
    onClick?: (event: MouseEvent, row: Row) => void;
    onDeleteClick?: (event: MouseEvent, row: Row) => void;
    onUpdateClick?: (event: MouseEvent, row: Row) => void;
    filters?: Column[];
    loading?: boolean;
    limit?: (number: number) => void;
    offset?: (number: number) => void;
  
  }
export default function CustomTable(props: Props) {

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(props.defaultRowsPerPage ?? 5);
  const [search, setSearch] = useState('');
  const [filterValues, setFilterValues] = useState({});
  const [dense, setDense] = useState(false);

  const filteredRows = props.rows.filter((row) =>
    Object.values(row).some((value) =>
      String(value).toLowerCase().includes(search.toLowerCase())
    )
  );

  const pageCount = Math.ceil(filteredRows.length / rowsPerPage);
  const paginatedRows = filteredRows.slice(
    page * rowsPerPage,
    (page + 1) * rowsPerPage
  );

  const handleChangePage = (event: any, newPage: number) => {
    setPage(newPage);
      props.offset?.(newPage)
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    props.limit?.(parseInt(event.target.value, 10))

  };

  const handleDenseToggle = () => {
    setDense((prevState) => !prevState);
  };
  return (
    <>
    <Card sx={{pt:2, borderRadius:4.5}}>
    <div>
      <div style={{padding:10}}>
      <TextField
        sx={{ mb:1}}
        name='search'
        variant='outlined'
        label="Search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        fullWidth
      />
      </div>
      <TableContainer component={Paper} sx={{ minWidth: 800, position: 'relative', border: '2px solid #f3f6f8', borderTopLeftRadius: 3, borderRadius: 0,}}>
        <Table aria-label="custom table" >
        {props.loading ? (
              <Stack direction="row" display="flex" justifyContent="center" alignItems="center">
                <CircularProgress size={50} sx={{ mt: 10, mb: 10 }} />
              </Stack>
            ) : (
              <>
                <TableHead >

                  {filteredRows.length === 0 ? (
                    <>
                      <TableRow>
                        {/* Add the Serial column */}
                        <TableCell
                          key="serial"
                          align="left"
                          style={{  backgroundColor: '#f4f6f8', color: '#637381' }}
                        >
                          #
                        </TableCell>
                        {props.columns.map((column) => (
                          <TableCell
                            key={column.id}
                            align={column.align}
                            style={{ minWidth: column.minWidth, backgroundColor: '#f4f6f8', color: '#637381' }}
                          >
                            {column.label}
                          </TableCell>
                        ))}
                      </TableRow>
                    </>
                  ) : (
                      <TableRow>
                        {/* Add the Serial column */}
                        <TableCell
                          key="serial"
                          align="left"
                          style={{  backgroundColor: '#f4f6f8', color: '#637381' }}
                        >
                          #
                        </TableCell>
                        {props.columns.map((column) => (
                          
                          <TableCell
                            key={column.id}
                            align={column.align}
                            style={{ minWidth: column.minWidth, backgroundColor: '#f4f6f8', color: '#637381' }}
                          >
                            {column.label}
                          </TableCell>
                        ))}
                      </TableRow>
                    )}
                </TableHead>
                <TableBody>
                  {
                    filteredRows.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={props.columns.length + 1} align="center">
                        no data
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedRows.map((row, index) => (
                        <TableRow hover={true} role="checkbox" tabIndex={-1} key={row.code}>
                          {/* Display the serial number */}
                          <TableCell align="left">{(page * rowsPerPage) + index + 1}</TableCell>
                          {props.columns.map((column) => {
                            const value = row[column.id];
                            const columnType = column.type;
                            if (columnType === "description") {
                              return (
                                <TableCell key={column.id}
                                  align={column.align}
                                  style={{ minWidth: column.minWidth }}
                                  sx={{
                                    display: '-webkit-box',
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                    WebkitLineClamp: 2, // Limit text to 3 lines
                                    textOverflow: 'ellipsis',
                                  }}
                                >
                                 <div dangerouslySetInnerHTML={{ __html: value.toString() }} />
                                </TableCell>
                              );
                            }
                            if (columnType === "badge") {
                              return (
                                <TableCell key={column.id}
                                  align={column.align}
                                  style={{ minWidth: column.minWidth }}
                                >
                                  <Label
                                    variant={'filled'}
                                    color={
                                      (value === 'active' && 'success') ||
                                      (value === 'unpaid' && 'warning') ||
                                      (value === 'inactive' && 'error') ||
                                      (value === 'approved' && 'success') ||
                                      (value === 'pending' && 'warning') ||
                                      (value === 'flagged' && 'error') ||
                                      (value === 'rejected' && 'error') ||
                                      (value === 'under-process' && 'warning') ||
                                      (value === 'suspended' && 'error') ||
                                      (value === 'verified' && 'success') ||
                                      (value === 'APPROVED' && 'success') ||
                                      (value === 'REJECTED' && 'error') ||
                                      (value === 'SUCCESS' && 'success') ||
                                      (value === 'SENT' && 'success') ||
                                      (value === 'sent' && 'success') ||
                                      (value === 'PENDING' && 'warning') ||
                                      (value === 'unpaid' && 'warning') ||
                                      'default'
                                    }
                                    sx={{ textTransform: 'capitalize' }}
                                  >
                                    {value}
                                  </Label>
                                </TableCell>
                              );
                            }
                            if (columnType === "image") {
                              return (
                                <TableCell key={column.id} align={column.align}>
                                  <Box
                                    component="img"
                                    src={value as string}
                                    width="50px"
                                    height="50px"
                                  />
                                </TableCell>
                              );
                            }
                            if (columnType === "action") {
                              return (
                                <TableCell align="right" >
                                  <IconButton size="small" color="inherit" onClick={(event: any) => props.onClick?.(event, row)}>
                                    <Iconify icon={'eva:more-vertical-fill'} />
                                  </IconButton>
                                </TableCell>
                              );
                            }
                            if (columnType === "delete") {
                              return (
                                <TableCell align="right" >
                                  <IconButton size="small" color="error" onClick={(event: any) => props.onDeleteClick?.(event, row)}>
                                    <Iconify icon={'ic:baseline-delete'} />
                                  </IconButton>
                                </TableCell>
                              );
                            }
                            if (columnType === "update") {
                              return (
                                <TableCell align="right" >
                                  <IconButton size="small" color="warning" onClick={(event: any) => props.onUpdateClick?.(event, row)}>
                                    <Iconify icon={'heroicons:pencil-solid'} />
                                  </IconButton>
                                </TableCell>
                              );
                            }
                            return (
                              <TableCell key={column.id} align={column.align}>
                                {column.format && typeof value === 'number'
                                  ? column.format(value as number)
                                  : value}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      ))
                    )
                  }
                 
                </TableBody>
              </>
            )}
        </Table>
      </TableContainer>
      <Box sx={{
        position: 'relative', border: '1px solid #f3f6f8', borderBottomRightRadius: 35, borderBottomLeftRadius: 35
      }}>
        < TablePagination
          rowsPerPageOptions={props.rowsPerPageOptions ?? [5, 10, 25]}
          component="div"
          count={0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
    </div >
    </Card>
    </>
  )
}
