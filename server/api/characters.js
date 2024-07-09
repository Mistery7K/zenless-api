import { promises as fs } from "fs";
import path from "path";
import { getQuery } from "h3";

export default defineEventHandler(async (event) => {
  const charactersDir = path.join(process.cwd(), "server/data/characters");

  let characters = [];

  // Read all files in charaters folder
  const files = await fs.readdir(charactersDir);
  for (const file of files) {
    if (file.endsWith(".json")) {
      const filePath = path.join(charactersDir, file);
      const fileContents = await fs.readFile(filePath, "utf-8");
      const characterData = JSON.parse(fileContents);
      characters.push(characterData);
    }
  }

  const query = getQuery(event);
  // Filter by name
  if (query.name) {
    const nameFilter = query.name.toLowerCase();
    characters = characters.filter((character) =>
      character.name.toLowerCase().includes(nameFilter)
    );
  }

  // Filter by element
  if (query.element) {
    const elementFilter = query.element.toLowerCase();
    characters = characters.filter(
      (character) => character.element.toLowerCase() === elementFilter
    );
  }

  return characters;
});
