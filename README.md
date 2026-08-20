# Marché Voisin

Site vitrine pour une marketplace de quartier : les vendeurs installent leur
étal, les acheteurs s'inscrivent pour trouver des produits près de chez eux.

## Contenu du projet

- `index.html` — page unique (accueil, présentation, formulaire d'inscription)
- `style.css` — design (palette, typographie, mise en page)
- `script.js` — bascule vendeur / acheteur, validation du formulaire, liste des inscrits

## État actuel

C'est un front-end statique : le formulaire fonctionne et affiche les
inscriptions à l'écran, mais rien n'est sauvegardé — les données disparaissent
au rechargement de la page. Pour un vrai site, il faudra brancher un backend
(API + base de données) qui reçoit les inscriptions du formulaire et les
stocke réellement.

## Lancer le site en local

Aucune installation nécessaire : ouvrir `index.html` dans un navigateur.

## Publier sur GitHub Pages

1. Créer un dépôt GitHub et y pousser ces fichiers.
2. Dans les paramètres du dépôt, aller dans **Pages**.
3. Choisir la branche `main` et le dossier racine (`/`) comme source.
4. Le site sera disponible à l'adresse fournie par GitHub Pages après
   quelques minutes.

## Prochaines étapes possibles

- Ajouter un vrai backend pour enregistrer vendeurs et acheteurs.
- Ajouter une page de connexion.
- Permettre aux vendeurs de publier des produits, et aux acheteurs de les
  parcourir.
