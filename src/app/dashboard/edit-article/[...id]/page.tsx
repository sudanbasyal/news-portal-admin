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
import { useParams, useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { useState } from "react";
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
      const { updateImage } = this.parent;
      if (updateImage && !value) return false;
      return true;
    }
  ),
  content: Yup.string().required("Content is required"),
  slug: Yup.string().required("Slug is required"),
  isBreaking: Yup.number().required("Breaking news status is required"),
  categoryId: Yup.number().required("Category is required"),
});

function Page() {
  const params = useParams();
  const id = params.id;
  const { data: article } = useGetArticleByIdQuery(id[0], {
    skip: id.length === 0,
  });
  const articleData = article?.data;
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { data } = useGetCategoriesQuery();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [updateArticle] = useUpdateArticleMutation();
  const categories: Category[] = data?.data || [];

  const formik = useFormik({
    initialValues: {
      title: articleData?.title || "",
      image: "",
      content: articleData?.content || "",
      slug: articleData?.slug || "",
      isBreaking: articleData?.isBreaking ? 1 : 0,
      updateImage: false,
      categoryId: articleData?.categoryId || "",
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
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
        enqueueSnackbar("Article updated successfully", { variant: "success" });
        router.push("/dashboard/articles");
      } catch (err) {
        enqueueSnackbar("Failed to update article", { variant: "error" });
        console.error("Error updating article:", err);
      }
    },
  });

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        formik.setFieldValue("image", file); // Update Formik's image field
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
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Update Article
      </Typography>
      <form onSubmit={formik.handleSubmit}>
        <Stack spacing={2}>
          {/* Title Field */}
          <TextField
            label="Title"
            name="title"
            value={formik.values.title}
            onChange={formik.handleChange}
            error={formik.touched.title && Boolean(formik.errors.title)}
            helperText={formik.touched.title && formik.errors.title}
            fullWidth
            required
          />

          {/* Checkbox: Update Image */}
          <FormControlLabel
            control={
              <Checkbox
                color="warning"
                checked={formik.values.updateImage}
                onChange={(e) =>
                  formik.setFieldValue("updateImage", e.target.checked)
                }
              />
            }
            label="Update Image"
          />

          {/* Conditionally Render Dropzone */}
          {formik.values.updateImage && (
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
              {imageFile ? (
                <Typography variant="body1" color="textSecondary">
                  {imageFile.name} - {Math.round(imageFile.size / 1024)} KB
                </Typography>
              ) : (
                <Stack spacing={1} alignItems="center">
                  <CloudUploadIcon color="warning" />
                  <Typography variant="body2" color="textSecondary">
                    Drag & drop an image or click to select one
                  </Typography>
                  {formik.touched.image && formik.errors.image && (
                    <Typography variant="body2" color="error">
                      {formik.errors.image}
                    </Typography>
                  )}
                </Stack>
              )}
            </Box>
          )}

          {/* Content Field */}
          <TextField
            label="Content"
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

          {/* Slug Field */}
          <TextField
            label="Slug"
            name="slug"
            value={formik.values.slug}
            onChange={formik.handleChange}
            error={formik.touched.slug && Boolean(formik.errors.slug)}
            helperText={formik.touched.slug && formik.errors.slug}
            fullWidth
            required
          />

          {/* Is Breaking Field */}
          <FormControl fullWidth required>
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
          </FormControl>

          <FormControl
            fullWidth
            error={
              formik.touched.categoryId && Boolean(formik.errors.categoryId)
            }
            required
          >
            <InputLabel>Category</InputLabel>
            <Select
              label="Category"
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

          {/* Submit Button */}
          <Box
            sx={{
              marginTop: 2,
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
              Update Article
            </Button>
          </Box>
        </Stack>
      </form>
    </Box>
  );
}

export default Page;
