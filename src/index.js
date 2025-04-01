import express from "express";
import cors from "cors";
import fs from 'fs';
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import {saveToFile} from "./utils/writer.js";

dotenv.config();

// Lire le fichier JSON
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pokemonsList = JSON.parse(fs.readFileSync(path.join(__dirname, './data/pokemons.json'), 'utf8'));

const app = express();
const PORT = 3000;
const all_types = [
  "fire",
  "water",
  "grass",
  "electric",
  "ice",
  "fighting",
  "poison",
  "ground",
  "flying",
  "psychic",
  "bug",
  "rock",
  "ghost",
  "dragon",
  "dark",
  "steel",
  "fairy",
];

// Middleware pour CORS
app.use(cors());

// Middleware pour parser le JSON
app.use(express.json());

// Middleware pour servir des fichiers statiques
// 'app.use' est utilisé pour ajouter un middleware à notre application Express
// '/assets' est le chemin virtuel où les fichiers seront accessibles
// 'express.static' est un middleware qui sert des fichiers statiques
// 'path.join(__dirname, '../assets')' construit le chemin absolu vers le dossier 'assets'
app.use("/assets", express.static(path.join(__dirname, "../assets")));

// Route GET de base
app.get("/api/pokemons", (req, res) => {
  res.status(200).send({
    types: all_types,
    pokemons: pokemonsList,
  });
});

// GET pokemon by id
app.get("/api/pokemons/:id", (req, res) => {
  const id = parseInt(req.params.id, 10)
  const pokemonChoosen = pokemonsList.find(pokemon => pokemon.id === id);

  if (!pokemonChoosen) {
    res.status(404).send("Pokemon with id " + id + " not found");
    return;
  }

  res.status(200).send(pokemonChoosen);
});

app.post("/api/pokemons", (req, res) => {
  const newPokemon = req.body;

  // Validate ID
  if (!(newPokemon.id && typeof newPokemon.id === "number")) {
      res.status(400).send("Bad id");
      return;
  }

  // Validate name (English required, others optional)
  if (!(newPokemon.name && newPokemon.name.english && typeof newPokemon.name.english === "string")) {
      res.status(400).send("Need at least the English name");
      return;
  }

  newPokemon.name.japanese = typeof newPokemon.name.japanese === "string" ? newPokemon.name.japanese : "";
  newPokemon.name.chinese = typeof newPokemon.name.chinese === "string" ? newPokemon.name.chinese : "";
  newPokemon.name.french = typeof newPokemon.name.french === "string" ? newPokemon.name.french : "";

  // Validate types (must be an array and contain only valid types)
  if (!(Array.isArray(newPokemon.type) && newPokemon.type.every(type => all_types.includes(type)))) {
      res.status(400).send("Bad Pokemon types");
      return;
  }

  // Validate base stats
  const baseStats = ["HP", "Attack", "Defense", "Sp. Attack", "Sp. Defense", "Speed"];
  for (const stat of baseStats) {
      if (!(newPokemon.base && newPokemon.base[stat] && typeof newPokemon.base[stat] === "number")) {
          res.status(400).send(`Bad base ${stat}`);
          return;
      }
  }

  // Validate image
  if (!(newPokemon.image && typeof newPokemon.image === "string")) {
      res.status(400).send("Bad image");
      return;
  }

  // add the new pokemon to the list
  pokemonsList.push(newPokemon);

  // Save to file
  const filePath = path.join(__dirname, './data/pokemons.json');
  saveToFile(filePath, pokemonsList);

  res.status(201).send(`Pokémon with ID ${newPokemon.id} successfully created`);
});


// delete pokemon by id
app.delete("/api/pokemons/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  var newPokemonsList = pokemonsList.filter(pokemon => pokemon.id !== id);

  if (newPokemonsList.length === pokemonsList.length) {
    res.status(404).send("Pokemon with id " + req.params.id + " not found");
    return;
  } else {
    saveToFile(path.join(__dirname, './data/pokemons.json'), newPokemonsList);
    res.status(202).send("Pokemon with id " + req.params.id + " successfully deleted");
    return;
  }
})

app.get("/", (req, res) => {
  res.send("bienvenue sur l'API Pokémon");
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
