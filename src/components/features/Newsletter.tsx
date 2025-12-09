"use client";

import React, { FormEvent } from "react";

export default function Newsletter() {
  // Message de confirmation pour l'inscription à la newsletter
  function displayNewsletterMessage() {
    const messageElement = document.getElementById("confirmationMessage");
    if (messageElement !== null) {
      messageElement.hidden = false;
    }
    const loadingImgElement = document.getElementById("loadImg");
    if (loadingImgElement !== null) {
      loadingImgElement.style.display = "none";
    }
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const url =
      "https://go.formulaire.info/data_user/v5SWqXJ5/cc7VjqH2/preview/recorder.php";

    const loadingImgElement = document.getElementById("loadImg");
    if (loadingImgElement !== null) {
      loadingImgElement.style.display = "block";
    }

    try {
      const response = await fetch("/api/subscribe-newsletter", {
        method: "POST",
        body: new FormData(event.target as HTMLFormElement),
      });

      if (response.ok) {
        console.log("Inscription à la newsletter réussi.");
      } else {
        // Je n'ai pas trouvé de message d'erreur géré côté serveur donc pas de gestion d'erreur pour le front-end
        console.log("Erreur lors de l'inscription à la newsletter.");
      }
      displayNewsletterMessage();
    } catch (error) {
      console.log("error while subscribing to newsletter:", error);
      displayNewsletterMessage();
    }
  };

  return (
    <form
      name="myForm"
      id="newsletterForm"
      onSubmit={handleSubmit}
      className="Form_Inscription_Newsletter_300"
    >
      <input name="nextPageType" value="free" type="hidden" />
      <input
        name="nextPageUrl"
        value="https://www.massagerecu.fr/"
        type="hidden"
      />

      <label hidden htmlFor="email">
        Email :{" "}
      </label>
      <input
        type="email"
        name="INPUT-78223"
        placeholder="Email"
        required
        id="mailArrondi"
      />
      <input type="submit" value="OK" id="validerNewsletter" />
    </form>
  );
}
