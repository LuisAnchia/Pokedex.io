document.addEventListener('DOMContentLoaded', () => {
    const addPokemonForm = document.getElementById('add-pokemon-form');
    const searchInput = document.getElementById('search');
    const pokemonList = document.getElementById('pokemon-list');
  
    // Función para mostrar la lista de pokémons
    function displayPokemons(pokemons) {
      pokemonList.innerHTML = '';
      pokemons.forEach(pokemon => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
          <h2>${pokemon.name}</h2>
          <p><strong>Tipo:</strong> ${pokemon.type}</p>
          <p>${pokemon.description}</p>
          <p><strong>Debilidades:</strong> ${pokemon.weaknesses}</p>
          <button onclick="editPokemon('${pokemon.id}')">Editar</button>
          <button onclick="deletePokemon('${pokemon.id}')">Eliminar</button>
        `;
        pokemonList.appendChild(card);
      });
    }
  
    // Función para agregar un nuevo pokémon
    addPokemonForm.addEventListener('submit', event => {
      event.preventDefault();
      const name = document.getElementById('name').value;
      const type = document.getElementById('type').value;
      const description = document.getElementById('description').value;
      const hasEvolution = document.getElementById('evolution').checked;
      const weaknesses = document.getElementById('weaknesses').value;
      const newPokemon = {
        name,
        type,
        description,
        hasEvolution,
        weaknesses,
      };
      fetch('/pokemon', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPokemon),
      })
        .then(response => response.json())
        .then(data => {
          // Agregar el nuevo pokémon a la lista
          fetch('/pokemon')
            .then(response => response.json())
            .then(pokemons => {
              displayPokemons(pokemons);
              addPokemonForm.reset();
              alert('¡Pokémon agregado con éxito!');
            });
        })
        .catch(error => {
          console.error('Error al agregar el Pokémon:', error);
          alert('Hubo un error al agregar el Pokémon. Por favor, inténtalo de nuevo.');
        });
    });
  
    // Función para buscar pokémons
    searchInput.addEventListener('input', () => {
      const searchTerm = searchInput.value.toLowerCase();
      fetch(`/pokemon/search?q=${searchTerm}`)
        .then(response => response.json())
        .then(displayPokemons);
    });
  
    // Función para eliminar un pokémon
    window.deletePokemon = id => {
      fetch(`/pokemon/${id}`, {
        method: 'DELETE',
      })
        .then(response => response.json())
        .then(deletedPokemon => {
          // Eliminar el pokémon de la lista
          const pokemons = [...pokemonList];
          const index = pokemons.findIndex(pokemon => pokemon.id === deletedPokemon.id);
          if (index !== -1) {
            pokemons.splice(index, 1);
            displayPokemons(pokemons);
            alert('¡Pokémon eliminado con éxito!');
          }
        })
        .catch(error => {
          console.error('Error al eliminar el Pokémon:', error);
          alert('Hubo un error al eliminar el Pokémon. Por favor, inténtalo de nuevo.');
        });
    };
  
    // Función para editar un pokémon
    window.editPokemon = id => {
      // Obtener los datos del pokémon a editar y mostrarlos en el formulario
      const pokemon = pokemons.find(pokemon => pokemon.id === id);
      if (pokemon) {
        document.getElementById('name').value = pokemon.name;
        document.getElementById('type').value = pokemon.type;
        document.getElementById('description').value = pokemon.description;
        document.getElementById('evolution').checked = pokemon.hasEvolution;
        document.getElementById('weaknesses').value = pokemon.weaknesses;
  
        // Al hacer clic en el botón de editar, se enviará la solicitud de actualización
        addPokemonForm.onsubmit = event => {
          event.preventDefault();
          const updatedPokemon = {
            id,
            name: document.getElementById('name').value,
            type: document.getElementById('type').value,
            description: document.getElementById('description').value,
            hasEvolution: document.getElementById('evolution').checked,
            weaknesses: document.getElementById('weaknesses').value,
          };
          fetch(`/pokemon/${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedPokemon),
          })
            .then(response => response.json())
            .then(data => {
              // Actualizar el pokémon en la lista
              fetch('/pokemon')
                .then(response => response.json())
                .then(pokemons => {
                  displayPokemons(pokemons);
                  addPokemonForm.reset();
                  alert('¡Pokémon actualizado con éxito!');
                });
            })
            .catch(error => {
              console.error('Error al actualizar el Pokémon:', error);
              alert('Hubo un error al actualizar el Pokémon. Por favor, inténtalo de nuevo.');
            });
        };
      }
    };
  
    // Cargar la lista de pokémons al cargar la página
    fetch('/pokemon')
      .then(response => response.json())
      .then(pokemons => {
        displayPokemons(pokemons);
        window.pokemons = pokemons;
      });
  });
  