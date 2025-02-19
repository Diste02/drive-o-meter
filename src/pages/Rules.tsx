import { Navigation } from "@/components/Navigation";
import SideImages from "@/components/SideImages";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Rules = () => {
  return (
    <div className="page-container">
      <Navigation />
      <SideImages />

      <div className="rules-content">
        <h1 className="rules-title">🚗 Regole di Guida & Sistema Punti</h1>

        <div className="space-y-6">
          <Card className="rules-card">
            <CardHeader>
              <CardTitle className="rules-card-title">📜 Regole Ufficiali</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="rules-list">
                <li><strong>Regola n.1</strong> → Se usi software supportabili solo da Apple sei handicappato!! Chiudi tutto e stasera guidi!!!</li>
                <li><strong>Regola n.2</strong> → Chiedere informazioni sul funzionamento prima di tatarare il foglio.</li>
                <li><strong>Regola n.3</strong> → Nelle tabelle compilare solo con i dati della guidata. <strong>NON MODIFICARE LE COLONNE PUNTEGGI</strong> (è tutto automatico, basta inserire distanza, tipo serata e numero partecipanti).</li>
                <li><strong>Regola n.4</strong> → Sotto il grafico sono riportate le tabelle personali con precisazioni.</li>
                <li><strong>Regola n.5</strong> → Ogni volta che viene aggiornata la tabella, riportare la data dell'aggiornamento nella casella dedicata e chi l'ha modificata.</li>
                <li><strong>Regola n.6</strong> → Ricordarsi di scrivere il tipo di serata con la prima lettera maiuscola e senza errori grammaticali (il programma è key-sensitive).</li>
                <li><strong>Regola n.7</strong> → Gyn Tonyc.</li>
                <li><strong>Regola n.8</strong> → Le ragazze sono escluse dalla conta dei partecipanti.</li>
                <li><strong>Regola n.9</strong> → Le vacanze non sono da includere nei conteggi della tabella.</li>
                <li><strong>Regola n.10</strong> → Una serata è da conteggiare se il numero di partecipanti della tabella è pari o superiore a 3.</li>
                <li><strong>Regola n.11</strong> → I partecipanti da inserire nel conteggio sono solo quelli presenti nella tabella.</li>
                <li><strong>Regola n.12</strong> → I passaggi vanno riservati in primis ai membri della tabella. Se avanza posto si possono portare altre persone, regola violabile pena la rinuncia di punti per quella guidata.</li>
                <li><strong>Regola n.13</strong> → La serata è da ritenersi alcolica quando si spinge forte. Se per te bere un paio di birre al cortile è una serata alcolica, vai a fanculo.</li>
                <li><strong>Regola n.14</strong> → Se toccherebbe a una persona guidare ma suddetta persona non vuole, quella sera un altro partecipante può offrirsi di guidare al posto suo ricevendo <strong>5 punti bonus</strong> che vengono scalati dalla persona che si è rifiutata di guidare.</li>
                <li><strong>Regola n.33</strong> → Se una cosa esiste, allora ne esiste anche la versione alcolica.</li>
                <li><strong>Regola n.34</strong> → Se una cosa esiste, allora ne esiste anche la versione porno.</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

};

export default Rules;
