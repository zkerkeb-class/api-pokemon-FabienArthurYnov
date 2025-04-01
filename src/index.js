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
    types: [
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
    ],
    pokemons: pokemonsList,
  });
});

// GET pokemon by id
app.get("/api/pokemons/:id", (req, res) => {
  const pokemonChoosen = null;
  pokemonsList.forEach(pokemon => {
    if (pokemon.id === req.params.id){
      pokemonChoosen = pokemon;
    };
  });
  if (pokemonChoosen === null) {
    res.status(404).send("Pokemon with id " + req.params.id + " not found");
    return;
  } else {
    res.status(200).send(pokemonChoosen);
    return;
  }
});

// delete pokemon by id
app.delete("/api/pokemons/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const newPokemonsList = pokemonsList.filter(pokemon => pokemon.id !== id);

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
