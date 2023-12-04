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

  const [categoryList] = useCollection(
      collection(getFirestore(), "category"),
      {
          snapshotListenOptions: { includeMetadataChanges: true },
      }
  );

  const [category, setcategory] = useState([]);

  useEffect(() => {
      const tempData : any = [];
      if (categoryList) {
          categoryList?.forEach((doc) => {
              const childData = doc.data();
              tempData.push(childData.title);
          });
          setcategory(tempData);
      }
  }, [categoryList]);  
  
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();
  const [selectedCategory, setSelectedCategory] = useState('')
  const [date, setDate] = useState<Dayjs | null>(
    // dayjs(),
  );
  const selectedDate = dayjs(date).format('YYYY-MM-DD HH:MM');

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
    description: '',
    body: '',
    coverPage: undefined,
    status: true,
    thumbnail: undefined,
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

  function uploadFile(file:any, type:any) {
    const metadata = {
      contentType: 'image/jpeg',
    };    
    const storage = getStorage();
    const fileName = `document-${type}-${new Date().getTime()}`;
    const storageRef = ref(storage,`/case/${fileName}`);
    const uploadFile = uploadBytesResumable(storageRef, file, metadata);
    return new Promise((resolve, reject) => {
      uploadFile.on(
        "state_changed",
        (snapshot : any) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          // console.log("Upload is " + progress + "% done");
        },
        (error: any) => {
          console.log(error);
          reject();
        },
        () => {
          getDownloadURL(uploadFile.snapshot.ref).then((downloadURL : any) => {
            resolve(downloadURL);
          });
        }
      );
    });
  }

  const onSubmit = async (data: FormValuesProps) => {
    try {
      const thumb = await uploadFile(data.coverPage,"thumb")
      const cover = await uploadFile(data.thumbnail,"thumb")      
      await addDoc(collection(DB,"cases"), {
        ...data,
        caseNo: 1,
        category:selectedCategory,
        thumbnail:thumb,
        coverPage:cover,
        date: dayjs(selectedDate).valueOf(),
        createdAt : serverTimestamp(),
      }).then(()=>{
        reset();
        enqueueSnackbar('Cases create success!');
      }).catch((e)=>{
        console.log(e);
        enqueueSnackbar('Cases can"t create success!',{ variant:"error" });
      }).finally(()=>{
        navigate(PATH_DASHBOARD.cases.list)
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
              <Grid item md={9}>
                <div>
                  <LabelStyle>Content</LabelStyle>
                  <RHFEditor simple name="body" />
                </div>
              </Grid>
              <Grid item md={3}>
                <LabelStyle>Case Date</LabelStyle>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    disablePast
                    renderInput={(props) => <TextField {...props} name="date" />}
                    value={date}
                    onChange={(newValue) => {
                      setDate(newValue);
                    }}
                  />
                </LocalizationProvider>
                <Stack mt={2}>
                  <label htmlFor="">Select Category</label>
                  <Select
                    name='category'
                    required
                    label='category'
                    value={selectedCategory}
                    onChange={((e)=>{ setSelectedCategory(e.target.value)})}
                    >
                      {category.map((option,index)=>{
                        return (
                          <MenuItem key={index} value={option}>
                          {option}
                          </MenuItem>
                        )
                      })}
                  </Select>
                  {/* <RHFAutocomplete
                    name="category"
                    label="category"
                    freeSolo
                    options={category.map((option) => option)}
                    ChipProps={{ size: 'small' }}
                  /> */}
                </Stack>
                {/* <Stack mt={2}>
                  <Card elevation={10} sx={{ borderRadius: 1, p: 1 }}>
                    <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                      Cover Page
                    </Typography>
                    <input type="file" name='coverPage' required onChange={(e) => {
                      setValue('coverPage', e.target?.files?.[0])
                    }} />
                  </Card>
                  <Card elevation={10} sx={{ borderRadius: 1, p: 1, mt: 1 }}>

                    <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                      Thumbnail
                    </Typography>
                    <input type="file" required name='thumbnail' onChange={(e) => {
                      setValue('thumbnail', e.target?.files?.[0])
                    }} />
                  </Card>
                </Stack> */}
                <Stack mt={2}>
                  <RHFSwitch
                    name="status"
                    label="Publish"
                    labelPlacement="start"
                    sx={{ mb: 1, mx: 0, width: 1, justifyContent: 'space-between' }}
                  />
                </Stack>
              </Grid>
            </Grid>
            <Stack direction="row" spacing={1.5} sx={{ mt: 3 }}>
              {/* <Button
                fullWidth
                color="inherit"
                variant="outlined"
                size="large"
                onClick={handleOpenPreview}
              >
                Preview
              </Button> */}
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
