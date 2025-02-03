import React, { useState } from "react";
import { TextField, Button, Box } from "@mui/material";
import axios from "axios";

const API_URL = "https://your-api-gateway-url.com/query"; // Update this with your actual API Gateway URL

const FormComponent = () => {
  const [formData, setFormData] = useState({
    movie_title: "",
    languages: "",
    country: "",
    genres: "",
    year: "",
    imdb_rating: "",
    google_rating: "",
  });

  const [generatedQuery, setGeneratedQuery] = useState("");
  const [apiResponse, setApiResponse] = useState("");

  // Handle input changes
  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  // Generate SQL Query
  const generateQuery = () => {
    let query = "SELECT * FROM movies WHERE 1=1";

    if (formData.movie_title) query += ` AND movie_title = '${formData.movie_title}'`;
    if (formData.languages) query += ` AND '${formData.languages}' = ANY(languages)`;
    if (formData.country) query += ` AND country = '${formData.country}'`;
    if (formData.genres) query += ` AND '${formData.genres}' = ANY(genres)`;
    if (formData.year) query += ` AND year = ${formData.year}`;
    if (formData.imdb_rating) query += ` AND imdb_rating > ${formData.imdb_rating}`;
    if (formData.google_rating) query += ` AND google_rating > ${formData.google_rating}`;

    setGeneratedQuery(query);

    // Send query to API
    sendQueryToAPI(query);
  };

  // Function to send query to FastAPI backend
  const sendQueryToAPI = async (query) => {
    try {
      const response = await axios.post(API_URL, {
        sql_query: query, // Sending the query as JSON payload
      });

      setApiResponse(response.data); // Save response from API
    } catch (error) {
      setApiResponse("Error fetching data.");
      console.error(error);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, margin: "auto", p: 2 }}>
      <h2>Movie Query Builder</h2>

      <TextField label="Movie Title" name="movie_title" fullWidth margin="normal" onChange={handleChange} />
      <TextField label="Language" name="languages" fullWidth margin="normal" onChange={handleChange} />
      <TextField label="Country" name="country" fullWidth margin="normal" onChange={handleChange} />
      <TextField label="Genre" name="genres" fullWidth margin="normal" onChange={handleChange} />
      <TextField label="Year" name="year" type="number" fullWidth margin="normal" onChange={handleChange} />
      <TextField label="IMDb Rating Greater Than" name="imdb_rating" type="number" step="0.1" fullWidth margin="normal" onChange={handleChange} />
      <TextField label="Google Rating Greater Than" name="google_rating" type="number" step="0.1" fullWidth margin="normal" onChange={handleChange} />

      <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={generateQuery}>
        Generate & Send Query
      </Button>

      {generatedQuery && (
        <Box sx={{ mt: 2, p: 2, bgcolor: "#f5f5f5", borderRadius: "5px" }}>
          <h3>Generated SQL Query:</h3>
          <code>{generatedQuery}</code>
        </Box>
      )}

      {apiResponse && (
        <Box sx={{ mt: 2, p: 2, bgcolor: "#e3f2fd", borderRadius: "5px" }}>
          <h3>API Response:</h3>
          <pre>{JSON.stringify(apiResponse, null, 2)}</pre>
        </Box>
      )}
    </Box>
  );
};

export default FormComponent;
