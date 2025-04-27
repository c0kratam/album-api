import express from "express";
import cors from "cors";
import { initializeDatabase, dbAll, dbGet, dbRun } from "./util/database.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/album", async (req, res) => {
  try {
    const adatok = await dbAll("SELECT * FROM album ORDER BY ev, zenekar;");
    res.status(200).json(adatok);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/album/:id", async (req, res) => {
  try {
    const album = await dbGet("SELECT * FROM album WHERE id = ?;", [req.params.id]);
    if (!album) {
      return res.status(404).json({ message: "Album nem található" });
    }
    res.status(200).json(album);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/album", async (req, res) => {
  try {
    const { zenekar, cim, ev, mufaj } = req.body;
    if (!zenekar || !cim || !ev || !mufaj) {
      return res.status(400).json({ message: "Hiányzó adat(ok): zenekar, cim ev vagy mufaj" });
    }

    const result = await dbRun(
      "INSERT INTO album (zenekar, cim, ev, mufaj) VALUES (?, ?, ?, ?);",
      [zenekar, cim, ev, mufaj]
    );
    res.status(201).json({ id: result.lastID, zenekar, cim, ev, mufaj });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
  

app.put("/album/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const album = await dbGet("SELECT * FROM album WHERE id = ?;", [id]);
    if (!album) {
      return res.status(404).json({ message: "Album nem található" });
    }

    const { zenekar, cim, ev, mufaj } = req.body; // 'cim' átnevezése 'albumCim'-re
    if (!zenekar || !cim || !ev || !mufaj) { // Az 'albumCim' itt is
      return res.status(400).json({ message: "Hiányzó adat(ok)" });
    }

    await dbRun(
      "UPDATE album SET zenekar = ?, cim = ?, ev = ?, mufaj = ? WHERE id = ?;",
      [zenekar, cim, ev, mufaj, id] // Az 'albumCim' használata
    );
    res.status(200).json({ id, zenekar, cim, ev, mufaj });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete("/album/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const album = await dbGet("SELECT * FROM album WHERE id = ?;", [id]);
    if (!album) {
      return res.status(404).json({ message: "Album nem található" });
    }

    await dbRun("DELETE FROM album WHERE id = ?;", [id]);
    res.status(200).json({ message: "Album törölve" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.use((req, res) => {
  res.status(404).json({ message: "Endpoint nem található" });
});

async function startServer() {
  await initializeDatabase();
  app.listen(3000, () => {
    console.log(`API fut: http://localhost:3000`);
  });
}

startServer();
