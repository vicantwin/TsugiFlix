import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import videojs from "video.js";
import "video.js/dist/video-js.css";

function WatchPage() {
  const router = useRouter();
  const { id } = router.query;
  console.log(`https://api.consumet.org/anime/gogoanime/watch/${id}`);
  const [data, setData] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          `https://api.consumet.org/anime/gogoanime/watch/${id}`
        );
        setData(response.data);
      } catch (err) {
        console.error(err);
      }
    }

    fetchData();
  }, [id]);

  useEffect(() => {
    if (videoRef.current) {
      videojs(videoRef.current, {
        sources: [
          {
            src: `https://m3u8.eltik.net/m3u8-proxy?url=${encodeURIComponent(
              data.sources[0].url
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
      {data ? (
        <div>
          <h1>API Response</h1>
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
          {console.log(data.sources[0], data.headers)}
          <video controls ref={videoRef} className="video-js" />
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default WatchPage;
