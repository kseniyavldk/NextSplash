import React, { useState } from "react";
import { Photo } from "../types";
import styles from "./PhotoList.module.css";
import classNames from "classnames";

interface PhotoListProps {
  photos: Photo[];
  onAddToFavorites: (photoId: string) => void;
  isFavorite: (photoId: string) => boolean;
}

const PhotoList: React.FC<PhotoListProps> = ({
  photos,
  onAddToFavorites,
  isFavorite,
}) => {
  const [hoveredPhoto, setHoveredPhoto] = useState<string | null>(null);

  return (
    <div className={styles.photoList}>
      {photos.map((photo) => (
        <div key={photo.id} className={styles.photoItem}>
          <img src={photo.urls.small} alt={photo.alt_description} />
          <button
            onMouseEnter={() => setHoveredPhoto(photo.id)}
            onMouseLeave={() => setHoveredPhoto(null)}
            onClick={() => onAddToFavorites(photo.id)}
            className={classNames(styles.favoriteButton, {
              [styles.favorite]: isFavorite(photo.id),
              [styles.hovered]: hoveredPhoto === photo.id,
            })}
          >
            {isFavorite(photo.id) ? "❤️" : "🤍"}
          </button>
        </div>
      ))}
    </div>
  );
};

export default PhotoList;
