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
        <div className="ml-4">
          <h1>{anime.title}</h1>
          <img src={anime.image} alt={anime.title} />
          <br />
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
          <ul className="flex flex-wrap">
            {anime.episodes.map((episode) => (
              <li
                key={episode.id}
                className="w-full sm:w-1/6 md:w-1/7 lg:w-1/8 xl:w-1/9"
              >
                <Link href={`/watch/${episode.id}`}>
                  <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg ml-[10px]  mr-[10px]   mb-[10px] group items-center">
                    Watch Episode {episode.number}
                  </button>
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
