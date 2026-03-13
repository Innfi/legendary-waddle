# CLAUDE.md — github-stats-svg

## Role
You are implementing the `github-stats-svg` project story by story.
Each time you are invoked, you will be told which story to implement (its `id`).

## Workflow
1. Read `prd.json` and find the story matching the given id.
2. Implement exactly what the story describes — no more, no less.
3. Do not modify stories other than marking the current one complete.
4. When the implementation is done, mark the story `"status": "complete"` in `prd.json`.
5. Stage and commit all new/changed files with message: `feat(<story-id>): <story-title>`.

## Rules
- Work only inside this repository.
- Do not install packages beyond what each story explicitly allows.
- Do not create files not mentioned in the story.
- Do not refactor or touch code from previously completed stories unless the current story explicitly requires it.
- If a story says "runnable standalone", verify the script can be imported without side effects and has a `if __name__ == "__main__":` guard.
- All Python files must pass `ruff check` with no errors (ruff is available in the environment; install it via `pip install ruff` if needed).
- SVG output must be valid XML (well-formed).

## File layout
```
.
├── .github/
│   └── workflows/
│       └── stats.yml        # story: github-action
├── stats/
│   ├── fetch.py             # story: fetch-stats
│   ├── render.py            # story: render-svg
│   ├── requirements.txt     # story: fetch-stats
│   └── stats.svg            # generated output (committed by action)
├── README.md                # story: readme-embed
├── prd.json
├── CLAUDE.md
└── ralph.sh
```

## Definition of done per story
- `fetch-stats`: `python stats/fetch.py` exits 0, `stats/data.json` is written with correct shape.
- `render-svg`: `python stats/render.py` exits 0, `stats/stats.svg` is written and is valid XML.
- `github-action`: `.github/workflows/stats.yml` exists and is valid YAML.
- `readme-embed`: `README.md` exists and contains the image embed.
