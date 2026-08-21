# Madazon

Marketplace de quartier : les vendeurs installent leur étal et publient leurs
produits, les acheteurs cherchent et parcourent ce qui est en vente. Les
données sont sauvegardées définitivement grâce à Firebase (Firestore).

## Contenu du projet

- `index.html` — page unique (accueil, produits, inscription, publication)
- `style.css` — design
- `script.js` — logique du site, branchée sur Firestore
- `firebase-config.js` — **à remplir** avec les clés de ton projet Firebase

## Mettre en place le backend (Firebase)

1. Va sur [console.firebase.google.com](https://console.firebase.google.com)
   et connecte-toi avec ton compte Google.
2. Clique sur **Ajouter un projet**, donne-lui un nom (ex. `marche-voisin`),
   puis termine la création (tu peux désactiver Google Analytics, pas
   nécessaire ici).
3. Dans le menu de gauche, clique sur **Compilation (Build) > Firestore
   Database**, puis **Créer une base de données**.
   - Choisis un emplacement proche de toi.
   - Choisis **Démarrer en mode test** (permet la lecture/écriture pendant
     30 jours, suffisant pour démarrer — voir la note sécurité plus bas).
4. Toujours dans la console, clique sur l'icône ⚙️ (Paramètres du projet) en
   haut à gauche, puis **Paramètres du projet**.
5. Fais défiler jusqu'à **Vos applications**, clique sur l'icône **`</>`**
   (Web) pour ajouter une application web. Donne-lui un nom (ex. `site`),
   pas besoin de configurer l'hébergement Firebase.
6. Firebase affiche un bloc de code contenant `firebaseConfig = { ... }`.
   Copie les valeurs (`apiKey`, `authDomain`, `projectId`, etc.) dans le
   fichier `firebase-config.js` du projet, à la place de
   `COLLE_TA_CLE_ICI` et des autres textes similaires.
7. Remets ce fichier à jour sur GitHub (remplace l'ancien `firebase-config.js`
   par le nouveau, comme on l'a fait pour les autres fichiers).

Une fois cette étape faite, les inscriptions et les produits publiés sur le
site sont sauvegardés pour de bon dans Firestore, visibles par tout le monde.

## Note sur la sécurité

Le mode test de Firestore autorise n'importe qui à lire et écrire dans la
base pendant 30 jours — pratique pour démarrer, mais à ne pas laisser tel
quel indéfiniment sur un site public. Une fois le site stable, il faudra
mettre en place des règles de sécurité plus strictes (ou une authentification
des vendeurs). On peut voir ça ensemble plus tard.

## Publier sur GitHub Pages

Déjà fait pour ce projet — le site est en ligne à l'adresse indiquée dans
les paramètres **Pages** du dépôt GitHub.
