import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import videojs from "video.js";
import "video.js/dist/video-js.css";

function WatchPage() {
  const router = useRouter();
  const { id } = router.query;
  const [data, setData] = useState(null);
  const [animeData, setAnimeData] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          `https://api.consumet.org/anime/gogoanime/watch/${id}`
        );
        setData(response.data);
        function splitString(string, delimiter) {
          const index = string.indexOf(delimiter);
          if (index !== -1) {
            return string.slice(0, index);
          }
          return string;
        }

        const string = id;
        const delimiter = "-episode-";
        const animeID = splitString(string, delimiter);

        console.log(animeID);
        const animeResponse = await axios.get(
          `https://api.consumet.org/anime/gogoanime/info/${animeID}`
        );
        setAnimeData(animeResponse.data);
        console.log(animeData.episodes);
      } catch (err) {
        console.error(err);
      }
    }

    fetchData();
  }, [id]);

  useEffect(() => {
    if (videoRef.current) {
      console.log(data.sources);
      videojs(videoRef.current, {
        sources: [
          {
            src: `https://m3u8.eltik.net/m3u8-proxy?url=${encodeURIComponent(
              data.sources[data.sources.length - 3].url
            )}%23.mp4&headers=${encodeURIComponent(
              JSON.stringify(data.headers)
            )}`,
            type: "application/x-mpegURL",
          },
        ],
      });
    }
  });

  return (
    <div>
      {data && animeData ? (
        <div className="index-info">
          {/*<p>Referer: {data.headers.Referer}</p>
          <p>watchsb: {data.headers.watchsb || "null"}</p>
          <p>User-Agent: {data.headers["User-Agent"] || "null"}</p>
          <h2>Sources</h2>
          <ul>
            {data.sources.map((source, index) => (
              <li key={index}>
                <p>URL: {source.url}</p>
                <p>Quality: {source.quality}</p>
                <p>Is M3U8: {source.isM3U8 ? "Yes" : "No"}</p>
              </li>
            ))}
            </ul> */}
          {console.log(data.sources[data.sources.length - 3], data.headers)}
          <div className="m-auto p-20">
            <h1 className="font-bold text-3xl">{animeData.title}</h1>
            <video controls ref={videoRef} className="video-js vjs-16-9" />
            <div className="justify-center flex flex-col">
              <h3>Type: {animeData.subOrDub},</h3>
              <h3> Status: {animeData.status}</h3>
            </div>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default WatchPage;
