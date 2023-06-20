import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";

function AnimeDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [anime, setAnime] = useState(null);

  useEffect(() => {
    async function fetchAnimeData() {
      try {
        const response = await axios.get(
          `https://api.consumet.org/anime/gogoanime/info/${id}`
        );
        console.log(`https://api.consumet.org/anime/gogoanime/info/${id}`);
        setAnime(response.data);
      } catch (err) {
        throw new Error(err.message);
      }
    }

    if (id) {
      fetchAnimeData();
    }
  }, [id]);

  return (
    <div>
      {anime ? (
        <div>
          <h1>{anime.title}</h1>
          <img src={anime.image} alt={anime.title} />
          <p>Release Date: {anime.releaseDate || "Unknown"}</p>
          <p>{anime.type}</p>
          <p>{anime.status}</p>
          <p>Sub/Dub: {anime.subOrDub || "Unknown"}</p>
          <br />
          <p>{anime.description}</p>
          <br />
          Genres:
          {anime.genres.map((genre, index) => (
            <li key={index}>{genre}</li>
          ))}
          <br />
          <p>Other Names: {anime.otherName}</p>
          <br />
          <p>Total Episodes: {anime.totalEpisodes}</p>
          <br />
          <ul>
            {anime.episodes.map((episode) => (
              <li key={episode.id}>
                <Link href={`/watch/${episode.id}`}>
                  Watch Episode {episode.number}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default AnimeDetailPage;
