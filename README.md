# RIKA v2

Anime game companion app — Search, Unscramble, Acronym, FITB, Category.

## Setup

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Replace anime database

Drop your exported Jikan JSON file as `src/data/anime.json`. Format:
```json
[
  {
    "id": 37430,
    "title": "That Time I Got Reincarnated as a Slime",
    "genres": ["Action", "Comedy", "Fantasy"],
    "themes": ["Isekai", "Reincarnation"],
    "demographics": ["Shounen"],
    "characters": ["Rimuru Tempest", "Benimaru", "Chloe Aubert"]
  }
]
```

## Add background video

Place `bg.mp4` in the `public/` folder. The video plays on the Search tab only.

## Features

| Tab | Function |
|-----|----------|
| SEARCH | Live search → click result → popup with copyable title, flippable character names, tags |
| UNSCRAMBLE | Paste scrambled words (e.g. HTTA ITME) → matched titles + EXPAND popup with COPY / PHASE 3 buttons |
| ACRONYM | Type acronym (e.g. TTIGRAAS) → matched titles, exact matches first |
| FITB | Search → each word in title is a clickable copy button |
| CATEGORY | Toggle genre/theme/demographic tags → filtered table with A-Z / length sort, 50 per page |

## PHASE 3 button (Unscramble)
Copies `Character Name - Anime Title` format. Uses the current flipped state of the name.
