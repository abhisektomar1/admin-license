


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

  RHFTextField,

} from '../../components/hook-form';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { DB } from 'src/auth/FirebaseContext';
import { addDoc, collection,} from "firebase/firestore";




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
    title: '',
    key:''
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
      
      await addDoc(collection(DB,"category"), {
        // ...data,
        title :data.title,
        key:data.title.replace(/\s/g,'-')
        
      
      }).then(()=>{
        reset();
        enqueueSnackbar('Cases create success!');
      }).catch((e)=>{
        console.log(e);
        enqueueSnackbar('Cases can"t create success!',{ variant:"error" });
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
        <title> Category| UrgentER</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Create a new Category"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Category',
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
            <Stack spacing={3}>
              <RHFTextField name="title" label="Category Title" required />
            </Stack>
          </Card>
        </Grid>
      </Grid>
      <LoadingButton
                fullWidth
                type="submit"
                variant="contained"
                size="large"
                loading={isSubmitting}
              >
                Create Category
              </LoadingButton>
     
    </FormProvider>
        {/* <BlogNewPostForm /> */}
      </Container>
    </>
  );
}
