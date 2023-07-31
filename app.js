const express = require('express');
const app = express();
const port = 3000;

// Configuración para procesar JSON en las solicitudes
app.use(express.json());
// Configuración para servir archivos estáticos desde la carpeta public
app.use(express.static('public'));

const pokemons = [];

// Registro de pokémones
app.post('/pokemon', (req, res) => {
  const newPokemon = req.body;
  newPokemon.id = Date.now().toString();
  pokemons.push(newPokemon);
  res.status(201).json(newPokemon);
});

// Visualización de pokémons
app.get('/pokemon', (req, res) => {
  res.json(pokemons);
});

// Búsqueda de pokémons
app.get('/pokemon/search', (req, res) => {
  const searchTerm = req.query.q.toLowerCase();
  const filteredPokemons = pokemons.filter(pokemon => {
    return pokemon.name.toLowerCase().includes(searchTerm) || pokemon.type.toLowerCase().includes(searchTerm);
  });
  res.json(filteredPokemons);
});

// Edición de pokémons
app.put('/pokemon/:id', (req, res) => {
  const id = req.params.id;
  const updatedPokemon = req.body;
  const index = pokemons.findIndex(pokemon => pokemon.id === id);
  if (index !== -1) {
    pokemons[index] = updatedPokemon;
    res.json(updatedPokemon);
  } else {
    res.status(404).json({ message: 'Pokémon not found' });
  }
});

// Eliminación de pokémons
app.delete('/pokemon/:id', (req, res) => {
  const id = req.params.id;
  const index = pokemons.findIndex(pokemon => pokemon.id === id);
  if (index !== -1) {
    const deletedPokemon = pokemons.splice(index, 1);
    res.json(deletedPokemon[0]);
  } else {
    res.status(404).json({ message: 'Pokémon not found' });
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
