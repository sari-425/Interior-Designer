import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/LegalPage";

export const metadata: Metadata = {
  title: "KI und Partnerlinks",
  description: "Wie ROOMORA KI-Bilder und Partnerlinks kennzeichnet.",
};

export default function TransparencyPage() {
  return (
    <LegalPage title="KI und Partnerlinks">
      <h2>KI-generierte Bilder</h2>
      <p>
        Gestaltungsvorschläge von ROOMORA werden mit Künstlicher Intelligenz erzeugt und als solche gekennzeichnet.
        Sie zeigen eine Idee, wie dein Raum aussehen könnte. Abgebildete Möbel sind in der Regel keine konkreten,
        kaufbaren Produkte.
      </p>
      <h2>Produktvorschläge</h2>
      <p>
        Zu jedem Design schlagen wir ähnliche Produkte vor. Wir behaupten nur dann, dass ein Produkt genau dem im
        Bild entspricht, wenn wir das technisch überprüft haben. Preise und Verfügbarkeit stammen von den Händlern
        und zeigen den Zeitpunkt der letzten Aktualisierung.
      </p>
      <h2>Partnerlinks</h2>
      <p>
        Einige Produktlinks sind Partnerlinks. Kaufst du darüber, erhält ROOMORA unter Umständen eine Provision.
        Für dich ändert sich der Preis nicht. Partnerlinks sind sichtbar gekennzeichnet.
      </p>
      <h2>Beispielinhalte</h2>
      <p>
        Bilder auf der Website sind derzeit gezeichnete Illustrationen. Test- und Demodaten sind stets als solche
        gekennzeichnet und keine echten Händlerangebote.
      </p>
    </LegalPage>
  );
}
