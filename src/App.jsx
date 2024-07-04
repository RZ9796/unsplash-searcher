import axios from 'axios';
import React, { useState, useEffect } from 'react';

const App = () => {
  const [query, setQuery] = useState('');
  const [images, setImages] = useState();
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        if (query.trim() !== '' && hasMore) {
          const response = await axios.get(`https://api.unsplash.com/search/photos`, {
            params: {
              query: query,
              page: page,
              per_page: 12, //  per_page value 
              client_id: import.meta.env.VITE_ACCESS_KEY
            }
          });
          // setImages(prevImages => [...prevImages, ...response.data.results]);
          setImages(response.data.results);//normal Search api call 
          setHasMore(response.data.results.length > 0);//getting more data
        }
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };
    const id = setTimeout(() => {
      fetchImages();
    }, 1000);

    return () => clearTimeout(id)

  }, [query, page]); // Trigger fetchImages on query change and page change

  const handleSearch = (e) => {
    setQuery(e.target.value);
    setPage(1); // Reset page when performing a new search
  };

  const loadMoreImages = () => {
    setPage(prevPage => prevPage + 1);
  };
  return (
    <div className=' bg-gradient-to-r from-cyan-500 to-blue-500 min-h-screen'>
      <div className=' container mx-auto w-3/4 p-4'>
        <h1 className='uppercase text-7xl text-center text-white my-5 font-bold  '>Unplash Image Searcher</h1>
        <label className="input input-bordered flex items-center gap-2">
          <input type="text" className="grow text-white placeholder:text-white " placeholder="Search" value={query} onChange={handleSearch} />
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" /></svg>
        </label>
        {/* Pagination add more */}
        {images && (
          <div className="my-4 flex justify-center ">
            <button className="btn hover:bg-white " onClick={loadMoreImages}>Show More</button>
          </div>
        )}
        {/* Images */}
        <div className="columns-2 md:columns-3 lg:columns-4 gap-6">
          {images && images.map((item) => (
            <div className='break-inside-avoid' key={item.id}>
              <img src={item.urls.thumb} alt={item.alt_description} className="rounded-lg w-full h-full bg-cover" />
              <a target='_blank' href={item.urls.full} download className="btn  w-full my-2 hover:bg-white">Download</a>
            </div>
          ))}
        </div>

      </div>
      {/* <pre>{JSON.stringify(images, null, 2)}</pre> */}
    </div>
  );
};

export default App;
