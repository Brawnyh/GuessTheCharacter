# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Project overview

A static, client-side daily guessing game for superhero characters ("-dle" style), split out of the Dinodle repo. No build step, framework, or backend. **Working name: Heroesdle** (set in one place: `SITE_NAME` in `engine-dc.js`). The owner plans to widen the concept from DC only to well-known superheroes / fictional characters, and to monetize with donations rather than ads (DC characters are Warner Bros. IP). Never use "Wordle" in names or titles (NYT trademark).

Sister site: Dinodle (`C:\Users\Deme\DinosauresWOrdle`, github.com/Brawnyh/Dinodle).

## Structure

| File | Purpose |
|------|---------|
| `index.html` | The game page |
| `dc.js` | Game config: attributes, compare rules, token hints; loads and applies data translations |
| `engine-dc.js` | Engine: UI strings ES/FR/EN, tokens and score, history, stats, images, countdown |
| `data/dc.json` | 309 characters (source language Spanish): DC Comics, Marvel, Image Comics, Independiente (`publisher`), with `powerType` categories |
| `catalog.html` | Searchable list of all characters (no clues) |
| `hero-theme.js` | Comic theme (day→night with attempts, POW!/BOOM!), footer with PayPal and Dinodle link |
| `data/i18n/dc.{en,fr}.json` | `fields` value maps (gender, alignment, team, power, city, realName, creator, nemesis) + `description` by name |
| `styles.css` | Styles |

## Key behaviors

- **Rules**: 15 attempts, tokens at 3/6/10. Universe column (`publisher`). Power: same power = green, same `powerType` = yellow. Two unknown real names never match.
- **Sharing / donations**: share button + social links after a game; PayPal link (`SUPPORT_URL` in engine-dc.js). No ads, no analytics.

- **Daily reset: midnight Europe/Madrid** (`dayNumber()`); target = `dayNumber() % data.length`.
- **Languages**: English first; saved choice (`wordle_lang_v7`), else browser language, else English. Data is translated at load by `localizeData()` in `dc.js`, applied consistently per field so equality comparisons still work.
- **Images**: Wikipedia REST summary API; only standard thumbnail widths (250/330/500/960); only pages that mention comics/superhero/DC are accepted; found URLs cached in `hero_img_cache_v1`. Character images on Wikipedia are mostly non-free (fair use), which matters for monetization.
- **History**: one entry per daily game (`dc-history-v7`), even when the finished game is reopened. Reveal popup shows on every reopen (intended).
- Always use `safeGet`/`safeSet` for localStorage.

## Running locally

```bash
py -m http.server 8766
```
