import { Helmet } from "react-helmet-async";
import { useState, useEffect } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
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
  Box,
  CircularProgress,
} from "@mui/material";
// routes
import { PATH_DASHBOARD } from "../../routes/paths";
// @types
import { Case } from "../../@types/user";
// _mock_
import { _userList } from "../../_mock/arrays";
// components
import Iconify from "../../components/iconify";
import Scrollbar from "../../components/scrollbar";
import ConfirmDialog from "../../components/confirm-dialog";
import CustomBreadcrumbs from "../../components/custom-breadcrumbs";
import { useSettingsContext } from "../../components/settings";
import { useCollection } from "react-firebase-hooks/firestore";
import { getFirestore, collection, doc, deleteDoc } from "firebase/firestore";
import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from "../../components/table";
// sections
import { UserTableToolbar, UserTableRow } from "../../sections/cases";
import CustomTable, { Column } from "src/components/customTable";
// ----------------------------------------------------------------------

const STATUS_OPTIONS = ["all"];

const ROLE_OPTIONS = [
  "all",
  "ux designer",
  "full stack designer",
  "backend developer",
  "project manager",
  "leader",
  "ui designer",
  "ui/ux designer",
  "front end developer",
  "full stack developer",
];

const TABLE_HEAD = [
  { id: "title", label: "Title", align: "left" },
  { id: "caseNo", label: "Description", align: "left" },
  { id: "category", label: "Category", align: "left" },
  { id: "status", label: "Status", align: "left" },
  { id: "action", label: "Action", align: "right" },
];

// ----------------------------------------------------------------------

const db = getFirestore();
export default function UserListPage() {

  const columns: Column[] = [
    { id: 'merchantId', label: 'Mercahnt Id',align: 'center', minWidth: 200 },
    { id: 'stateCd', label: 'state id',align: 'center', minWidth: 200 },
    { id: 'rcRegnNo', label: 'Rc Regn No', minWidth: 200 , align: 'center',type:"boolean"},
    { id: 'rcRegnDt', label: 'Rc Regn Dt', minWidth: 200 , align: 'center',type:"boolean"},
    { id: 'rcChasiNo', label: 'Rc Chasi No', minWidth: 200 , align: 'center',type:"boolean"},
    { id: 'rcEngNo', label: 'Rc Eng No', minWidth: 200 , align: 'center',type:"boolean"},
    { id: 'rcVhClassNDesc', label: 'Rc vh Class no', minWidth: 200 , align: 'center',type:"boolean"},
    { id: 'rcMakerDesc', label: 'Rc Maker Desc', minWidth: 200 , align: 'center',type:"boolean"},
    { id: 'rcMakerModel', label: 'Rc Maker Model', minWidth: 200 , align: 'center',type:"boolean"},
    { id: 'rcBodyTypeDesc', label: 'Rc Body Test Type', minWidth: 200 , align: 'center',type:"boolean"},
    { id: 'rcFuelDesc', label: 'Rc Fule Desc', minWidth: 200 , align: 'center',type:"boolean"},
    { id: 'rcColor', label: 'Rc Color', minWidth: 200 , align: 'center',type:"boolean"},
    { id: 'rcOwnerName', label: 'Rc Owner Name', minWidth: 200 , align: 'center',type:"boolean"},
    { id: 'rcFName', label: 'Rc F Name', minWidth: 200 , align: 'center',type:"boolean"},
    { id: 'rcPermanentAddress', label: 'Rc Permanent Address', minWidth: 200 , align: 'center',type:"boolean"},
    { id: 'rcPresentAddress', label: 'Rc Present address', minWidth: 200 , align: 'center',type:"boolean"},
    { id: 'rcFitUpto', label: 'Rc Fit Upto', minWidth: 200 , align: 'center',type:"boolean"},
    { id: 'action', label: 'Action', minWidth: 100, align: 'right', type: 'action' },

  ];

  const { themeStretch } = useSettingsContext();

  const navigate = useNavigate();

  const [value] = useCollection(collection(getFirestore(), "client"), {
    snapshotListenOptions: { includeMetadataChanges: true },
  });

  const [tableData, setTableData] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(false);
    const tempData: any = [];
    if (value) {
      let index = 1;
      value?.forEach((doc: any) => {
        const childData = doc.data();
        tempData.push({ ...childData, id: index++, });
      });

      setTableData(tempData);
      setLoading(true);
    }
  }, [value]);

  console.log(tableData, "daata");

  return (
    <>
      <Helmet>
        <title> Client List</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading="Client List"
          links={[
            { name: "Dashboard", href: PATH_DASHBOARD.root },
            { name: "Cases", href: PATH_DASHBOARD.clientAccess.root },
            { name: "List" },
          ]}
          action={
            <Button
              component={RouterLink}
              to={PATH_DASHBOARD.clientAccess.new}
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              New Client
            </Button>
          }
        />
 <CustomTable
          columns={columns}
          rows={ tableData ??[]}
          // onClick={(e, row) => {
          //   handleOpenMenu(e, row)
          // }}
          
        />

        {/* <Popover
          open={Boolean(open)}
          anchorEl={open}
          onClose={handleCloseMenu}
          anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          PaperProps={{
            sx: {
              p: 1,
              width: 140,
              '& .MuiMenuItem-root': {
                px: 1,
                typography: 'body2',
                borderRadius: 0.75,
              },
            },
          }}
        >
          <MenuItem onClick={(e) => {
            navigate(PATH_DASHBOARD.broadcast.view(id as any))
          }} >
            <Iconify icon={'ic:baseline-remove-red-eye'} sx={{ mr: 2 }} />
            View
          </MenuItem>
        </Popover>
         */}
      </Container>

      
     
    </>
  );
}

// ----------------------------------------------------------------------

