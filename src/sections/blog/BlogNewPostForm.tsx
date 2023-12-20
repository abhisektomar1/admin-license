import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, } from 'react';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// @mui
import { LoadingButton } from '@mui/lab';
import { Grid, Card, Stack, Typography, MenuItem } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// @types
import { useSnackbar } from '../../components/snackbar';
import FormProvider, {
  RHFSwitch,
  RHFEditor,
  RHFTextField,
  RHFCheckbox
} from '../../components/hook-form';
//
import { styled } from '@mui/system';
import { addDoc, collection, getFirestore, serverTimestamp } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { DB } from 'src/auth/FirebaseContext';


// Test 
//@ts-ignore
import dayjs, { Dayjs } from 'dayjs';
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { Select } from '@mui/material';


const LabelStyle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

// ----------------------------------------------------------------------
type IBlogNewPost = {
  title: string;
  description: string;
  body: string;
  coverPage?: File;
  status: boolean;
  thumbnail?: File;
};

export type FormValuesProps = IBlogNewPost;

export default function BlogNewPostForm() {



  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();


  const NewBlogSchema = Yup.object().shape({
    // title: Yup.string().required('Title is required'),
    // description: Yup.string().required('Description is required'),
    // tags: Yup.array().min(2, 'Must have at least 2 tags'),
    // metaKeywords: Yup.array().min(1, 'Meta keywords is required'),
    // cover: Yup.mixed().required('Cover is required').nullable(true),
    // content: Yup.string().required('Content is required'),
  });

  const defaultValues = {

  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(NewBlogSchema),
    defaultValues,
  });

  const {
    reset,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;



  const onSubmit = async (data: FormValuesProps) => {
    try {

      await addDoc(collection(DB, "client"), {
        ...data
      }).then(() => {
        reset();
        enqueueSnackbar('client create success!');
      }).catch((e) => {
        console.log(e);
        enqueueSnackbar('Cases can"t create success!', { variant: "error" });
      }).finally(() => {
        navigate(PATH_DASHBOARD.clientAccess.list)
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={2} direction='row' >
              <RHFTextField name="merchantId" label="merchant ID" />
              <RHFTextField name="stateCd" label="State Cd" />
            </Stack>

            <Stack spacing={10} direction='row' margin={2} >
              <RHFCheckbox name='rcRegnNo' label="Rc Registration No" />
              <RHFCheckbox name='rcRegnDt' label="Rc Registration Dt" />
              <RHFCheckbox name='rcChasiNo' label="Rc Chasi No" />
            </Stack>

            <Stack spacing={10} direction='row' margin={2} >
              <RHFCheckbox name='rcEngNo' label="Rc Eng No" />
              <RHFCheckbox name='rcVhClassNDesc' label="Rc Vs Class Desc" />
              <RHFCheckbox name='rcMakerDesc' label="Rc Maker Desc" />
            </Stack>

            <Stack spacing={10} direction='row' margin={2} >
              <RHFCheckbox name='rcMakerModel' label="Rc Maker Model" />
              <RHFCheckbox name='rcBodyTypeDesc' label="Rc Body Type Desk" />
              <RHFCheckbox name='rcFuelDesc' label="Rc Fuel Desc" />
              </Stack>

            <Stack spacing={10} direction='row' margin={2} >
              <RHFCheckbox name='rcColor' label="Rc Color" />
              <RHFCheckbox name='rcOwnerName' label="Rc Owner Name" />
              <RHFCheckbox name='rcFName' label="Rc First Name" />
              </Stack>
         

            <Stack spacing={10} direction='row' margin={2} >
              <RHFCheckbox name='rcPermanentAddress' label="Rc Permanent Address" />
              <RHFCheckbox name='rcPresentAddress' label="Rc Present Address" />
              <RHFCheckbox name='rcFitUpto' label="Rc Fit upto" />
              </Stack>

            <Stack spacing={10} direction='row' margin={2} >
              
              <RHFCheckbox name='rcNpUpto' label="Rc Np Upto" />
              <RHFCheckbox name='rcTaxUpto' label="Rc tax Upto" />
              <RHFCheckbox name='rcNormsDesc' label="Rc Norms Desc" />
              </Stack>

              <Stack spacing={10} direction='row' margin={2} >

              <RHFCheckbox name='rcFinancer' label="Rc Financer" />
              <RHFCheckbox name='rcInsuranceComp' label="Rc Insurance Comp" />
              <RHFCheckbox name='rcInsurancePolicyNo' label="Rc Insurance Policy No" />
              </Stack>

              <Stack spacing={10} direction='row' margin={2} >

              <RHFCheckbox name='rcInsuranceUpro' label="Rc Insurance Upto" />
              <RHFCheckbox name='rcRegisterdAt' label="Rc Registerd At " />
              <RHFCheckbox name='rcStatusAsOn' label="Rc Status As On" />
              </Stack>

              <Stack spacing={10} direction='row' margin={2} >

              <RHFCheckbox name='rcManuMonthYear' label="Rc Menu Month year" />
              <RHFCheckbox name='rcUnIDWt' label="Rc Un ID Wt" />
              <RHFCheckbox name='rcGvw' label="Rc Gvw" />
              </Stack>
              <Stack spacing={10} direction='row' margin={2} >

              <RHFCheckbox name='rcNoCyl' label="Rc No Cyl" />
              <RHFCheckbox name='rcCubicCap' label="Rc Cubic Cap" />
              <RHFCheckbox name='rcSeatCap' label="Rc Seat Cap" />
              </Stack>

              <Stack spacing={10} direction='row' margin={2} >

              <RHFCheckbox name='rcSleeperCap' label="Rc Sleeper Cap" />
              <RHFCheckbox name='rcStandCap' label="Rc stand Cap" />
              <RHFCheckbox name='rcWheelBase' label="Rc Wheel Base" />
              </Stack>

              <Stack spacing={10} direction='row' margin={2} >

              <RHFCheckbox name='rcNpNo' label="Rc Np No" />
              <RHFCheckbox name='rcNpIssuedBy' label="Rc Np Issued By" />
              <RHFCheckbox name='rcOwnerSr' label="Rc owner Sr" />
              </Stack>

              <Stack spacing={10} direction='row' margin={2} >

              <RHFCheckbox name='rcMobileNo' label="Rc Mobile No" />
              <RHFCheckbox name='rcVchCatg' label="Rc Vch Catg" />
              <RHFCheckbox name='rcPuccDetails' label="Rc Pucc Details" />
              </Stack>

              <Stack spacing={10} direction='row' margin={2} >

              <RHFCheckbox name='rcPermitDetails' label="Rc permit Details" />
              <RHFCheckbox name='rcNcrbStatus' label="Rc Ncrb Status" />
              <RHFCheckbox name='rcBlackListStatus' label="Rc BlackList Status" />
              </Stack>

              <Stack spacing={10} direction='row' margin={2} >

              <RHFCheckbox name='rcNocDetails' label="Rc Noc Details" />
              <RHFCheckbox name='rcOwnerCd' label="Rc Oner Cd" />
              <RHFCheckbox name='rcVhType' label="Rc Vh Type" />
              </Stack>

              <Stack spacing={10} direction='row' margin={2} >

              <RHFCheckbox name='rcRegnUpto' label="Rc Regn upto" />
              <RHFCheckbox name='rcPurchaseDt' label="Rc Purchase Dt" />
              <RHFCheckbox name='rcOwnerHistory' label="Rc Owner Histroy" />
              </Stack>

              <Stack spacing={10} direction='row' margin={2} >

              <RHFCheckbox name='rcVhClass' label="Rc Vh Class" />
              <RHFCheckbox name='rcNocDt' label="Rc Noc Dt" />
              <RHFCheckbox name='rcRegnTypeCd' label="Rc Regn Type Cd" />
              </Stack>

              <Stack spacing={10} direction='row' margin={2} >

              <RHFCheckbox name='rcFuelCd' label="Rc Fuel Cd" />
              <RHFCheckbox name='rcMakerCd' label="Rc Maker Cd" />
              <RHFCheckbox name='rcModelCd' label="Rc Model Cd" />
              </Stack>

              <Stack spacing={10} direction='row' margin={2} >

              <RHFCheckbox name='rcNormsCd' label="Rc Norms Cd" />
              <RHFCheckbox name='rcSaleAmt' label="Rc Sale Amt" />
              <RHFCheckbox name='rcOwnCatgDesc' label="Rc Own Catg Desc" />
              </Stack>

              <Stack spacing={10} direction='row' margin={2} >

              <RHFCheckbox name='rcVchCatgDesc' label="Rc Vch Catg Desc" />
              <RHFCheckbox name='rcOwnerCdDesc' label="Rc Owner Cd Desc" />
              <RHFCheckbox name='rcDealer' label="Rc Dealer" />
              </Stack>
              <Stack spacing={10} direction='row' margin={2} >

              <RHFCheckbox name='rcDeemedDealer' label="Rc Deemed Dealer" />
              <RHFCheckbox name='rcNonuse' label="Rc Non Use" />
              <RHFCheckbox name='rcPassengerTax' label="Rc Passenger Tax" />
              </Stack>
              <Stack spacing={10} direction='row' margin={2} >

              <RHFCheckbox name='rcGoodsTax' label="Rc Goods tax" />
              </Stack>

            <Stack direction="row" spacing={1.5} sx={{ mt: 3 }}>

              <LoadingButton
                fullWidth
                type="submit"
                variant="contained"
                size="large"
              >
                create
              </LoadingButton>
            </Stack>


          </Card>
        </Grid>
      </Grid>
      {/* <BlogNewPostPreview
        values={values}
        open={openPreview}
        isValid={isValid}
        isSubmitting={isSubmitting}
        onClose={handleClosePreview}
        onSubmit={handleSubmit(onSubmit)}
      /> */}
    </FormProvider>
  );
}
