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
    { id: 'merchantKey', label: 'Merchant Key',align: 'center', minWidth: 150 },
    { id: 'clientName', label: 'Client Name',align: 'center', minWidth: 150 },
    { id: 'clientAddress', label: 'Client Address',align: 'center', minWidth: 150 },
    { id: 'clientCity', label: 'Client City',align: 'center', minWidth: 150 },
    { id: 'clientDistrict', label: 'Client District',align: 'center', minWidth: 150 },
    { id: 'clientPincode', label: 'Client Pincode',align: 'center', minWidth: 150 },
    { id: 'clientMobileNo', label: 'Client Mobile No',align: 'center', minWidth: 150 },
    { id: 'clientOfficeNo', label: 'Client Office No ',align: 'center', minWidth: 150 },
    { id: 'clientEmailid', label: 'Client Email id',align: 'center', minWidth: 150 },
    { id: 'validity', label: 'validity',align: 'center', minWidth: 150 },
    { id: 'opDt', label: 'Op Dt',align: 'center', minWidth: 150 },
    { id: 'napixUserId', label: 'Napix UserID',align: 'center', minWidth: 150 },
    { id: 'napixUserIdCreatedOn', label: 'Napix Created On',align: 'center', minWidth: 150 },
    { id: 'auditCertificateValidUpto', label: 'Audit certificate Valid upto',align: 'center', minWidth: 150 },
    { id: 'status', label: 'Status',align: 'center', minWidth: 150 ,type:"boolean"},
    { id: 'encryption', label: 'Encryption',align: 'center', minWidth: 150 ,type:"boolean"},
    { id: 'isNapixRequired', label: 'Is Napox Required',align: 'center', minWidth: 150 ,type:"boolean"},
  ];

  const { themeStretch } = useSettingsContext();

  const navigate = useNavigate();

  const [value] = useCollection(collection(getFirestore(), "clientMaster"), {
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
        <title> Client Master</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading="Client Master"
          links={[
            { name: "Dashboard", href: PATH_DASHBOARD.root },
            { name: "Client Master", href: PATH_DASHBOARD.clientMaster.root },
            { name: "List" },
          ]}
          action={
            <Button
              component={RouterLink}
              to={PATH_DASHBOARD.clientMaster.new}
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              New Client Master
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

