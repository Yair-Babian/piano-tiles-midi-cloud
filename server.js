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
  const q = String(req.query.q || "").trim();

  if (!q) {
    return res.json({ results: [] });
  }

  const results = [
    {
      title: `${q} - MIDI search result`,
      artist: "Unknown",
      source: "Demo Provider",
      url: "",
      type: "demo"
    }
  ];

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