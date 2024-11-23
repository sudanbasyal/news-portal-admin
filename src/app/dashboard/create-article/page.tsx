"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Typography,
  FormHelperText,
} from "@mui/material";
import { useGetCategoriesQuery } from "../../../../redux/services/categories";
import { Category } from "../../../../interface/category";
import { useCreateArticleMutation } from "../../../../redux/services/articles";
import { useSnackbar } from "notistack";
import { useDropzone } from "react-dropzone";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const validationSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  content: Yup.string().required("Content is required"),
  slug: Yup.string().required("Slug is required"),
  isBreaking: Yup.number().required("Breaking news status is required"),
  categoryId: Yup.number().required("Category is required"),
  image: Yup.mixed()
    .required("Image file is required")
    .test("fileType", "Unsupported File Format", (value: any) => {
      return (
        value &&
        ["image/jpg", "image/jpeg", "image/png", "image/svg+xml"].includes(
          (value as File).type
        )
      );
    }),
});

const ArticleForm = () => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { data, isLoading } = useGetCategoriesQuery();
  const [createArticle, { isSuccess, isError }] = useCreateArticleMutation();
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const categories: Category[] = data?.data || [];

  const handleSubmit = async (values: any) => {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("image", values.image); // Add the uploaded image file
    formData.append("content", values.content);
    formData.append("slug", values.slug);
    formData.append("isBreaking", values.isBreaking.toString());
    formData.append("categoryId", values.categoryId.toString());

    try {
      await createArticle(formData).unwrap();
      enqueueSnackbar("Article created successfully", { variant: "success" });
      router.push("/dashboard/articles");
    } catch (err) {
      enqueueSnackbar("Failed to create article", { variant: "error" });
      console.error("Error creating article:", err);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      enqueueSnackbar("Article created successfully", { variant: "success" });
    }
    if (isError) {
      enqueueSnackbar("Failed to create article", { variant: "error" });
    }
  }, [isSuccess, isError]);

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Create New Article
      </Typography>

      <Formik
        initialValues={{
          title: "",
          image: null, // Set the initial value for the image field
          content: "",
          slug: "",
          isBreaking: 0,
          categoryId: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue, values, touched, errors }) => {
          // Configure dropzone
          const { getRootProps, getInputProps } = useDropzone({
            onDrop: (acceptedFiles) => {
              const file = acceptedFiles[0];
              if (file) {
                setFieldValue("image", file); // Update Formik's image field
                setImageFile(file); // Update the local state
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
            <Form>
              <Stack spacing={2}>
                <TextField
                  label="Title"
                  name="title"
                  value={values.title}
                  onChange={(e) => setFieldValue("title", e.target.value)}
                  error={touched.title && Boolean(errors.title)}
                  helperText={touched.title && errors.title}
                  fullWidth
                  required
                />

                {/* Image Upload Field */}
                <Box
                  {...getRootProps()}
                  sx={{
                    border: "2px dashed #1976d2",
                    padding: 2,
                    borderRadius: 2,
                    cursor: "pointer",
                    textAlign: "center",
                  }}
                >
                  <input {...getInputProps()} />
                  {imageFile ? (
                    <Typography variant="body1" color="textSecondary">
                      {imageFile.name} - {Math.round(imageFile.size / 1024)} KB
                    </Typography>
                  ) : (
                    <Stack spacing={1} alignItems="center">
                      <CloudUploadIcon color="primary" />
                      <Typography variant="body2" color="textSecondary">
                        Drag & drop an image or click to select one
                      </Typography>
                    </Stack>
                  )}
                  {touched.image && errors.image && (
                    <Typography variant="body2" color="error">
                      {errors.image}
                    </Typography>
                  )}
                </Box>

                <TextField
                  label="Content"
                  name="content"
                  value={values.content}
                  onChange={(e) => setFieldValue("content", e.target.value)}
                  error={touched.content && Boolean(errors.content)}
                  helperText={touched.content && errors.content}
                  fullWidth
                  multiline
                  rows={10}
                  required
                />

                <TextField
                  label="Slug"
                  name="slug"
                  value={values.slug}
                  onChange={(e) => setFieldValue("slug", e.target.value)}
                  error={touched.slug && Boolean(errors.slug)}
                  helperText={touched.slug && errors.slug}
                  fullWidth
                  required
                />

                <FormControl fullWidth required>
                  <InputLabel>Breaking News</InputLabel>
                  <Select
                    label="Breaking News"
                    name="isBreaking"
                    value={values.isBreaking}
                    onChange={(e) => {
                      setFieldValue("isBreaking", e.target.value);
                    }}
                  >
                    <MenuItem value={1}>Yes</MenuItem>
                    <MenuItem value={0}>No</MenuItem>
                  </Select>
                </FormControl>

                <FormControl
                  fullWidth
                  error={touched.categoryId && Boolean(errors.categoryId)}
                  required
                >
                  <InputLabel>Category</InputLabel>
                  <Select
                    label="Category"
                    name="categoryId"
                    value={values.categoryId}
                    onChange={(e) =>
                      setFieldValue("categoryId", e.target.value)
                    }
                  >
                    {categories?.map((category: Category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {touched.categoryId && errors.categoryId && (
                    <FormHelperText>{errors.categoryId}</FormHelperText>
                  )}
                </FormControl>

                <Box
                  sx={{
                    marginTop: 2,
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Button type="submit" variant="contained" color="primary">
                    Create Article
                  </Button>
                </Box>
              </Stack>
            </Form>
          );
        }}
      </Formik>
    </Box>
  );
};

export default ArticleForm;
