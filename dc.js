// Spanish is the source language of the data; other languages use a dictionary
// (data/i18n/dc.<lang>.json) applied consistently, so comparisons still work.
function localizeData(data, dict) {
  if (!dict) return data;
  const fields = dict.fields || {}, desc = dict.description || {};
  return data.map(item => {
    const out = Object.assign({}, item);
    Object.keys(fields).forEach(f => {
      if (typeof out[f] === 'string' && fields[f][out[f]] != null) out[f] = fields[f][out[f]];
    });
    if (desc[item.name]) out.description = desc[item.name];
    return out;
  });
}
const getJSON = url => fetch(url).then(r => { if (!r.ok) throw new Error(url + ' ' + r.status); return r.json(); });
const LANG = window.__LANG || 'en';

Promise.all([
  getJSON('data/dc.json'),
  LANG === 'es' ? null : getJSON('data/i18n/dc.' + LANG + '.json').catch(() => null)
])
  .then(([source, dict]) => {
    const data = localizeData(source, dict);
    createGame({
      data,
      gameId: 'dc',
      storageKey: 'dc-daily-v7',
      historyKey: 'dc-history-v7',
      maxAttempts: 20,
      wikiLang: 'en',
      tokens: { at: [3, 6, 12] },
      scoring: { base: 1000, attemptPenalty: 100, attemptInterval: 4, tokenPenalty: 150 },
      wikiUrlFor: item =>
        'https://en.wikipedia.org/wiki/' +
        encodeURIComponent(item.name.split(' (')[0].replace(/ /g, '_')),
      placeholder: (window.__T && window.__T.placeholder) || '',
      attributes: [
        { labelKey: 'realname', display: d => d.realName, translate: false,
          compare: (g, t) => ({ status: g.realName === t.realName ? 'correct' : 'wrong' }) },
        { labelKey: 'gender', display: d => d.gender,
          compare: (g, t) => ({ status: g.gender === t.gender ? 'correct' : 'wrong' }) },
        { labelKey: 'alignment', display: d => d.alignment,
          compare: (g, t) => ({ status: g.alignment === t.alignment ? 'correct' : 'wrong' }) },
        { labelKey: 'first', display: d => d.firstAppearance, translate: false,
          compare: (g, t) => {
            const diff = g.firstAppearance - t.firstAppearance;
            if (diff === 0) return { status: 'correct' };
            const arrow = diff < 0 ? '▲' : '▼';
            return { status: Math.abs(diff) <= 3 ? 'close' : 'wrong', arrow };
          } },
        { labelKey: 'team', display: d => d.team, translate: false,
          compare: (g, t) => ({ status: g.team === t.team ? 'correct' : 'wrong' }) },
        { labelKey: 'power', display: d => d.power,
  compare: (g, t) => {

    if (!g.hasPowers && !t.hasPowers) return { status: 'correct' };

    if (g.hasPowers !== t.hasPowers) return { status: 'wrong' };

    return { status: g.power === t.power ? 'correct' : 'close' };
  } },
        { labelKey: 'city', display: d => d.city, translate: false,
          compare: (g, t) => ({ status: g.city === t.city ? 'correct' : 'wrong' }) }
      ],
      hints: [
        { id: 'creator', at: 0, label: 'Creador',
          render: t => t.creator
            ? '<b>' + t.creator + '</b>'
            : (window.__T ? window.__T.no_data : 'No hay datos') },
        { id: 'firstComic', at: 0, label: 'Primer cómic',
          render: t => t.firstComic
            ? '<b>' + t.firstComic + '</b>'
            : (window.__T ? window.__T.no_data : 'No hay datos') },
        { id: 'quote', at: 0, label: 'Cita famosa',
          render: t => t.quote
            ? '&ldquo;' + t.quote + '&rdquo;'
            : (window.__T ? window.__T.no_data : 'No hay datos') },
        { id: 'description', at: 0, label: 'Descripción',
          render: t => t.description || (window.__T ? window.__T.no_data : 'No hay datos') },
        { id: 'nemesis', at: 0, label: 'Némesis',
          render: t => t.nemesis
            ? '<b>' + t.nemesis + '</b>'
            : (window.__T ? window.__T.no_data : 'No hay datos') },
        { id: 'actors', at: 0, label: 'En pantalla',
          render: t => {
            const T = window.__T || {};
            const parts = [];
            if (t.liveActors && t.liveActors.length) {
              parts.push((T.live_actor || 'acción real') + ': ' + t.liveActors.join(', '));
            }
            if (t.voiceActors && t.voiceActors.length) {
              parts.push((T.voice_actor || 'voz') + ': ' + t.voiceActors.join(', '));
            }
            if (!parts.length) return T.no_actors || 'Sin adaptaciones';
            return parts.join('<br>');
          } }
      ]
    });
  })
  .catch(err => {
    document.getElementById('game').innerHTML =
      '<p style="color:#ff7b72;padding:20px">' + ((window.__T && window.__T.load_error) || 'Could not load the game data.') + '</p>';
    console.error(err);
  });