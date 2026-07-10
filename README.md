# Dictionnaire de données

## DadaGP normalisé

- `shape` : six valeurs séparées par des points, corde 6 vers corde 1.
- `usage_count` : nombre d’occurrences observées.
- `song_or_track_count` : nombre de fichiers distincts.
- `usage_rank_for_chord` : rang de la position pour cet accord.
- `pressed_fret_span` : différence entre la plus haute et la plus basse frette appuyée.
- `playable_span_4` : vrai si l’écart ne dépasse pas quatre cases.
- `open_plus_high_position` : mélange d’une corde à vide avec une position appuyée à partir de la case 6.

## Triades

- `quality` : major, minor, diminished ou augmented.
- `inversion` : root, first ou second.
- `strings` : groupe de trois cordes adjacentes.
- `bass_note` : note réellement la plus grave.
- `pitch_range_semitones` : étendue entre la note la plus grave et la plus aiguë.
