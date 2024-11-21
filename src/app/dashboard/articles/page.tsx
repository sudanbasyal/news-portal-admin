"use client";
import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Stack,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CardMedia,
  Chip,
  CardActions,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useRouter } from "next/navigation";
import {
  useChangeArticleStatusMutation,
  useGetAllArticlesQuery,
} from "../../../../redux/services/articles";
import { Article } from "../../../../interface/article";
import Image from "next/image";

const Page = () => {
  const router = useRouter();
  const { data, isLoading, isError } = useGetAllArticlesQuery();
  const [updateStatus] = useChangeArticleStatusMutation();
  const [filter, setFilter] = useState("All");
  const articles: Article[] = data?.data || [];

  const handleCreateArticle = () => {
    router.push("/dashboard/create-article"); // Navigate to the article creation page
  };

  const handleStatusChange = (event: any) => {
    setFilter(event.target.value);
  };

  const handleUpdateStatus = (articleId: number, newStatus: string) => {
    // Logic to update article status in the backend (via API)
    console.log(`Article ID: ${articleId} status changed to ${newStatus}`);
    // Example: dispatch an action to update status in the store or send an API request
  };

  const filteredArticles = articles.filter(
    (article: Article) => filter === "All" || article.status === filter
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading articles.</div>;
  }

  return (
    <Box sx={{ padding: 3 }}>
      {/* Header Section */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
      >
        <Typography variant="h4">Articles Dashboard</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddCircleIcon />}
          onClick={handleCreateArticle}
        >
          Create New Article
        </Button>
      </Stack>

      {/* Filter Section */}
      <Box sx={{ marginTop: 3, marginBottom: 2 }}>
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
      </Box>

      {/* Article List */}
      <Stack
        direction="row"
        spacing={2}
        sx={{
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {filteredArticles.length &&
          filteredArticles.map((article) => (
            <Card sx={{ maxWidth: 345 }} key={article.id}>
              <CardMedia sx={{ height: 200 }}>
                {/* Check if the image URL is valid */}
                {article.image ? (
                  <Image
                    src={article.image} // Dynamic image source
                    title={article.title}
                    alt={article.title}
                    width={345}
                    height={200}
                  />
                ) : (
                  <Image
                    src="/fallback.png" // Provide a fallback image if none is available
                    title={article.title}
                    alt="Fallback image"
                    width={345}
                    height={200}
                  />
                )}
              </CardMedia>
              <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                  {article.title}
                </Typography>
                <Chip
                  label={article.category.name}
                  color="primary"
                  sx={{ marginBottom: 2 }}
                />
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Slug: {article.slug}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Views: {article.viewCount}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Status: {article.status}
                </Typography>
              </CardContent>

              {/* Card Actions with buttons for changing status */}
              <CardActions sx={{ justifyContent: "space-between" }}>
                {/* Draft Button: Only enabled if status is Draft */}
                {article.status === "draft" && (
                  <Button
                    size="small"
                    color="primary"
                    onClick={() => handleUpdateStatus(article.id, "published")}
                  >
                    Publish
                  </Button>
                )}

                {/* Published Button: Only enabled if status is Published */}
                {article.status === "published" && (
                  <Button
                    size="small"
                    color="primary"
                    onClick={() => handleUpdateStatus(article.id, "archived")}
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
          ))}
      </Stack>
    </Box>
  );
};

export default Page;
