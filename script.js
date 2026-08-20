// Marché Voisin — logique front-end (démonstration sans serveur)
// Les inscriptions sont conservées en mémoire le temps de la session,
// pas persistées : brancher une vraie base de données / API pour la production.

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
  const statTotal = document.getElementById("stat-total");

  const members = { vendeur: 0, acheteur: 0 };

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

  // Les CTA du hero pré-sélectionnent le bon rôle avant de faire défiler vers le formulaire
  document.querySelectorAll("[data-role]").forEach((cta) => {
    cta.addEventListener("click", () => setRole(cta.dataset.role));
  });

  function updateStats() {
    statVendeurs.textContent = members.vendeur;
    statAcheteurs.textContent = members.acheteur;
    statTotal.textContent = members.vendeur + members.acheteur;
  }

  function addMember(nom, role, detail) {
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

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const nom = document.getElementById("nom").value.trim();
    const email = document.getElementById("email").value.trim();
    const role = roleInput.value;

    if (!nom || !email) {
      confirmation.hidden = false;
      confirmation.textContent = "Merci de renseigner votre nom et votre e-mail.";
      confirmation.style.color = "#E08A73";
      return;
    }

    let detail = "";
    if (role === "vendeur") {
      const boutique = document.getElementById("boutique").value.trim();
      const categorie = document.getElementById("categorie").value;
      detail = boutique ? `${boutique} (${categorie})` : categorie;
    } else {
      const recherche = document.getElementById("recherche").value.trim();
      detail = recherche ? `recherche : ${recherche}` : "";
    }

    addMember(nom, role, detail);
    members[role] += 1;
    updateStats();

    confirmation.hidden = false;
    confirmation.style.color = "";
    confirmation.textContent =
      role === "vendeur"
        ? `Votre étal est installé, ${nom}. Bienvenue sur le marché !`
        : `Inscription confirmée, ${nom}. Vous pouvez commencer à chercher.`;

    form.reset();
    setRole(role);
  });

  setRole("vendeur");
})();
