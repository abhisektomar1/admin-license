import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Stack,
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// @types
import { slots } from '../../@types/user';
// _mock_
import { _userList } from '../../_mock/arrays';
// components
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
import ConfirmDialog from '../../components/confirm-dialog';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
import { useCollection } from 'react-firebase-hooks/firestore';
import { getFirestore, collection, addDoc, doc, updateDoc } from "firebase/firestore";
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
import { SlotsTableRow, SlotsTableToolbar } from 'src/sections/slots';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FormProvider from 'src/components/hook-form/FormProvider';
import { DialogTitle } from '@mui/material';
import { DialogContent } from '@mui/material';
import { RHFSelect, RHFTextField } from 'src/components/hook-form';
import { DialogActions } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
import { DB } from 'src/auth/FirebaseContext';
import dayjs from 'dayjs';
// ----------------------------------------------------------------------

type FormValuesProps = {
  end: string,
  start: string,
}

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
  { id: 'start', label: 'Start', align: 'center' },
  { id: 'end', label: 'End', align: 'center' },
  { id: 'status', label: 'Status', align: 'center' },
  { id: 'action', label: 'Action', align: 'right' },
];

// ----------------------------------------------------------------------

export default function SlotsPage() {
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

  const navigate = useNavigate();

  const [value] = useCollection(
    collection(getFirestore(), 'slots'),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

  const [tableData, setTableData] = useState(_userList);

  const AppointmentSchema = Yup.object().shape({
    start: Yup.string().required(),
    end: Yup.string().required()
  });

  const defaultValues = {
    start: "",
    end: "",
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

  const { enqueueSnackbar } = useSnackbar();

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

  const handleDeleteRow = async (id: string) => {


    const deleteRow = tableData.filter((row) => row.id !== id);
    setSelected([]);
    setTableData(deleteRow);

    if (page > 0) {
      if (dataInPage.length < 2) {
        setPage(page - 1);
      }
    }
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

  const handleEditRow = async (row: any) => {

    const updateDataRef = doc(DB, "slots", row.fid);

    if (row?.status === true) {
      await updateDoc(updateDataRef, { status: false }).then((res: any) => {
        reset();
        enqueueSnackbar(`Slot Status Change`);
        setOpen(false)
      }).catch((error) => {
        reset()
        enqueueSnackbar('Something Went Wrong!', { variant: 'error' });
      })
    }
    else {
      await updateDoc(updateDataRef, { status: true }).then((res: any) => {
        reset();
        enqueueSnackbar(`Slot Status Change`);
        setOpen(false)
      }).catch((error) => {
        reset()
        enqueueSnackbar('Something Went Wrong!', { variant: 'error' });
      })
    }

  };

  function handleClose(): void {
    setOpen(false)
  }

  const handleResetFilter = () => {
    setFilterName('');
    setFilterRole('all');
    setFilterStatus('all');
  };


  const onSubmit = async (data: FormValuesProps) => {
    // console.log(data);

    // const startDate = dayjs(data.start).format('LT');
    // console.log(startDate);

    // const endDate = dayjs(data.end).format('YYYY-MM-DD HH:MM');
    try {
      await addDoc(collection(DB, "slots"), {
        // ...data,
        start: data.start,
        end: data.end,
        status: true,
      }).then(() => {
        reset();
        enqueueSnackbar('Slots Added success!');
        setOpen(false)
      }).catch((e) => {
        console.log(e);
        enqueueSnackbar('Slots can"t Added success!', { variant: "error" });
      }).finally(() => {
        enqueueSnackbar('Slots Added success!');
        setOpen(false)
      });
    } catch (error) {
      console.error(error);
    }
  };

  const time = [
    { value: "7:00 AM" },
    { value: "7:30 AM" },
    { value: "8:00 AM" },
    { value: "8:30 AM" },
    { value: "9:00 AM" },
    { value: "9:30 AM" },
    { value: "10:00 AM" },
    { value: "10:30 AM" },
    { value: "11:00 AM" },
    { value: "11:30 AM" },
    { value: "12:00 PM" },
    { value: "12:30 PM" },
    { value: "1:00 PM" },
    { value: "1:30 PM" },
    { value: "2:00 PM" },
    { value: "2:30 PM" },
    { value: "3:00 PM" },
    { value: "3:30 PM" },
    { value: "4:00 PM" },
    { value: "4:30 PM" },
    { value: "5:00 PM" },
    { value: "5:30 PM" },
    { value: "6:00 PM" },
    { value: "6:30 PM" },
    { value: "7:00 PM" },
    { value: "7:30 PM" },
    { value: "8:00 PM" },
    { value: "8:30 PM" },
    { value: "9:00 PM" },
    { value: "9:30 PM" },
    { value: "10:00 PM" },
    { value: "10:30 PM" },
    { value: "11:00 PM" },
    { value: "11:30 PM" },
    { value: "12:00 AM" },
    { value: "12:30 AM" },
    { value: "1:00 AM" },
    { value: "1:30 AM" },
    { value: "2:00 AM" },
    { value: "2:30 AM" },
    { value: "3:00 AM" },
    { value: "3:30 AM" },
    { value: "4:00 AM" },
    { value: "4:30 AM" },
    { value: "5:00 AM" },
    { value: "5:30 AM" },
    { value: "6:00 AM" },
    { value: "6:30 AM" },
  ]

  return (
    <>
      <Helmet>
        <title> Slots: List | Urgent ER</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Slots List"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Slots', href: PATH_DASHBOARD.slots.root },
            { name: 'List' },
          ]}
          action={
            <Button
              // component={RouterLink}
              // to={PATH_DASHBOARD.slots.root}
              onClick={() => {
                setOpen(true)
              }}
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              New Slot
            </Button>
          }
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

          <SlotsTableToolbar
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
                      <SlotsTableRow
                        row={row}
                        key={index}
                        onDeleteRow={() => handleDeleteRow(row.fid as string)}
                        onEditRow={() => { handleEditRow(row) }}
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
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <DialogTitle id="alert-dialog-title">
              {'Are you sure to Close this case?'}
            </DialogTitle>
            <DialogContent>
              <Stack direction='column' display='flex' justifyContent='center' alignItems='center' spacing={2} sx={{ mt: 2 }}>
                <RHFSelect
                  name='start'
                  label="Start Time"
                  InputLabelProps={{ shrink: true }}
                  defaultValue={"Select Time"}
                >
                 
                  {time.map((data, index) => (
                    <option value={data.value} tabIndex={index} key={index}>{data.value}</option>

                  ))}
                </RHFSelect>
                <RHFSelect
                  name='end'
                  label="End Time"
                  InputLabelProps={{ shrink: true }}
                  defaultValue="Select Time"
                >
               
                  {time.map((data, index) => (
                    <option tabIndex={index} value={data.value} key={index}>{data.value}</option>

                  ))}
                </RHFSelect>

              </Stack>
            </DialogContent>
            <DialogActions>
              <LoadingButton type='submit' variant="contained" loading={isSubmitting} >
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
  inputData: slots[];
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
      (user) => user.start.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
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
