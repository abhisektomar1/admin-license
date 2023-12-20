


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

  const onSubmit = async (data: any) => {
    console.log(data);
    
    try {
      
      await addDoc(collection(DB,"ipMaster"), {
         ...data,
      }).then(()=>{
        reset();
        enqueueSnackbar('ip master success!');
      }).catch((e)=>{
        console.log(e);
        enqueueSnackbar('ip Master can"t create success!',{ variant:"error" });
      }).finally(()=>{
        navigate(PATH_DASHBOARD.ipMaster.list)
      });      
    } catch (error) {
      console.error(error);
   }
  };


  return (
    <>
      <Helmet>
        <title> ip Master</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Create a new ip Master"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'ip Master',
              href: PATH_DASHBOARD.ipMaster.list,
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
              <RHFTextField name="testServerIp4" label="Test Server Ip4"  />
              </Stack>


              <Stack spacing={2} direction='row' m={2}>
              <RHFTextField name="testServerIp6" label="Test Server Ip6"  />
              <RHFTextField name="stageServerIp4" label="Stage Server Ip4"  />
              <RHFTextField name="stageServerIp6" label="Stage Server Ip6"  />
              </Stack>

              <Stack spacing={2} direction='row' m={2}>
              <RHFTextField name="prodServerIp4" label="Prod Server Ip4"  />
              <RHFTextField name="prodServerIp6" label="Prod Server Ip6"  />
             
              </Stack>


              <Stack spacing={2} direction='row' m={2}>
              <RHFCheckbox name='testServerstatus' label="Test Sever Status" />
              <RHFCheckbox name='stageServerStatus' label="tage Sever Status" />
              <RHFCheckbox name='prodServerStatus' label="Prod Sever Status" />

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
                Create ip Master
              </LoadingButton>
     
    </FormProvider>
      </Container>
    </>
  );
}
