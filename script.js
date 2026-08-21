// Marché Voisin — logique front-end branchée sur Firebase Firestore.
// Tant que firebase-config.js n'a pas été rempli avec de vraies clés,
// les formulaires afficheront une erreur de connexion : c'est normal.

(function () {
  const roleButtons = document.querySelectorAll("[data-role-btn]");
  const roleFields = document.querySelectorAll("[data-role-field]");
  const roleInput = document.getElementById("role");
  const form = document.getElementById("registration-form");
  const confirmation = document.getElementById("form-confirmation");
  const memberListItems = document.getElementById("member-list__items");
  const memberListEmpty = document.getElementById("member-list__empty");

  const statVendeurs = document.getElementById("stat-vendeurs");
  const statAcheteurs = document.getElementById("stat-acheteurs");
  const statProduits = document.getElementById("stat-produits");

  const productForm = document.getElementById("product-form");
  const productConfirmation = document.getElementById("product-confirmation");
  const produitsGrid = document.getElementById("produits-grid");
  const produitsEmpty = document.getElementById("produits-empty");
  const produitRecherche = document.getElementById("produit-recherche");
  const produitFiltreCategorie = document.getElementById("produit-filtre-categorie");

  const categorieLabels = {
    alimentation: "Alimentation",
    artisanat: "Artisanat",
    vetements: "Vêtements",
    maison: "Maison & déco",
    autre: "Autre",
  };

  let tousLesProduits = [];

  /* ---------- Bascule vendeur / acheteur ---------- */
  function setRole(role) {
    roleInput.value = role;
    roleButtons.forEach((btn) => {
      const isActive = btn.dataset.roleBtn === role;
      btn.classList.toggle("is-active", isActive);
      btn.setAttribute("aria-selected", String(isActive));
    });
    roleFields.forEach((field) => {
      field.hidden = field.dataset.roleField !== role;
    });
  }

  roleButtons.forEach((btn) => {
    btn.addEventListener("click", () => setRole(btn.dataset.roleBtn));
  });

  document.querySelectorAll("[data-role]").forEach((cta) => {
    cta.addEventListener("click", () => setRole(cta.dataset.role));
  });

  setRole("vendeur");

  /* ---------- Inscription (sauvegardée dans Firestore) ---------- */
  function addMemberToList(nom, role, detail) {
    if (memberListEmpty) memberListEmpty.remove();
    const li = document.createElement("li");
    const tag = document.createElement("span");
    tag.className = `member-tag member-tag--${role}`;
    tag.textContent = role === "vendeur" ? "Vendeur" : "Acheteur";
    const text = document.createElement("span");
    text.textContent = detail ? `${nom} — ${detail}` : nom;
    li.append(tag, text);
    memberListItems.prepend(li);
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const nom = document.getElementById("nom").value.trim();
    const email = document.getElementById("email").value.trim();
    const role = roleInput.value;

    if (!nom || !email) {
      confirmation.hidden = false;
      confirmation.style.color = "#E08A73";
      confirmation.textContent = "Merci de renseigner votre nom et votre e-mail.";
      return;
    }

    const data = { nom, email, role, createdAt: firebase.firestore.FieldValue.serverTimestamp() };
    let detail = "";

    if (role === "vendeur") {
      data.boutique = document.getElementById("boutique").value.trim();
      data.categorie = document.getElementById("categorie").value;
      detail = data.boutique ? `${data.boutique} (${categorieLabels[data.categorie]})` : categorieLabels[data.categorie];
    } else {
      data.recherche = document.getElementById("recherche").value.trim();
      detail = data.recherche ? `recherche : ${data.recherche}` : "";
    }

    try {
      await db.collection("membres").add(data);
      confirmation.hidden = false;
      confirmation.style.color = "";
      confirmation.textContent =
        role === "vendeur"
          ? `Votre étal est installé, ${nom}. Pensez à publier vos produits ci-dessous !`
          : `Inscription confirmée, ${nom}. Vous pouvez commencer à chercher.`;
      form.reset();
      setRole(role);
    } catch (err) {
      confirmation.hidden = false;
      confirmation.style.color = "#E08A73";
      confirmation.textContent = "La connexion à la base de données a échoué. Vérifiez firebase-config.js.";
      console.error(err);
    }
  });

  /* ---------- Écoute en direct des inscriptions ---------- */
  function ecouterMembres() {
    db.collection("membres").orderBy("createdAt", "desc").onSnapshot(
      (snapshot) => {
        memberListItems.innerHTML = "";
        let vendeurs = 0;
        let acheteurs = 0;

        if (snapshot.empty) {
          const li = document.createElement("li");
          li.className = "member-list__empty";
          li.id = "member-list__empty";
          li.textContent = "Aucune inscription pour l'instant — soyez le premier à installer votre étal.";
          memberListItems.appendChild(li);
        }

        snapshot.forEach((doc) => {
          const m = doc.data();
          if (m.role === "vendeur") {
            vendeurs++;
            const detail = m.boutique ? `${m.boutique} (${categorieLabels[m.categorie] || m.categorie})` : "";
            addMemberToList(m.nom, "vendeur", detail);
          } else {
            acheteurs++;
            const detail = m.recherche ? `recherche : ${m.recherche}` : "";
            addMemberToList(m.nom, "acheteur", detail);
          }
        });

        statVendeurs.textContent = vendeurs;
        statAcheteurs.textContent = acheteurs;
      },
      (err) => console.error("Erreur de lecture des membres :", err)
    );
  }

  /* ---------- Publier un produit ---------- */
  productForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const boutique = document.getElementById("produit-boutique").value.trim();
    const nom = document.getElementById("produit-nom").value.trim();
    const prix = parseFloat(document.getElementById("produit-prix").value);
    const categorie = document.getElementById("produit-categorie").value;
    const description = document.getElementById("produit-description").value.trim();

    if (!boutique || !nom || Number.isNaN(prix)) {
      productConfirmation.hidden = false;
      productConfirmation.style.color = "#E08A73";
      productConfirmation.textContent = "Merci de renseigner au moins la boutique, le nom du produit et le prix.";
      return;
    }

    try {
      await db.collection("produits").add({
        boutique,
        nom,
        prix,
        categorie,
        description,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
      productConfirmation.hidden = false;
      productConfirmation.style.color = "";
      productConfirmation.textContent = `${nom} est maintenant visible sur le marché.`;
      productForm.reset();
    } catch (err) {
      productConfirmation.hidden = false;
      productConfirmation.style.color = "#E08A73";
      productConfirmation.textContent = "La connexion à la base de données a échoué. Vérifiez firebase-config.js.";
      console.error(err);
    }
  });

  /* ---------- Affichage et filtrage des produits ---------- */
  function rendreProduits() {
    const recherche = produitRecherche.value.trim().toLowerCase();
    const categorie = produitFiltreCategorie.value;

    const filtres = tousLesProduits.filter((p) => {
      const correspondCategorie = categorie === "toutes" || p.categorie === categorie;
      const correspondRecherche =
        !recherche ||
        p.nom.toLowerCase().includes(recherche) ||
        p.boutique.toLowerCase().includes(recherche) ||
        (p.description || "").toLowerCase().includes(recherche);
      return correspondCategorie && correspondRecherche;
    });

    produitsGrid.innerHTML = "";

    if (filtres.length === 0) {
      const p = document.createElement("p");
      p.className = "produits__empty";
      p.textContent =
        tousLesProduits.length === 0
          ? "Aucun produit pour l'instant — soyez le premier vendeur à en publier un."
          : "Aucun produit ne correspond à votre recherche.";
      produitsGrid.appendChild(p);
      return;
    }

    filtres.forEach((p) => {
      const card = document.createElement("article");
      card.className = "produit-card";
      card.innerHTML = `
        <span class="produit-card__categorie">${categorieLabels[p.categorie] || p.categorie}</span>
        <h3 class="produit-card__nom">${escapeHTML(p.nom)}</h3>
        <p class="produit-card__prix">${p.prix.toFixed(2)} €</p>
        ${p.description ? `<p class="produit-card__description">${escapeHTML(p.description)}</p>` : ""}
        <p class="produit-card__boutique">Vendu par ${escapeHTML(p.boutique)}</p>
      `;
      produitsGrid.appendChild(card);
    });
  }

  function escapeHTML(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function ecouterProduits() {
    db.collection("produits").orderBy("createdAt", "desc").onSnapshot(
      (snapshot) => {
        tousLesProduits = snapshot.docs.map((doc) => doc.data());
        statProduits.textContent = tousLesProduits.length;
        rendreProduits();
      },
      (err) => console.error("Erreur de lecture des produits :", err)
    );
  }

  produitRecherche.addEventListener("input", rendreProduits);
  produitFiltreCategorie.addEventListener("change", rendreProduits);

  /* ---------- Démarrage ---------- */
  if (typeof db !== "undefined") {
    ecouterMembres();
    ecouterProduits();
  } else {
    console.error("Firestore n'est pas configuré — voir firebase-config.js");
  }
})();
