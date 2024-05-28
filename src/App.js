import React, { useEffect, useState } from 'react';
import Card from '../src/components/Card';
import Loading from '../src/components/Loading';
import navvid from './assets/navvid.mp4';
import './App.css';

function App() {
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nextUrl, setNextUrl] = useState(null);
  const [prevUrl, setPrevUrl] = useState(null);
  const [currentUrl, setCurrentUrl] = useState('https://pokeapi.co/api/v2/pokemon?limit=20');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPokemon, setFilteredPokemon] = useState([]);
  const [notFoundMessage, setNotFoundMessage] = useState('');

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        setLoading(true);
        const response = await fetch(currentUrl);
        const data = await response.json();
        setPokemonList(data.results);
        setNextUrl(data.next);
        setPrevUrl(data.previous);
      } catch (error) {
        console.error('Error fetching Pokémon:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemon();
  }, [currentUrl]);

  useEffect(() => {
    const filtered = pokemonList.filter(pokemon =>
      pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPokemon(filtered);
    setNotFoundMessage('');
  }, [pokemonList, searchTerm]);

  const handleSearchChange = event => {
    setSearchTerm(event.target.value);
  };

  const handleNextPage = () => {
    if (nextUrl) {
      setCurrentUrl(nextUrl);
    }
  };

  const handlePrevPage = () => {
    if (prevUrl) {
      setCurrentUrl(prevUrl);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="App">
      <div className="video-background">
        <video autoPlay loop muted>
          <source src={navvid} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <div className="content">
        <div class="container">
          <div class="row">
            <div class="col-md-12 text-center">
              <h3 class="animate-charcter">Pokemons</h3>
            </div>
          </div>
        </div>

        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
        />

        <div className="pokemon-list">
          {filteredPokemon.length === 0 && (
            <p className="not-found-message">Pokemon not found on this page. Please try on the next page.</p>
          )}
          {filteredPokemon.map((poke, index) => (
            <Card key={index} url={poke.url} />
          ))}
        </div>
        <div className="pagination">
          {prevUrl && <button onClick={handlePrevPage}>Previous</button>}
          {nextUrl && <button onClick={handleNextPage}>Next</button>}
        </div>
      </div>
    </div>
  );
}

export default App;
