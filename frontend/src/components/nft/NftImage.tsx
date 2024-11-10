import React, { useEffect, useState } from "react";

interface NFTMetadata {
  name: string;
  description: string;
  image: string;
}

function NFTImage({ tokenURI }: { tokenURI: string }) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNFTMetadata = async () => {
      try {
        const response = await fetch(tokenURI);
        const metadata: NFTMetadata = await response.json();

        setImageUrl(metadata.image);
      } catch (err) {
        setError("Failed to fetch NFT metadata");
        console.error("Error fetching metadata:", err);
      }
    };

    fetchNFTMetadata();
  }, [tokenURI]);

  return (
    <div>
      {error && <p>{error}</p>}
      {imageUrl ? (
        <img src={imageUrl} alt="NFT Image" />
      ) : (
        <p>Loading image...</p>
      )}
    </div>
  );
}

export default NFTImage;
