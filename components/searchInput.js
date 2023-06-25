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
        className="placeholder:italic relative placeholder:text-slate-200 block bg-slate-600 w-[20vw] border border-slate-300 rounded-md py-3 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm m-[77vw] text-white mt-5 mb-5"
      />
      <Link
        className="absolute top-[35px] text-2xl font-bold pl-[50px] py-1 px-1"
        href="/"
      >
        TsugiFlix
      </Link>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-4 h-4 absolute top-[35px] right-[75px] text-slate-50 pointer-events-none"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
        />
      </svg>
    </div>
  );
};

const AnimeList = ({ data }) => {
  if (!data || !data.results) {
    return null; // Add a fallback to handle when data is null or results is undefined
  }

  return (
    <div className="relative w-[20vw] ml-[77vw] rounded-lg h-[400px] overflow-y-auto">
      <div className="bg-gray-900 text-white">
        <div role="list" className="p-6 divide-y divide-slate-200">
          {data.results.map((anime) => (
            <div
              key={anime.id}
              className="flex py-4 first:pt-0 last:pb-0 border-slate-950"
            >
              <a href={`/anime/${anime.id}`} className="flex flex-wrap">
                <img
                  src={anime.image}
                  alt={anime.title}
                  width={225}
                  height={318}
                  className="h-[100px] w-auto rounded-lg"
                />

                <div className="ml-3 overflow-hidden">
                  <h2>{anime.title}</h2>
                  <p className="text-sm font-medium text-slate-300">
                    Release Date: {anime.releaseDate || "Unknown"}
                  </p>
                  <p className="text-sm text-slate-500">
                    Sub/Dub: {anime.subOrDub}
                  </p>
                </div>
              </a>
              <br />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const AnimeSearch = () => {
  const [data, setData] = useState();

  const [searchQuery, setSearchQuery] = useState("");
  const url = `https://api.consumet.org/anime/gogoanime/${searchQuery}`;
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
      const response = await axios.get(url, { params: { page: 1 } });
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

  return (
    <div>
      <SearchForm
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleTyping={handleTyping}
      />

      {isLoading && (
        <div className="flex">
          <div className="lds-dual-ring"></div>
        </div>
      )}

      {submitted || (data && data.results) ? (
        <AnimeList data={data} />
      ) : (
        <div className="flex justify-center mt-8">
          <h3 className="text-white">Vi&apos;s Website</h3>
        </div>
      )}
    </div>
  );
};

export default AnimeSearch;
