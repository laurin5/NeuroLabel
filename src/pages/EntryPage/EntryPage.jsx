import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { API_HOST } from "../../utils/api";

const EntryPage = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [videos, setVideos] = useState([]);
  const [audios, setAudios] = useState([]);

  let location = useLocation();
  let navigator = useNavigate();

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
    setImages(responseJSON.images);
    setVideos(responseJSON.videos);
    setAudios(responseJSON.audios);
    setLoading(false);
    console.log(responseJSON);
  };

  useEffect(() => {
    validateSession();
    fetchEntries();
  }, []);

  const validateSession = async () => {
    const response = await fetch(
      `${API_HOST}/sessions/${localStorage.getItem("sessionid")}/validate`,
      {
        headers: {
          SessionId: localStorage.getItem("sessionid"),
        },
      }
    );
    const responseJSON = await response.json();
    if (responseJSON.message == "Success.") {
    } else {
      localStorage.removeItem("sessionid");
      navigator("/login");
    }
  };

  const enlargeImage = (image) => {
    setSelectedImage(image);
  };

  const closeEnlarged = () => {
    setSelectedImage(null);
  };

  return (
    <div>
      <p className="text-center text-xl text-white mt-2">Entries</p>
      {images.length < 1 ||
        videos.length < 1 ||
        (audios.length < 1 && (
          <p className="text-center text-xl text-white">
            Keine Entries vorhanden
          </p>
        ))}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-4 gap-6 mx-6 mt-4">
          {images.map((image) => (
            <div
              className="shadow-md flex flex-col items-center bg-white hover:shadow-xl"
              key={image.id}
            >
              <img
                src={`${API_HOST}/${image.image_recording_url}`}
                alt=""
                className="max-h-[100px] object-cover cursor-pointer w-full"
                onClick={() => enlargeImage(image)}
              />
              <p>{image.data_entry.label.label}</p>
            </div>
          ))}
          {videos.map((video) => (
            <div
              className="shadow-md flex flex-col items-center bg-white hover:shadow-xl"
              key={video.id}
            >
              <video
                controls
                className="max-h-[200px] object-cover cursor-pointer w-full"
              >
                <source
                  src={`${API_HOST}/${video.video_recording_url}`}
                  type="video/mp4"
                />
              </video>
              <p>{video.data_entry.label.label}</p>
            </div>
          ))}
          {audios.map((audio) => (
            <div
              className="shadow-md flex flex-col items-center bg-white hover:shadow-xl"
              key={audio.id}
            >
              <audio controls className="cursor-pointer w-full">
                <source
                  src={`${API_HOST}/${audio.audio_recording_url}`}
                  type="audio/mpeg"
                />
              </audio>
              <p>{audio.data_entry.label.label}</p>
            </div>
          ))}
        </div>
      )}

      {selectedImage && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-75">
          <div className="max-w-[30%] object-cover flex items-center justify-center mt-20">
            <img
              src={`${API_HOST}/${selectedImage.image_recording_url}`}
              alt=""
              className="max-w-[70%]"
              onClick={closeEnlarged}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default EntryPage;
