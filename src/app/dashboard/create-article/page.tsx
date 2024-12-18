"use client";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { useDropzone } from "react-dropzone";
import * as Yup from "yup";
import { Category } from "../../../../interface/category";
import { useCreateArticleMutation } from "../../../../redux/services/articles";
import { useGetCategoriesQuery } from "../../../../redux/services/categories";

const validationSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  content: Yup.string().required("Content is required"),
  slug: Yup.string().required("Slug is required"),
  isBreaking: Yup.number().required("Breaking news status is required"),
  categoryId: Yup.number().required("Category is required"),
  image: Yup.mixed<File>()
    .required("Image file is required")
    .test("fileType", "Unsupported File Format", (value) => {
      return (
        value instanceof File &&
        ["image/jpg", "image/jpeg", "image/png", "image/svg+xml"].includes(
          value.type
        )
      );
    }),
});

const ArticleForm = () => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { data } = useGetCategoriesQuery();
  const [createArticle] = useCreateArticleMutation();
  const categories: Category[] = data?.data || [];

  const formik = useFormik({
    initialValues: {
      title: "",
      image: null,
      content: "",
      slug: "",
      isBreaking: "",
      categoryId: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("title", values.title);
      if (values.image) {
        formData.append("image", values.image);
      }
      formData.append("content", values.content);
      formData.append("slug", values.slug);
      if (values.isBreaking !== null) {
        formData.append("isBreaking", values.isBreaking.toString());
      }
      formData.append("categoryId", values.categoryId.toString());

      try {
        await createArticle(formData).unwrap();
        enqueueSnackbar("Article created successfully", { variant: "success" });
        router.push("/dashboard/articles");
      } catch (err) {
        enqueueSnackbar("Failed to create article", { variant: "error" });
        console.error("Error creating article:", err);
      }
    },
  });

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        formik.setFieldValue("image", file); // Update Formik's image field
      }
    },
    accept: {
      "image/jpg": [".jpg"],
      "image/jpeg": [".jpeg"],
      "image/png": [".png"],
      "image/svg+xml": [".svg"],
    },
    maxFiles: 1,
  });

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        नयाँ समाचार सिर्जना गर्नुहोस्
      </Typography>

      <form onSubmit={formik.handleSubmit}>
        <Stack spacing={2}>
          <TextField
            label="शीर्षक"
            name="title"
            value={formik.values.title}
            onChange={formik.handleChange}
            error={formik.touched.title && Boolean(formik.errors.title)}
            helperText={formik.touched.title && formik.errors.title}
            fullWidth
            required
          />

          {/* Image Upload Field */}
          <Box
            {...getRootProps()}
            sx={{
              border: "2px dashed #F28627",
              padding: 2,
              borderRadius: 2,
              cursor: "pointer",
              textAlign: "center",
            }}
          >
            <input {...getInputProps()} />
            {formik.values.image ? (
              <Typography variant="body1" color="textSecondary">
                {(formik.values.image as File).name} -{" "}
                {Math.round((formik.values.image as File).size / 1024)} KB
              </Typography>
            ) : (
              <Stack spacing={1} alignItems="center">
                <CloudUploadIcon color="warning" />
                <Typography variant="body2" color="textSecondary">
                  Drag & drop an image or click to select one
                </Typography>
              </Stack>
            )}
            {formik.touched.image && formik.errors.image && (
              <Typography variant="body2" color="error">
                {formik.errors.image}
              </Typography>
            )}
          </Box>

          <TextField
            label="सामग्री"
            name="content"
            value={formik.values.content}
            onChange={formik.handleChange}
            error={formik.touched.content && Boolean(formik.errors.content)}
            helperText={formik.touched.content && formik.errors.content}
            fullWidth
            multiline
            rows={10}
            required
          />

          <TextField
            label="स्लग"
            name="slug"
            value={formik.values.slug}
            onChange={formik.handleChange}
            error={formik.touched.slug && Boolean(formik.errors.slug)}
            helperText={formik.touched.slug && formik.errors.slug}
            fullWidth
            required
          />

          {/* <FormControl fullWidth required>
            <InputLabel>Breaking News</InputLabel>
            <Select
              label="Breaking News"
              name="isBreaking"
              value={formik.values.isBreaking}
              onChange={(e) =>
                formik.setFieldValue("isBreaking", e.target.value)
              }
            >
              <MenuItem value={1}>Yes</MenuItem>
              <MenuItem value={0}>No</MenuItem>
            </Select>
          </FormControl> */}
          <FormControl fullWidth required>
            <FormControlLabel
              control={
                <Checkbox
                  checked={Boolean(formik.values.isBreaking)}
                  onChange={(e) =>
                    formik.setFieldValue("isBreaking", e.target.checked ? 1 : 0)
                  }
                  name="isBreaking"
                  color="warning"
                />
              }
              label="मुख्य समाचारको रूपमा चिन्हित गर्नुहोस्"
            />
            {formik.touched.isBreaking && formik.errors.isBreaking && (
              <FormHelperText error>{formik.errors.isBreaking}</FormHelperText>
            )}
          </FormControl>
          <FormControl
            fullWidth
            error={
              formik.touched.categoryId && Boolean(formik.errors.categoryId)
            }
            required
          >
            <InputLabel>वर्ग</InputLabel>
            <Select
              label="वर्ग"
              name="categoryId"
              value={formik.values.categoryId}
              onChange={(e) =>
                formik.setFieldValue("categoryId", e.target.value)
              }
            >
              {categories?.map((category: Category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
            {formik.touched.categoryId && formik.errors.categoryId && (
              <FormHelperText>{formik.errors.categoryId}</FormHelperText>
            )}
          </FormControl>

          <Box
            sx={{
              marginTop: 4,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Button
              type="submit"
              variant="contained"
              color="warning"
              sx={{
                height: "44px",
              }}
            >
              समाचार सिर्जना गर्नुहोस्
            </Button>
          </Box>
        </Stack>
      </form>
    </Box>
  );
};

export default ArticleForm;
