import sqlite3 from "sqlite3";

const db = new sqlite3.Database("./data/database.sqlite", (err) => {
  if (err) {
    console.error("Adatbázis megnyitási hiba:", err.message);
  } else {
    console.log("Csatlakozva az SQLite adatbázishoz.");
  }
});

export function dbAll(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

export function dbGet(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

export function dbRun(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
}

export async function initializeDatabase() {
  await dbRun("DROP TABLE IF EXISTS album;");

  await dbRun(`
    CREATE TABLE IF NOT EXISTS album (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      zenekar TEXT NOT NULL,
      cim TEXT NOT NULL,
      ev INTEGER NOT NULL,
      mufaj TEXT NOT NULL
    );
  `);
  const albumok = [
    { zenekar: "queen", cim: "A Night at the Opera", ev: 1975, mufaj: "Rock" },
    { zenekar: "the_beatles", cim: "Abbey Road", ev: 1969, mufaj: "Rock" },
    { zenekar: "pink_floyd", cim: "The Dark Side of the Moon", ev: 1973, mufaj: "Progressive Rock" },
    { zenekar: "nirvana", cim: "Nevermind", ev: 1991, mufaj: "Grunge" },
    { zenekar: "ac_dc", cim: "Back in Black", ev: 1980, mufaj: "Hard Rock" },
    { zenekar: "metallica", cim: "Master of Puppets", ev: 1986, mufaj: "Metal" },
    { zenekar: "scooter", cim: "And the beat goes on", ev: 1995, mufaj: "Techno" },
    { zenekar: "spice_girls", cim: "Spice", ev: 1996, mufaj: "Pop" },
    { zenekar: "daft_punk", cim: "Discovery", ev: 2001, mufaj: "Electronic" }
  ];

  for (const album of albumok) {
    await dbRun(
      "INSERT INTO album (zenekar, cim, ev, mufaj) VALUES (?, ?, ?, ?);",
      [album.zenekar, album.cim, album.ev, album.mufaj]
    );
  }

  console.log("Adatbázis inicializálva – album adatok feltöltve.");
}