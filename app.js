const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 3000;

const uri = 'mongodb+srv://anchiaprogram1:hw85jSFpdTgDPW1J@cluster0.tdratzf.mongodb.net/Pikachu?retryWrites=true&w=majority';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let pokemonsCollection;

async function connectToDatabase() {
  try {
    await client.connect();
    const db = client.db('Pikachu');
    pokemonsCollection = db.collection('pokemones');
    console.log('Connected to MongoDB successfully!');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

connectToDatabase();

// Rutas del API

// Ruta para registrar un nuevo Pokémon
app.post('/api/pokemons', express.json(), async (req, res) => {
  const newPokemon = req.body;
  try {
    const result = await pokemonsCollection.insertOne(newPokemon);
    res.status(201).json(result.ops[0]);
  } catch (error) {
    console.error('Error creating a new Pokémon:', error);
    res.status(500).json({ error: 'Failed to create a new Pokémon' });
  }
});

// Ruta para obtener todos los Pokémons
app.get('/api/pokemons', async (req, res) => {
  try {
    const pokemons = await pokemonsCollection.find({}).toArray();
    res.json(pokemons);
  } catch (error) {
    console.error('Error getting all Pokémons:', error);
    res.status(500).json({ error: 'Failed to get all Pokémons' });
  }
});

// Ruta para obtener un Pokémon por su ID
app.get('/api/pokemons/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const pokemon = await pokemonsCollection.findOne({ _id: ObjectId(id) });
    if (!pokemon) {
      return res.status(404).json({ message: 'Pokémon not found' });
    }
    res.json(pokemon);
  } catch (error) {
    console.error('Error getting a Pokémon by ID:', error);
    res.status(500).json({ error: 'Failed to get a Pokémon' });
  }
});

// Ruta para actualizar un Pokémon por su ID
app.put('/api/pokemons/:id', express.json(), async (req, res) => {
  const { id } = req.params;
  const updatedPokemon = req.body;
  try {
    const result = await pokemonsCollection.updateOne(
      { _id: ObjectId(id) },
      { $set: updatedPokemon }
    );
    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: 'Pokémon not found' });
    }
    res.json({ message: 'Pokémon updated successfully' });
  } catch (error) {
    console.error('Error updating a Pokémon:', error);
    res.status(500).json({ error: 'Failed to update a Pokémon' });
  }
});

// Ruta para eliminar un Pokémon por su ID
app.delete('/api/pokemons/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pokemonsCollection.deleteOne({ _id: ObjectId(id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Pokémon not found' });
    }
    res.json({ message: 'Pokémon deleted successfully' });
  } catch (error) {
    console.error('Error deleting a Pokémon:', error);
    res.status(500).json({ error: 'Failed to delete a Pokémon' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
