import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import {
  Tab,
  Tabs,
  Card,
  Table,
  Button,
  Tooltip,
  Divider,
  TableBody,
  Container,
  IconButton,
  TableContainer,
  Dialog,
  DialogContent,
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// @types
import { appointment } from '../../@types/user';
// _mock_
import { _userList } from '../../_mock/arrays';
// components
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
import ConfirmDialog from '../../components/confirm-dialog';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
import { useCollection } from 'react-firebase-hooks/firestore';
import { getFirestore, collection, doc, updateDoc } from "firebase/firestore";
import * as Yup from 'yup';
import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from '../../components/table';
// sections
import { AppointmentTableRow, AppointmentTableToolbar } from 'src/sections/appointment';
import { DialogTitle } from '@mui/material';
import { DialogActions } from '@mui/material';
import { DB } from 'src/auth/FirebaseContext';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FormProvider from 'src/components/hook-form/FormProvider';
import { LoadingButton } from '@mui/lab';
import { RHFTextField } from 'src/components/hook-form';
import { useSnackbar } from 'notistack';
// ----------------------------------------------------------------------

const STATUS_OPTIONS = ['all'];

const ROLE_OPTIONS = [
  'all',
  'ux designer',
  'full stack designer',
  'backend developer',
  'project manager',
  'leader',
  'ui designer',
  'ui/ux designer',
  'front end developer',
  'full stack developer',
];

const TABLE_HEAD = [
  { id: 's. No', label: 'Serial no.', align: 'left' },
  { id: 'name', label: 'Name', align: 'center' },
  { id: 'phone', label: 'Phone', align: 'right' },
  { id: 'email', label: 'Email', align: 'center' },
  { id: 'startDateTime', label: 'Start Date Time', align: 'right' },
  // { id: 'endDateTime', label: 'End Date Time', align: 'center' },
  { id: 'symptoms', label: 'Symptoms', align: 'right' },
  { id: 'status', label: 'Status', align: 'right' },
  { id: 'action', label: 'Action', align: 'right' },
];

// ----------------------------------------------------------------------

type FormValuesProps = {
  comment: string,
  status: boolean,
  id: string,
  email: string,
  endDateTime: string,
  startDateTime: string,
  name: string,
  phone: string,
  symptoms: string,
}
export default function AppointmentPage() {
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    //
    selected,
    setSelected,
    onSelectRow,
    onSelectAllRows,
    //
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();

  const { themeStretch } = useSettingsContext();

  const { enqueueSnackbar } = useSnackbar();

  const navigate = useNavigate();

  const [value] = useCollection(
    collection(getFirestore(), 'bookings'),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

  const [tableData, setTableData] = useState(_userList);

  useEffect(() => {
    const tempData: any = []
    if (value) {
      let index = 1
      value?.forEach((doc: any) => {
        const childData = doc.data();
        tempData.push({ ...childData, id: index++, fid: doc.id })
      });

      setTableData(tempData)
    }
  }, [value])

  // console.log(tableData);

  const [filterName, setFilterName] = useState('');

  const [filterRole, setFilterRole] = useState('all');

  const [openConfirm, setOpenConfirm] = useState(false);

  const [filterStatus, setFilterStatus] = useState('all');

  const [open, setOpen] = useState<boolean>(false)

  const [singleData, setSingleData] = useState<any>()

  const AppointmentSchema = Yup.object().shape({
    comment: Yup.string().required()
  });

  const defaultValues = {
    status: true,
    comment: "",
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(AppointmentSchema),
    defaultValues,
  });

  const {
    reset,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  function handleClose(): void {
    setOpen(false)
  }



  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterRole,
    filterStatus,
  });

  const dataInPage = dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const denseHeight = dense ? 52 : 72;

  const isFiltered = filterName !== '' || filterRole !== 'all' || filterStatus !== 'all';

  const isNotFound =
    (!dataFiltered.length && !!filterName) ||
    (!dataFiltered.length && !!filterRole) ||
    (!dataFiltered.length && !!filterStatus);

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleFilterStatus = (event: React.SyntheticEvent<Element, Event>, newValue: string) => {
    setPage(0);
    setFilterStatus(newValue);
  };

  const handleFilterName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleFilterRole = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPage(0);
    setFilterRole(event.target.value);
  };

  const handleDeleteRow = async (row: any) => {
    setSingleData(row)
    setOpen(true)
    // const deleteRow = tableData.filter((row) => row.id !== row.id);
    // setSelected([]);
    // setTableData(deleteRow);
    // if (page > 0) {
    //   if (dataInPage.length < 2) {
    //     setPage(page - 1);
    //   }
    // }
  };

  const handleDeleteRows = (selectedRows: string[]) => {
    const deleteRows = tableData.filter((row) => !selectedRows.includes(row.id));
    setSelected([]);
    setTableData(deleteRows);

    if (page > 0) {
      if (selectedRows.length === dataInPage.length) {
        setPage(page - 1);
      } else if (selectedRows.length === dataFiltered.length) {
        setPage(0);
      } else if (selectedRows.length > dataInPage.length) {
        const newPage = Math.ceil((tableData.length - selectedRows.length) / rowsPerPage) - 1;
        setPage(newPage);
      }
    }
  };

  const handleEditRow = (id: string) => {
   
  };

  const handleResetFilter = () => {
    setFilterName('');
    setFilterRole('all');
    setFilterStatus('all');
  };


  const toYes = async (row: any) => {
    const updateDataRef = doc(DB, "bookings", row.fid);
    await updateDoc(updateDataRef, { status: true, comment: getValues('comment') }).then((res) => {
      reset();
      enqueueSnackbar('Case Closed');
      setOpen(false)
    }).catch((error) => {
      reset()
      enqueueSnackbar('Something Went Wrong!', { variant: 'error' });
    })


  }


  return (
    <>
      <Helmet>
        <title> Appointment: List | Urgent ER</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Appointment List"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Appointment', href: PATH_DASHBOARD.ipMaster.root },
            { name: 'List' },
          ]}
        />

        <Card>
          <Tabs
            value={filterStatus}
            onChange={handleFilterStatus}
            sx={{
              px: 2,
              bgcolor: 'background.neutral',
            }}
          >
            {STATUS_OPTIONS.map((tab) => (
              <Tab key={tab} label={tab} value={tab} />
            ))}
          </Tabs>

          <Divider />

          <AppointmentTableToolbar
            isFiltered={isFiltered}
            filterName={filterName}
            filterRole={filterRole}
            optionsRole={ROLE_OPTIONS}
            onFilterName={handleFilterName}
            onFilterRole={handleFilterRole}
            onResetFilter={handleResetFilter}
          />

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={dense}
              numSelected={selected.length}
              rowCount={tableData.length}
              onSelectAllRows={(checked) =>
                onSelectAllRows(
                  checked,
                  tableData.map((row) => row.id)
                )
              }
              action={
                <Tooltip title="Delete">
                  <IconButton color="primary" onClick={handleOpenConfirm}>
                    <Iconify icon="eva:trash-2-outline" />
                  </IconButton>
                </Tooltip>
              }
            />

            <Scrollbar>
              <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={tableData.length}
                  numSelected={selected.length}
                  onSort={onSort}
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      tableData.map((row) => row.id)
                    )
                  }
                />

                <TableBody>
                  {dataFiltered
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => (
                      <AppointmentTableRow
                        row={row}
                        key={index}
                        onDeleteRow={() => handleDeleteRow(row)}
                      />
                    ))}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(page, rowsPerPage, tableData.length)}
                  />

                  <TableNoData isNotFound={isNotFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={dataFiltered.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
            //
            dense={dense}
            onChangeDense={onChangeDense}
          />
        </Card>
      </Container>


      <>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <FormProvider methods={methods} onSubmit={handleSubmit(toYes)}>
            <DialogTitle id="alert-dialog-title">
              {'Are you sure to Close this case?'}
            </DialogTitle>
            <DialogContent sx={{ mt: 2 }}>
              <RHFTextField name="comment" label="Comment" />


            </DialogContent>
            <DialogActions>
              <LoadingButton variant="contained" onClick={() => { toYes(singleData) }} loading={isSubmitting} >
                Yes
              </LoadingButton>
              <Button variant="contained" onClick={handleClose} autoFocus>
                No
              </Button>
            </DialogActions>
          </FormProvider>
        </Dialog>
      </>

      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows(selected);
              handleCloseConfirm();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  comparator,
  filterName,
  filterStatus,
  filterRole,
}: {
  inputData: appointment[];
  comparator: (a: any, b: any) => number;
  filterName: string;
  filterStatus: boolean | string;
  filterRole: string;
}) {
  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    inputData = inputData.filter(
      (user) => user.email.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  // if (filterStatus !== 'null') {
  //   inputData = inputData.filter((user) => user.status === filterStatus);
  // }

  // if (filterRole !== 'all') {
  //   inputData = inputData.filter((user) => user.role === filterRole);
  // }

  return inputData;
}
