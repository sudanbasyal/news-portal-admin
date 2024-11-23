"use client";
import AddCircleIcon from "@mui/icons-material/AddCircle";
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
} from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Article } from "../../../../interface/article";
import { useGetAllArticlesQuery } from "../../../../redux/services/articles";

const Page = () => {
  const router = useRouter();
  const { data, isLoading, isError } = useGetAllArticlesQuery();
  const [filter, setFilter] = useState("All");
  const articles: Article[] = data?.data || [];

  const handleCreateArticle = () => {
    router.push("/dashboard/create-article"); // Navigate to the article creation page
  };

  const handleStatusChange = (event: SelectChangeEvent<string>) => {
    setFilter(event.target.value);
  };

  const handleUpdateStatus = (articleId: number, newStatus: string) => {
    console.log(`Article ID: ${articleId} status changed to ${newStatus}`);
  };

  const filteredArticles = articles.filter(
    (article: Article) => filter === "All" || article.status === filter
  );

  // const handleCardClick = (articleId: number) => {
  //   router.push(`/dashboard/${articleId}/preview`); // Navigate to the preview page for the article
  // };

  const isMdDown = useMediaQuery((theme) => theme.breakpoints.down("md"));
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
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddCircleIcon />}
            onClick={handleCreateArticle}
          >
            Add New
          </Button>
        </Grid2>
        <Grid2 size={{ xs: 12 }}>
          <FormControl fullWidth>
            <InputLabel>Filter by Status</InputLabel>
            <Select
              value={filter}
              onChange={handleStatusChange}
              label="Filter by Status"
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="draft">Draft</MenuItem>
              <MenuItem value="published">Published</MenuItem>
              <MenuItem value="archived">Archived</MenuItem>
            </Select>
          </FormControl>
        </Grid2>

        {/* Filter Section */}

        {/* Article List */}
        <Grid2 size={{ xs: 12 }}>
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12 }}>
              <Typography variant="h6">
                {filteredArticles.length
                  ? `Showing ${filteredArticles.length} articles`
                  : "No articles found"}
              </Typography>
            </Grid2>
            {filteredArticles.length > 0 &&
              filteredArticles.map((article) => (
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
                        color="primary"
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
                      {article.status === "draft" && (
                        <Button
                          size="small"
                          color="primary"
                          onClick={() =>
                            handleUpdateStatus(article.id, "published")
                          }
                        >
                          Publish
                        </Button>
                      )}

                      {article.status === "published" && (
                        <Button
                          size="small"
                          color="primary"
                          onClick={() =>
                            handleUpdateStatus(article.id, "archived")
                          }
                        >
                          Archive
                        </Button>
                      )}

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
      </Grid2>
    </Box>
  );
};

export default Page;
