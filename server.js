const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/search", async (req, res) => {
  const q = String(req.query.q || "").trim().toLowerCase();

  if (!q) {
    return res.json({ results: [] });
  }

 const midiCatalog = [
  { title: "Fur Elise", artist: "Beethoven", genre: "classical", difficulty: "Normal" },
  { title: "Moonlight Sonata", artist: "Beethoven", genre: "classical", difficulty: "Hard" },
  { title: "Ode to Joy", artist: "Beethoven", genre: "classical", difficulty: "Easy" },
  { title: "Symphony No. 5 Theme", artist: "Beethoven", genre: "classical", difficulty: "Normal" },

  { title: "Canon in D", artist: "Pachelbel", genre: "classical", difficulty: "Normal" },

  { title: "Eine Kleine Nachtmusik", artist: "Mozart", genre: "classical", difficulty: "Normal" },
  { title: "Turkish March", artist: "Mozart", genre: "classical", difficulty: "Hard" },
  { title: "Twinkle Variations", artist: "Mozart", genre: "classical", difficulty: "Easy" },

  { title: "Prelude in C Major", artist: "Bach", genre: "classical", difficulty: "Normal" },
  { title: "Minuet in G", artist: "Bach", genre: "classical", difficulty: "Easy" },
  { title: "Toccata and Fugue Theme", artist: "Bach", genre: "classical", difficulty: "Hard" },

  { title: "Nocturne Op. 9 No. 2", artist: "Chopin", genre: "classical", difficulty: "Hard" },
  { title: "Minute Waltz", artist: "Chopin", genre: "classical", difficulty: "Hard" },
  { title: "Raindrop Prelude", artist: "Chopin", genre: "classical", difficulty: "Normal" },

  { title: "Spring from The Four Seasons", artist: "Vivaldi", genre: "classical", difficulty: "Normal" },
  { title: "Winter from The Four Seasons", artist: "Vivaldi", genre: "classical", difficulty: "Hard" },

  { title: "Hallelujah Chorus", artist: "Handel", genre: "classical", difficulty: "Normal" },
  { title: "Water Music Theme", artist: "Handel", genre: "classical", difficulty: "Normal" },

  { title: "Ave Maria", artist: "Schubert", genre: "classical", difficulty: "Normal" },
  { title: "Serenade", artist: "Schubert", genre: "classical", difficulty: "Normal" },

  { title: "The Blue Danube", artist: "Strauss", genre: "classical", difficulty: "Normal" },
  { title: "Radetzky March", artist: "Strauss", genre: "classical", difficulty: "Easy" },

  { title: "Twinkle Twinkle Little Star", artist: "Traditional", genre: "beginner", difficulty: "Easy" },
  { title: "Mary Had a Little Lamb", artist: "Traditional", genre: "beginner", difficulty: "Easy" },
  { title: "London Bridge", artist: "Traditional", genre: "beginner", difficulty: "Easy" },
  { title: "Jingle Bells", artist: "Traditional", genre: "holiday", difficulty: "Easy" },
  { title: "Silent Night", artist: "Traditional", genre: "holiday", difficulty: "Easy" },
  { title: "Deck the Halls", artist: "Traditional", genre: "holiday", difficulty: "Easy" }
];

  const results = midiCatalog
    .filter(song => {
  const haystack = `${song.title} ${song.artist} ${song.genre}`.toLowerCase();
  return haystack.includes(q);
})
    .map(song => ({
      ...song,
      source: "Cloud Catalog",
      url: "",
      type: "catalog"
    }));

  res.json({ results });
});

app.get("/api/proxy-midi", async (req, res) => {
  const url = String(req.query.url || "");

  if (!url || !/^https?:\/\//i.test(url)) {
    return res.status(400).send("Invalid MIDI URL");
  }

  try {
    const response = await fetch(url);

    if (!response.ok) {
      return res.status(response.status).send("Could not fetch MIDI");
    }

    res.setHeader("Content-Type", "audio/midi");
    response.body.pipe(res);
  } catch (err) {
    res.status(500).send("Proxy error");
  }
});

app.listen(PORT, () => {
  console.log(`Piano Tiles MIDI server running on port ${PORT}`);
});