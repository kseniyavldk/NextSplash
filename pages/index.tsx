import React, { useEffect, useState } from "react";
import axios from "axios";
import PhotoList from "../components/PhotoList";
import { Photo } from "../types";
import styles from "./HomePage.module.css";

const HomePage: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("latest");

  const fetchPhotos = async (pageNumber: number, category?: string) => {
    try {
      const params: { [key: string]: string | number } = {
        per_page: 20,
        page: pageNumber,
        order_by: sortBy === "popular" ? "popular" : "latest",
      };

      if (category) {
        params.category = category;
      }

      const response = await axios.get("https://api.unsplash.com/photos", {
        headers: {
          Authorization: `Client-ID hIWMjHWWL-dTX53r5b5gfjVMZw8y7ywIdNPWffarr-o`,
        },
        params,
      });

      console.log("Fetched photos:", response.data);
      setPhotos(response.data);
      setTotalPages(response.headers["x-total-pages"]);
    } catch (error) {
      console.error("Error fetching photos:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get("https://api.unsplash.com/topics", {
        headers: {
          Authorization: `Client-ID hIWMjHWWL-dTX53r5b5gfjVMZw8y7ywIdNPWffarr-o`,
        },
      });

      setCategories(response.data.map((category: any) => category.title));
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchPhotos(page, selectedCategory);
    fetchCategories();
  }, [page, selectedCategory, sortBy]);

  const loadMorePhotos = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const loadPrevPhotos = () => {
    setPage((prevPage) => (prevPage > 1 ? prevPage - 1 : 1));
  };

  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
    setPage(1);
  };

  const addToFavorites = (photoId: string) => {
    if (isFavorite(photoId)) {
      setFavorites((prevFavorites) =>
        prevFavorites.filter((id) => id !== photoId)
      );
    } else {
      setFavorites((prevFavorites) => [...prevFavorites, photoId]);
    }
  };

  const isFavorite = (photoId: string) => {
    return favorites.includes(photoId);
  };

  const handleSortChange = (sortOption: string) => {
    setSortBy(sortOption);
    setPage(1);
  };

  return (
    <div>
      <div className={styles.headerContainer}>
        <h1 className={styles.headerTitle}>Unsplash Photo Gallery</h1>
        <div className={styles.headerDropdown}>
          <label htmlFor="category">Select Category:</label>
          <select
            id="category"
            onChange={(e) => handleCategoryChange(e.target.value)}
            value={selectedCategory || ""}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.headerDropdown}>
          <label htmlFor="sort">Sort By:</label>
          <select
            id="sort"
            onChange={(e) => handleSortChange(e.target.value)}
            value={sortBy}
          >
            <option value="latest">Date Added</option>
            <option value="popular">Popularity</option>
          </select>
        </div>
      </div>

      <PhotoList
        photos={photos}
        onAddToFavorites={addToFavorites}
        isFavorite={isFavorite}
      />

      <div>
        <button onClick={loadPrevPhotos} disabled={page === 1}>
          Previous Page
        </button>
        <span>
          {" "}
          Page {page} of {totalPages}{" "}
        </span>
        <button onClick={loadMorePhotos} disabled={page >= totalPages}>
          Next Page
        </button>
      </div>
    </div>
  );
};

export default HomePage;
