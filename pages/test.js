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
          className="placeholder:italic placeholder:text-slate-200 block bg-slate-600 w-[90vw] border border-slate-300 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm m-auto text-white mt-5"
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
            <br />
            <h1 className="px-6">Anime List</h1>
            <div role="list" className="p-6 divide-y divide-slate-200">
              {data?.results.map((anime) => (
                <div key={anime.id} className="flex py-4 first:pt-0 last:pb-0">
                  <Link href={`/anime/${anime.id}`} className="flex flex-wrap">
                    <img
                      src={anime.image}
                      alt={anime.title}
                      className="h-[100px] w-auto rounded-lg"
                    />

                    <div className="ml-3 overflow-hidden">
                      <h2>{anime.title}</h2>
                      <p className="text-sm font-medium text-slate-900">
                        Release Date: {anime.releaseDate || "Unknown"}
                      </p>
                      <p className="text-sm text-slate-500 truncate">
                        Sub/Dub: {anime.subOrDub}
                      </p>
                    </div>
                  </Link>

                  <br />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p>Vi's Website</p>
        )}
      </div>
    </div>
  );
}

export default Home;
