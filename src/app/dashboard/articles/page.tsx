"use client";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid2,
  Menu,
  MenuItem,
  Pagination,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Article, ArticleApiResponse } from "../../../../interface/article";
import {
  useDeleteArticleMutation,
  useGetAllArticlesQuery,
} from "../../../../redux/services/articles";
import { useSnackbar } from "notistack";
import { Edit } from "@mui/icons-material";
const Page = () => {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [deleteArticle] = useDeleteArticleMutation();
  const { data, isLoading, isError } = useGetAllArticlesQuery({
    page,
    limit: 6,
  });
  const [filter, setFilter] = useState("All");
  const [articleId, setArticleId] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const articlesResponse: ArticleApiResponse = data || {
    message: "",
    articles: [],
    meta: {
      total: 0,
      page: 1,
      lastPage: 1,
      hasNextPage: false,
      hasPreviousPage: false,
    },
  };

  const handleCreateArticle = () => {
    router.push("/dashboard/create-article"); // Navigate to the article creation page
  };

  const handleDeleteButtonClick = (articleId: number) => {
    setOpen(true);
    setArticleId(articleId);
  };
  const handleDeleteArticle = async () => {
    console.log("Delete article with id: ", articleId);
    if (articleId === null) {
      enqueueSnackbar("Invalid article ID", { variant: "error" });
      return;
    }
    try {
      await deleteArticle(articleId).unwrap();
      enqueueSnackbar("Article deleted successfully", { variant: "success" });
    } catch (error) {
      console.log(error);
      enqueueSnackbar("Error deleting article", { variant: "error" });
    }
  };

  const filteredArticles = articlesResponse?.articles.filter(
    (article: Article) => filter === "All" || article.status === filter
  );

  // const handleCardClick = (articleId: number) => {
  //   router.push(`/dashboard/${articleId}/preview`); // Navigate to the preview page for the article
  // };

  const isMdDown = useMediaQuery((theme) => theme.breakpoints.down("md"));

  // Add menu handlers

  const handleFilterClose = () => {
    setAnchorEl(null);
  };

  // Add pagination handler
  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading articles.</div>;
  }

  return (
    <>
      <Box sx={{ padding: 3 }}>
        <Grid2 container spacing={2}>
          {/* Header Section */}
          <Grid2 size={{ xs: 12, md: 6 }}>
            <Typography variant="h4">समाचार व्यवस्थापन ड्यासबोर्ड</Typography>
          </Grid2>
          <Grid2
            size={{ xs: 12, md: 6 }}
            textAlign={isMdDown ? "start" : "end"}
          >
            {/* <IconButton
            color="primary"
            onClick={handleFilterClick}
            sx={{ mr: 1 }}
          >
            <FilterListIcon />
          </IconButton> */}
            <Button
              variant="contained"
              color="warning"
              startIcon={<AddCircleIcon />}
              onClick={handleCreateArticle}
            >
              नयाँ थप्नुहोस्
            </Button>

            {/* Filter Menu */}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleFilterClose}
            >
              <MenuItem
                onClick={() => {
                  setFilter("All");
                  handleFilterClose();
                }}
                selected={filter === "All"}
              >
                All
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setFilter("draft");
                  handleFilterClose();
                }}
                selected={filter === "draft"}
              >
                Draft
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setFilter("published");
                  handleFilterClose();
                }}
                selected={filter === "published"}
              >
                Published
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setFilter("archived");
                  handleFilterClose();
                }}
                selected={filter === "archived"}
              >
                Archived
              </MenuItem>
            </Menu>
          </Grid2>

          {/* Article List */}
          <Grid2 size={{ xs: 12 }}>
            <Grid2 container spacing={2} justifyContent="center">
              <Grid2 size={{ xs: 12 }}>
                <Typography variant="h6">
                  {filteredArticles.length
                    ? `कुल ${filteredArticles.length} समाचार देखाउँदै `
                    : "कुनै समाचार फेला परेन"}
                </Typography>
              </Grid2>
              {filteredArticles.length > 0 &&
                filteredArticles.map((article: Article) => (
                  <Grid2 key={article.id}>
                    <img
                      src={article.image}
                      alt={article.title}
                      style={{
                        height: 200,
                        width: 345,
                        objectFit: "contain",
                      }}
                    />
                    {/* <Image
                    src={article.image}
                    title={article.title}
                    alt={article.title}
                    width={345}
                    height={200}
                    style={{
                      objectFit: "contain",
                    }}
                  /> */}
                    <Card
                      sx={{
                        maxWidth: 345,
                        height: 300, // Fixed height for the card
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      {/* <CardMedia sx={{ height: 200 }}>
                      {article.image ? (
                        <Image
                          src={decodeURIComponent(article.image)}
                          title={article.title}
                          alt={article.title}
                          width={345}
                          height={200}
                          style={{
                            objectFit: "contain",
                          }}
                          crossOrigin="anonymous"
                        />
                      ) : (
                        <Image
                          src="/fallback.png"
                          title={article.title}
                          alt="Fallback image"
                          width={345}
                          height={200}
                        />
                      )}
                    </CardMedia>
                    */}
                      <CardContent sx={{ flexGrow: 1 }}>
                        {/* Ellipsis Title */}
                        <Typography
                          gutterBottom
                          variant="h6"
                          component="div"
                          sx={{
                            display: "-webkit-box",
                            overflow: "hidden",
                            WebkitBoxOrient: "vertical",
                            WebkitLineClamp: 2, // Limit title to 2 lines
                            textOverflow: "ellipsis",
                          }}
                        >
                          {article.title}
                        </Typography>
                        <Chip
                          label={article.category.name}
                          color="warning"
                          sx={{ marginBottom: 2 }}
                        />
                        <Typography
                          variant="body2"
                          sx={{ color: "text.secondary" }}
                        >
                          स्लग: {article.slug}
                        </Typography>
                        <Stack
                          direction="row"
                          spacing={1}
                          sx={{ mt: 1 }}
                          justifyContent={"space-between"}
                        >
                          <Typography
                            variant="body2"
                            sx={{ color: "text.secondary" }}
                          >
                            हेराइ संख्या: {article.viewCount}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ color: "text.secondary" }}
                          >
                            सिर्जना गरिएको मिति:{" "}
                            {
                              new Date(article.createdAt)
                                .toISOString()
                                .split("T")[0]
                            }
                          </Typography>
                        </Stack>
                      </CardContent>

                      {/* Card Actions with buttons for changing status */}
                      <CardActions sx={{ justifyContent: "space-between" }}>
                        <Button
                          size="small"
                          color="error"
                          variant="outlined"
                          onClick={() => handleDeleteButtonClick(article.id)}
                          startIcon={
                            <DeleteForeverIcon sx={{ color: "red" }} />
                          }
                        >
                          हटाउनुहोस्
                        </Button>

                        <Button
                          size="small"
                          color="secondary"
                          variant="outlined"
                          onClick={() =>
                            router.push(`/dashboard/edit-article/${article.id}`)
                          }
                          startIcon={<Edit />}
                        >
                          सम्पादन गर्नुहोस्
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid2>
                ))}
            </Grid2>
          </Grid2>

          {/* Add Pagination */}
          <Grid2
            size={{ xs: 12 }}
            sx={{ mt: 4, display: "flex", justifyContent: "center" }}
          >
            <Pagination
              count={articlesResponse?.meta.lastPage || 1}
              page={page}
              onChange={handlePageChange}
              sx={{
                color: "red",
              }}
            />
          </Grid2>
        </Grid2>
      </Box>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          के तपाईं पक्का हुनुहुन्छ कि तपाईं यो समाचार हटाउन चाहनुहुन्छ?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            यो कार्य पूर्ववत गर्न सकिँदैन। समाचार मेटाएपछि, यो स्थायी रूपमा
            हराउँछ र पुन: प्राप्त गर्न सकिँदैन।
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            color="info"
            onClick={() => setOpen(false)}
          >
            रद्द गर्नुहोस्
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteArticle}
            autoFocus
          >
            हटाउनुहोस्
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Page;
