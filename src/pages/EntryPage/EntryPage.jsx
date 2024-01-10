import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { API_HOST } from "../../utils/api";

const EntryPage = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  let location = useLocation();

  const fetchEntries = async () => {
    setLoading(true);
    const response = await fetch(
      `${API_HOST}/projects/datasets/${location.state.id}/entries`,
      {
        headers: {
          SessionID: localStorage.getItem("sessionid"),
        },
      }
    );
    const responseJSON = await response.json();
    console.log(responseJSON);
    setImages(responseJSON.images);
    setLoading(false);
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  return (
    <div>
      <p className="text-center text-xl">Entries</p>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "16px",
          }}
        >
          {images.map((image) => (
            <div className="border rounded-md shadow-md flex flex-col items-center">
              <img
                key={image.id}
                src={`http://lizard-studios.at:10187/${image.image_recording_url}`}
                alt=""
                className="w-[50%] object-cover"
              />
              <p>{image.data_entry.label.label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EntryPage;
