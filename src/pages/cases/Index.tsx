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
    { id: 'title', label: 'Boradcast Name', minWidth: 10 },
    { id: 'description', label: 'Template Name', minWidth: 25 },
    { id: 'sendMessages', label: 'Send Messages', minWidth: 10 , align: 'center'},
    { id: 'failedMessages', label: 'Failed Messages',  minWidth: 10 ,align: 'center'},
    { id: 'createdAt', label: 'CreatedAt', minWidth: 100, align: 'left', },
    { id: 'status', label: 'Status', minWidth: 100, align: 'center', type: 'badge' },
   

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

