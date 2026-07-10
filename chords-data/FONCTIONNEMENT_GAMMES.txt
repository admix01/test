ONGLET GAMMES — FONCTIONNEMENT
================================

Le pack contient désormais 43 gammes.

Fichiers principaux :

    data/scales.json
    data/LISTE_GAMMES.txt
    engines/scale-engine.js
    examples/example-scales.js

Contrairement aux accords, les positions ne sont pas stockées une par une.

Chaque gamme est enregistrée sous forme de formule d'intervalles.

Exemple :

    Pentatonique mineure
    1 - b3 - 4 - 5 - b7
    [0, 3, 5, 7, 10] demi-tons

Le moteur reçoit :

    - une fondamentale ;
    - une gamme ;
    - un accordage ;
    - une première et une dernière frette.

Il calcule ensuite toutes les cases du manche appartenant à cette gamme.

Exemple :

    fondamentale : A
    gamme         : minorPentatonic
    frettes       : 0 à 24

Résultat musical :

    A - C - D - E - G

Chaque case retournée contient :

    - le numéro de corde ;
    - le numéro de frette ;
    - la note ;
    - l'intervalle ;
    - le numéro MIDI ;
    - l'indication fondamentale ou non.

Les catégories intégrées sont :

    - gammes majeures et mineures ;
    - pentatoniques ;
    - blues ;
    - modes de la gamme majeure ;
    - modes de la mineure mélodique ;
    - modes de la mineure harmonique ;
    - gammes bebop ;
    - gammes symétriques ;
    - gammes traditionnelles ou exotiques ;
    - pentatoniques japonaises et autres gammes du monde.

Pour l'interface, l'onglet Gammes peut proposer :

    Fondamentale
    Type de gamme
    Accordage
    Nombre de frettes
    Affichage des notes
    Affichage des intervalles
    Mise en évidence de la fondamentale
    Manche complet ou zone limitée

Le moteur peut afficher toutes les notes de la gamme sur le fretboard, sans problème
de jouabilité simultanée : les notes d'une gamme sont généralement jouées l'une après
l'autre.

Un futur fichier scale-patterns.json pourra être ajouté pour enregistrer des formes
pédagogiques précises :

    - cinq positions pentatoniques ;
    - positions CAGED ;
    - trois notes par corde ;
    - positions modales.

La base actuelle est déjà suffisante pour le visualisateur complet du manche.
