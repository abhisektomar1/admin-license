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
  RHFTextField
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
        
      await addDoc(collection(DB,"client"), {
       ...data
      }).then(()=>{
        reset();
        enqueueSnackbar('client create success!');
      }).catch((e)=>{
        console.log(e);
        enqueueSnackbar('Cases can"t create success!',{ variant:"error" });
      }).finally(()=>{
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
            <Stack spacing={3}>
              <RHFTextField name="title" label="Case Title" required />
              <RHFTextField name="description" label="Case Description" required multiline rows={7} />
            </Stack>
            <Grid container spacing={1} mt={2}>
             
          
            </Grid>
            <Stack direction="row" spacing={1.5} sx={{ mt: 3 }}>
            
              <LoadingButton
                fullWidth
                type="submit"
                variant="contained"
                size="large"
                loading={isSubmitting}
              >
                Post
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
