


import { Helmet } from 'react-helmet-async';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import { useSettingsContext } from '../../components/settings';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
// sections

import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';

// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// @mui
import { LoadingButton } from '@mui/lab';
import { Grid, Card, Stack, } from '@mui/material';
// routes

// @types
import { useSnackbar } from '../../components/snackbar';
import FormProvider, {

  RHFCheckbox,
  RHFTextField,

} from '../../components/hook-form';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { DB } from 'src/auth/FirebaseContext';
import { addDoc, collection,} from "firebase/firestore";
import { Box } from '@mui/system';




// ----------------------------------------------------------------------


type category = {
  title: string;
  key:string;

};

export type FormValuesProps = category;
export default function Create() {
  const { themeStretch } = useSettingsContext();


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

    
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const onSubmit = async (data: FormValuesProps) => {
    console.log(data);
    
    try {
      
      await addDoc(collection(DB,"clientMaster"), {
         ...data,
      }).then(()=>{
        reset();
        enqueueSnackbar('Client master success!');
      }).catch((e)=>{
        console.log(e);
        enqueueSnackbar('Clinetr Master can"t create success!',{ variant:"error" });
      }).finally(()=>{
        navigate(PATH_DASHBOARD.clientMaster.list)
      });      
    } catch (error) {
      console.error(error);
   }
  };


  return (
    <>
      <Helmet>
        <title> Clinet Master</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Create a new Client Master"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Client Master',
              href: PATH_DASHBOARD.clientMaster.list,
            },
            {
              name: 'Create',
            },
          ]}
        />
   <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Card sx={{ p: 3 }}>
              <Stack spacing={2} direction='row' m={2}>
              <RHFTextField name="merchantId" label="Merchant Id"  />
              <RHFTextField name="stateCd" label="State Cd"  />
              <RHFTextField name="merchantKey" label="Merchant Key"  />
              </Stack>


              <Stack spacing={2} direction='row' m={2}>
              <RHFTextField name="clientName" label="Client Name"  />
              <RHFTextField name="clientAddress" label="Client Address Title"  />
              <RHFTextField name="clientCity" label="Client Citry"  />
              </Stack>

              <Stack spacing={2} direction='row' m={2}>
              <RHFTextField name="clientDistrict" label="Client District"  />
              <RHFTextField name="clientPincode" label="Client Pincode"  />
              <RHFTextField name="clientMobileNo" label="Client Mobile No"  />
              </Stack>


              <Stack spacing={2} direction='row' m={2}>
              <RHFTextField name="clientOfficeNo" label="Client Office no"  />
              <RHFTextField name="clientEmailid" label="Client Email No "  />
              <RHFTextField name="organizationName" label="Organization Name"  />
              </Stack>


              <Stack spacing={2} direction='row' m={2}>
              <RHFTextField name="validity" label="Validity"  />
              <RHFTextField name="opDt" label="Op Dt "  />
              <RHFTextField name="napixUserId" label="Napix User Id"  />
              </Stack>


              <Stack spacing={2} direction='row' m={2} >
              <RHFTextField name="napixUserIdCreatedOn" label="Napix User Id created on"  />
              <RHFTextField name="auditCertificateValidUpto" label="Audit Certificate Valid Upto"  />
              </Stack>

              <Stack spacing={2} direction='row' m={2}>
              <RHFCheckbox name='status' label="Status" />
              <RHFCheckbox name='encryption' label="Encryption" />
              <RHFCheckbox name='isNapixRequired' label="iS Napix Required" />

              </Stack>
          </Card>
        </Grid>
      </Grid>
      <LoadingButton
                fullWidth
                type="submit"
                variant="contained"
                size="large"
              >
                Create Client Master
              </LoadingButton>
     
    </FormProvider>
      </Container>
    </>
  );
}
