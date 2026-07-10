# Pack accords et triades de guitare

## Fichiers à utiliser en priorité

- `processed/chord_positions_by_name.json` : positions regroupées par nom d’accord, classées par fréquence réelle d’utilisation.
- `processed/dadagp_positions_normalized.csv` : une ligne par association accord-position.
- `processed/triads_positions_standard_tuning.json` : triades, groupes de cordes et renversements.
- `code/guitar-engine.js` : fonctions JavaScript de lecture, filtrage et recherche.

L’ordre des cordes est toujours : `[6, 5, 4, 3, 2, 1]`, donc de la corde de Mi grave à la corde de Mi aiguë.

## Contenu du pack

- Lignes brutes DadaGP : **249,305**
- Libellés d’accord distincts : **2,305**
- Associations accord-position distinctes : **9,262**
- Positions de triades générées : **1,114**
- Erreurs de lecture journalisées : **5,405**

## Règles appliquées aux triades

- trois cordes adjacentes ;
- fondamentale, tierce et quinte présentes une fois chacune ;
- position fondamentale, premier ou deuxième renversement déterminé par la note la plus grave ;
- hauteur strictement ascendante de la corde grave vers la corde aiguë ;
- étendue maximale d’une octave ;
- écart maximal de quatre cases entre les frettes appuyées ;
- cases 0 à 24 en accordage standard.

## Attention

DadaGP contient des positions observées dans des tablatures. C’est excellent pour classer les positions par usage, mais une transcription ou un nom d’accord peut parfois être imparfait. Garde donc un validateur théorique et une validation manuelle pour les positions les plus affichées.
