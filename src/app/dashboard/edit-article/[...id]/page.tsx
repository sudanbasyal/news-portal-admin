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
import { Form, Formik } from "formik";
import { useParams, useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import * as Yup from "yup";
import { Category } from "../../../../../interface/category";
import {
  useGetArticleByIdQuery,
  useUpdateArticleMutation,
} from "../../../../../redux/services/articles";
import { useGetCategoriesQuery } from "../../../../../redux/services/categories";

const validationSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  image: Yup.mixed().test(
    "fileRequired",
    "Image is required",
    function (value) {
      const { updateImage } = this.parent; // Access other field values
      if (updateImage && !value) {
        return false; // If updateImage is true, file must be provided
      }
      return true;
    }
  ),
  content: Yup.string().required("Content is required"),
  slug: Yup.string().required("Slug is required"),
  isBreaking: Yup.number().required("Breaking news status is required"),
  categoryId: Yup.number().required("Category is required"),
});

function page() {
  const params = useParams();
  const id = params.id;
  const { data: article } = useGetArticleByIdQuery(id[0], {
    skip: id.length === 0,
  });
  const articleData = article?.data;
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { data, isLoading } = useGetCategoriesQuery();

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [updateArticle, { error, isError }] = useUpdateArticleMutation();
  const categories: Category[] = data?.data || [];

  const handleSubmit = async (values: any) => {
    const formData = new FormData();
    formData.append("title", values.title);
    if (values.updateImage) {
      formData.append("image", imageFile || values.image);
    }
    formData.append("content", values.content);
    formData.append("slug", values.slug);
    formData.append("isBreaking", values.isBreaking.toString());
    formData.append("categoryId", values.categoryId.toString());

    try {
      await updateArticle({ id: id[0], articleData: formData }).unwrap();
      enqueueSnackbar("Article created successfully", { variant: "success" });
      router.push("/dashboard/articles");
    } catch (err) {
      enqueueSnackbar("Failed to create article", { variant: "error" });
      console.error("Error creating article:", err);
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Update Article
      </Typography>

      <Formik
        initialValues={{
          title: articleData?.title || "",
          image: "",
          content: articleData?.content || "",
          slug: articleData?.slug || "",
          isBreaking: articleData?.isBreaking ? 1 : 0,
          updateImage: false,
          categoryId: articleData?.categoryId || "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize={true}
      >
        {({ setFieldValue, values, touched, errors }) => {
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
                {/* Title Field */}
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

                {/* Checkbox: Update Image */}
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={values.updateImage}
                      onChange={(e) => {
                        setFieldValue("updateImage", e.target.checked);
                      }}
                    />
                  }
                  label="Update Image"
                />

                {/* Conditionally Render Dropzone */}
                {values.updateImage && (
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
                        {imageFile.name} - {Math.round(imageFile.size / 1024)}{" "}
                        KB
                      </Typography>
                    ) : (
                      <Stack spacing={1} alignItems="center">
                        <CloudUploadIcon color="primary" />
                        <Typography variant="body2" color="textSecondary">
                          Drag & drop an image or click to select one
                        </Typography>
                        {
                          //show error message if file type is not supported
                          touched.image && errors.image && (
                            <Stack spacing={1} alignItems="center">
                              <Typography variant="body2" color="error">
                                {errors.image}
                              </Typography>
                            </Stack>
                          )
                        }
                      </Stack>
                    )}
                  </Box>
                )}

                {/* Content Field */}
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

                {/* Slug Field */}
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

                {/* Is Breaking Field */}
                <FormControl fullWidth required>
                  <InputLabel>Breaking News</InputLabel>
                  <Select
                    label="Breaking News"
                    name="isBreaking"
                    value={values.isBreaking}
                    onChange={(e) =>
                      setFieldValue("isBreaking", e.target.value)
                    }
                  >
                    <MenuItem value={1}>Yes</MenuItem>
                    <MenuItem value={0}>No</MenuItem>
                  </Select>
                </FormControl>

                {/* Category Field */}
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

                {/* Submit Button */}
                <Box
                  sx={{
                    marginTop: 2,
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Button type="submit" variant="contained" color="primary">
                    Update Article
                  </Button>
                </Box>
              </Stack>
            </Form>
          );
        }}
      </Formik>
    </Box>
  );
}

export default page;
