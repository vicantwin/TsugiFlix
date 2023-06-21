import AnimeSearch from "./searchInput";

const Layout = ({ children }) => {
  return (
    <div>
      <AnimeSearch />
      {children}
    </div>
  );
};

export default Layout;
