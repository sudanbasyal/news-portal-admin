"use client";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import FilterListIcon from "@mui/icons-material/FilterList";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  FormControl,
  Grid2,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  SelectChangeEvent,
  useMediaQuery,
  IconButton,
  Menu,
  Pagination,
} from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArticleApiResponse, Article } from "../../../../interface/article";
import { useGetAllArticlesQuery } from "../../../../redux/services/articles";

const Page = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { data, isLoading, isError } = useGetAllArticlesQuery({
    page,
    limit: 6,
  });
  const [filter, setFilter] = useState("All");
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

  const handleStatusChange = (event: SelectChangeEvent<string>) => {
    setFilter(event.target.value);
  };

  const handleUpdateStatus = (articleId: number, newStatus: string) => {
    console.log(`Article ID: ${articleId} status changed to ${newStatus}`);
  };

  const filteredArticles = articlesResponse?.articles.filter(
    (article: Article) => filter === "All" || article.status === filter
  );

  // const handleCardClick = (articleId: number) => {
  //   router.push(`/dashboard/${articleId}/preview`); // Navigate to the preview page for the article
  // };

  const isMdDown = useMediaQuery((theme) => theme.breakpoints.down("md"));

  // Add menu handlers
  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
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
    <Box sx={{ padding: 3 }}>
      <Grid2 container spacing={2}>
        {/* Header Section */}
        <Grid2 size={{ xs: 12, md: 6 }}>
          <Typography variant="h4">Articles Dashboard</Typography>
        </Grid2>
        <Grid2 size={{ xs: 12, md: 6 }} textAlign={isMdDown ? "start" : "end"}>
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
            Add New
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
                  ? `Showing ${filteredArticles.length} articles`
                  : "No articles found"}
              </Typography>
            </Grid2>
            {filteredArticles.length > 0 &&
              filteredArticles.map((article: Article) => (
                <Grid2 key={article.id}>
                  <Card
                    sx={{
                      maxWidth: 345,
                      height: 500, // Fixed height for the card
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <CardMedia sx={{ height: 200 }}>
                      {article.image ? (
                        <Image
                          src={article.image}
                          title={article.title}
                          alt={article.title}
                          width={345}
                          height={200}
                          style={{
                            objectFit: "contain",
                          }}
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
                        Slug: {article.slug}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary" }}
                      >
                        Views: {article.viewCount}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary" }}
                      >
                        Status: {article.status}
                      </Typography>
                    </CardContent>

                    {/* Card Actions with buttons for changing status */}
                    <CardActions sx={{ justifyContent: "space-between" }}>
                      <Button
                        size="small"
                        color="warning"
                        variant="outlined"
                        onClick={() => console.log("preview")}
                      >
                        Preview
                      </Button>

                      <Button
                        size="small"
                        color="secondary"
                        variant="outlined"
                        onClick={() =>
                          router.push(`/dashboard/edit-article/${article.id}`)
                        }
                      >
                        Edit
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
  );
};

export default Page;
