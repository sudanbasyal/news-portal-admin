"use client";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import EditIcon from "@mui/icons-material/Edit";
import { Grid2, useMediaQuery } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRowId,
} from "@mui/x-data-grid";
import { useSnackbar } from "notistack";
import * as React from "react";
import { Category } from "../../../../interface/category";
import {
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
  useUpdateCategoryMutation,
} from "../../../../redux/services/categories";

export default function Page() {
  const { enqueueSnackbar } = useSnackbar();
  const { data } = useGetCategoriesQuery();
  const categories = data?.data || [];
  const [rows, setRows] = React.useState<Category[]>([]);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [newCategory, setNewCategory] = React.useState<Category | null>(null);
  const [createCategory] = useCreateCategoryMutation();
  const [editCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  // Open dialog for adding a new category
  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  // Open dialog for editing an existing category
  const handleEditClick = (row: Category) => () => {
    // console.log("Editing Row:", row); // Log the row being edited
    setNewCategory(row); // Set the row to the form
    setDialogOpen(true);
  };

  // Close dialog
  const handleCloseDialog = () => {
    setNewCategory(null); // Reset form
    setDialogOpen(false);
  };

  // Handle form submission
  const handleFormSubmit = async () => {
    if (newCategory) {
      if (newCategory.id === undefined) {
        try {
          await createCategory(newCategory);
          enqueueSnackbar("Category added successfully", {
            variant: "success",
          });
        } catch (error) {
          enqueueSnackbar("Failed to add category", { variant: "error" });
          console.error("Error adding category:", error);
        }
      } else {
        //edit existing category
        console.log("Category Updated:", newCategory);
        try {
          await editCategory({ name: newCategory.name, id: newCategory.id });
          enqueueSnackbar("Category updated successfully", {
            variant: "success",
          });
        } catch (error) {
          enqueueSnackbar("Failed to update category", { variant: "error" });
          console.error("Error updating category:", error);
        }
      }
    }
    handleCloseDialog(); // Close dialog after submission
  };

  const handleDeleteClick = (id: GridRowId) => async () => {
    // console.log(id);
    try {
      await deleteCategory(id as number);
      enqueueSnackbar("Category deleted successfully", { variant: "success" });
    } catch (error) {
      enqueueSnackbar("Failed to delete category", { variant: "error" });
      console.error("Error deleting category:", error);
    }
  };

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      width: 100,
      editable: false,
    },
    { field: "name", headerName: "Name", width: 150, editable: true },
    {
      field: "articleCount",
      headerName: "Number of articles",
      type: "number",
      width: 150,
      align: "left",
      headerAlign: "left",
      editable: false,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 150,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<EditIcon color="info" />}
          key={`edit-${params.id}`}
          label="Edit"
          onClick={handleEditClick(params.row as Category)} // Pass the row data to handleEditClick
        />,
        <GridActionsCellItem
          icon={<DeleteIcon color="error" />}
          key={`delete-${params.id}`}
          label="Delete"
          onClick={handleDeleteClick(params.id)}
        />,
      ],
    },
  ];

  const isMdDown = useMediaQuery((theme) => theme.breakpoints.down("md"));

  React.useEffect(() => {
    if (categories.length > 0) {
      setRows(categories);
    }
  }, [categories]);

  return (
    <Grid2
      container
      direction="column"
      sx={{
        ...(!isMdDown && { justifyContent: "center" }),
      }}
    >
      <Grid2 size={6}>
        <Button
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
          sx={{ marginBottom: 2 }}
        >
          Add New Category
        </Button>
      </Grid2>
      <Grid2 size={{ xs: 12, md: 6 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: { paginationModel: { page: 0, pageSize: 10 } },
          }}
          disableColumnSelector
          disableDensitySelector
        />
      </Grid2>
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>
          {newCategory?.id === undefined ? "Add New Category" : "Edit Category"}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Category Name"
            type="text"
            fullWidth
            variant="outlined"
            value={newCategory?.name || ""}
            onChange={(e) =>
              setNewCategory({ ...newCategory!, name: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleFormSubmit}
            color="primary"
            disabled={!newCategory?.name}
          >
            {newCategory?.id === 0 ? "Add" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </Grid2>
  );
}
