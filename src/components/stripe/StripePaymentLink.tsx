import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import './StripePaymentLink.css';

function StripePaymentLink() {
  const [stripePaymentLink, setStripePaymentLink] = useState<string | null>(null);

  const token = localStorage.getItem("token") || "";
  const decodedToken = jwtDecode<{ sub: string }>(token);
  const loggedInUser = decodedToken.sub;

  useEffect(() => {
    fetch(`https://shark-app-j7qxa.ondigitalocean.app/${loggedInUser}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Något gick fel när betalningslänken hämtades");
        }
        return res.text();
      })
      .then((url) => setStripePaymentLink(url))
      .catch((error) => console.error("Fel vid hämtning av Stripe-betalningslänk:", error));
  }, [loggedInUser, token]);

  if (!stripePaymentLink) {
    return <p>Laddar...</p>;
  }

  return (
    <div>
        <div className="main-text-stripe">
      <h1>
        Med premium kan du skapa oändligt många spellistor
      </h1>
      </div>
      <a href={stripePaymentLink} rel="noopener noreferrer">
        <button className="button-alwaysshow-stripe">Köp premium för 69 kr/mån</button>
      </a>
      <div className="small-text-stripe">
        <p>
            Den här applikationen använder sig av Stripes egna utvecklar-api och är endast i test-läge.
            När du trycker på länken kommer du att länkas till Stripes egna hemsida.
            För att simulera en verklig betalning, följ anvisningarna som visas när du har tryck på länken.
        </p>
      </div>
    </div>
  );
}

export default StripePaymentLink;