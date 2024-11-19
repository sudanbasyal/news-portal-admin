"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Formik, Field, Form } from "formik";
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
  IconButton,
} from "@mui/material";
import { useGetCategoriesQuery } from "../../../../redux/services/categories";
import { Category } from "../../../../interface/category";
import { useCreateArticleMutation } from "../../../../redux/services/articles";
import { useSnackbar } from "notistack";
import { useDropzone } from "react-dropzone"; // Import react-dropzone
import CloudUploadIcon from "@mui/icons-material/CloudUpload"; // Material UI icon for upload

// Validation Schema using Yup
const validationSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  image: Yup.string().required("Image URL is required"),
  content: Yup.string().required("Content is required"),
  slug: Yup.string().required("Slug is required"),
  isBreaking: Yup.number().required("Breaking news status is required"),
  categoryId: Yup.number().required("Category is required"),
});

const ArticleForm = () => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { data, isLoading } = useGetCategoriesQuery();
  const [createArticle, { isSuccess, isError, error }] =
    useCreateArticleMutation();
  const [selectedCategory, setSelectedCategory] = useState<number>(0);
  const [imageFile, setImageFile] = useState<File | null>(null); // State to hold the uploaded image file

  const categories: Category[] = data?.data || [];

  useEffect(() => {
    if (categories && categories.length > 0) {
      setSelectedCategory(categories[0]?.id); // Set default category if categories are loaded
    }
  }, [categories]);

  const handleSubmit = async (values: any) => {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("image", imageFile || values.image); // Add the uploaded image file
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

  // Handling the drag-and-drop feature using react-dropzone
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      setImageFile(acceptedFiles[0]); // Store the uploaded file in state
    },
    accept: {
      "image/png": [".png"],
      "text/html": [".html", ".htm"],
    },
    maxFiles: 1, // Only accept one file
  });

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Create New Article
      </Typography>

      <Formik
        initialValues={{
          title: "",
          image: "",
          content: "",
          slug: "",
          isBreaking: false,
          categoryId: selectedCategory,
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue, values, touched, errors }) => (
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

              {/* Image Upload Field (Drag and Drop) */}
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
              </Box>

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
                  onChange={(e) => setFieldValue("isBreaking", e.target.value)}
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
                  onChange={(e) => setFieldValue("categoryId", e.target.value)}
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
                sx={{ marginTop: 2, display: "flex", justifyContent: "center" }}
              >
                <Button type="submit" variant="contained" color="primary">
                  Create Article
                </Button>
              </Box>
            </Stack>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default ArticleForm;
