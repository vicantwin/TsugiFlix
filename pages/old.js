import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";

const SearchForm = ({ searchQuery, setSearchQuery, handleSubmit }) => {
  const handleChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div className="form">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={searchQuery}
          onChange={handleChange}
          placeholder="Search for Anime..."
          className="placeholder:italic placeholder:text-slate-200 block bg-slate-600 w-[90vw] border border-slate-300 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm self-center m-auto text-white"
        />
      </form>
    </div>
  );
};

function Home() {
  const [data, setData] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.get(
        `https://api.consumet.org/anime/gogoanime/${searchQuery}`,
        { params: { page: 1 } }
      );
      setData(response.data);
      setSubmitted(true);
    } catch (err) {
      throw new Error(err.message);
    }
  };

  useEffect(() => {
    let isMounted = true;

    if (submitted) {
      async function fetchData() {
        try {
          const response = await axios.get(
            `https://api.consumet.org/anime/gogoanime/${searchQuery}`,
            { params: { page: 1 } }
          );
          if (isMounted) {
            setData(response.data);
            setSubmitted(false);
          }
        } catch (err) {
          throw new Error(err.message);
        }
      }

      fetchData();
    }

    return () => {
      isMounted = false;
    };
  }, [searchQuery, submitted]);

  return (
    <div>
      <SearchForm
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSubmit={handleSubmit}
      />
      <div>
        {submitted || data !== null ? (
          <div>
            <h1>Anime List</h1>
            <br />
            <div className="flex flex-wrap">
              {data?.results.map((anime) => (
                <div
                  key={anime.id}
                  className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/6"
                >
                  <div className="p-2">
                    <h2>{anime.title}</h2>
                    <div className="m-[20px]  group items-center">
                      <Link href={`/anime/${anime.id}`} className="main">
                        <img
                          src={anime.image}
                          alt={anime.title}
                          className="w-full group-hover/img:bg-slate-700 group-hover:opacity-60"
                        />
                      </Link>
                      <p className="group-hover/text:visible group-hover:text-slate-700">
                        Release Date: {anime.releaseDate || "Unknown"}
                      </p>
                      <p className="group-hover/text:visible group-hover:text-slate-700">
                        Sub/Dub: {anime.subOrDub}
                      </p>
                    </div>

                    <br />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p>Vi`&apos;`s Website</p>
        )}
      </div>
    </div>
  );
}

export default Home;
