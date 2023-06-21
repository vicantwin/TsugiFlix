import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

const SearchForm = ({ searchQuery, setSearchQuery }) => {
  const handleChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div className="form">
      <input
        type="text"
        value={searchQuery}
        onChange={handleChange}
        placeholder="Search for Anime..."
        className="placeholder:italic placeholder:text-slate-200 block bg-slate-600 w-[90vw] border border-slate-300 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm m-auto text-white mt-5 mb-5"
      />
    </div>
  );
};

const AnimeList = ({ data }) => {
  if (!data || !data.results) {
    return null; // Add a fallback to handle when data is null or results is undefined
  }

  return (
    <div>
      <br />
      <h1 className="px-6">Anime List</h1>
      <div role="list" className="p-6 divide-y divide-slate-200">
        {data.results.map((anime) => (
          <div key={anime.id} className="flex py-4 first:pt-0 last:pb-0">
            <Link href={`/anime/${anime.id}`} className="flex flex-wrap">
              <img
                src={anime.image}
                alt={anime.title}
                width={225}
                height={318}
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
  );
};

const AnimeSearch = () => {
  const [data, setData] = useState();
  const [searchQuery, setSearchQuery] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    let debounceTimer;

    if (!isTyping && searchQuery) {
      debounceTimer = setTimeout(() => {
        fetchData();
      }, 1000);
    } else {
      fetchData();
    }

    return () => {
      clearTimeout(debounceTimer);
    };
  }, [searchQuery, isTyping]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `https://api.consumet.org/anime/gogoanime/${searchQuery}`,
        { params: { page: 1 } }
      );
      setData(response.data);
      setSubmitted(false);
      setIsLoading(false);
    } catch (err) {
      throw new Error(err.message);
    }
  };

  const handleTyping = (event) => {
    setIsTyping(true);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsTyping(false);
    setSubmitted(true);
  };

  return (
    <div>
      <SearchForm
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleTyping={handleTyping}
      />
      <div>
        {isLoading ? (
          <div className="flex justify-center">
            <div className="lds-dual-ring"></div>
          </div>
        ) : submitted || data !== null ? (
          <AnimeList data={data} />
        ) : (
          <div className="flex">
            <h3 className="self-center">Vi`&apos;`s Website</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnimeSearch;