import { createServer } from 'http';
import express from 'express';
import cors from 'cors';
import logger from './middlewares/logging.middleware.js';
import bodyParser from 'body-parser';
import fs from 'fs';

const port = 8080;
const server = express();


// Middleware 
server.use(express.urlencoded({extended: true}));
server.use(express.json());
server.use(cors());
server.use(logger);

// Veranstaltungs-Controller einrichten
server.use('/api/v1/veranstaltungen', veranstaltungsRouteController); // Basispfad für Veranstaltungs-Endpunkte

server.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
})

//

// Beispiel
server.get('/', (req, res) => {
  res.send('Hallo');
});


// Datenstruktur für Veranstaltungen initialisieren
let veranstaltungen = [];

// API-Endpunkt: Alle genehmigten Veranstaltungen abfragen, nach Datum sortiert
app.get('/veranstaltungen', (req, res) => {
    const genehmigteVeranstaltungen = veranstaltungen.filter(veranstaltung => veranstaltung.genehmigt).sort((a, b) => new Date(b.datum) - new Date(a.datum));
    res.json(genehmigteVeranstaltungen);
});

// API-Endpunkt: Alle nicht genehmigten Veranstaltungen abfragen
app.get('/veranstaltungen/ausstehend', (req, res) => {
    const ausstehendeVeranstaltungen = veranstaltungen.filter(veranstaltung => !veranstaltung.genehmigt);
    res.json(ausstehendeVeranstaltungen);
});

// API-Endpunkt: Neue Veranstaltung anlegen
app.post('/veranstaltungen', (req, res) => {
    const { name, beschreibung, ort, datum, preis } = req.body;
    if (!name || !beschreibung || !ort || !datum || !preis) { // Überprüfung auf Vollständigkeit
        return res.status(400).send('Pflichtfelder nicht ausgefüllt');
    }
    const neueVeranstaltung = { id: veranstaltungen.length + 1, name, beschreibung, ort, datum, preis: preis || 'Kostenlos', genehmigt: false };
    veranstaltungen.push(neueVeranstaltung);
    res.status(201).json(neueVeranstaltung);
});

// API-Endpunkt: Veranstaltung anhand der ID abfragen
app.get('/veranstaltungen/:id', (req, res) => {
    const veranstaltung = veranstaltungen.find(veranstaltung => veranstaltung.id === parseInt(req.params.id));
    if (!veranstaltung) {
        return res.status(404).send('Veranstaltung nicht gefunden');
    }
    res.json(veranstaltung);
});

// API-Endpunkt: Suche nach Veranstaltungen anhand von Titel oder Ort
app.get('/veranstaltungen/suche', (req, res) => {
    const { query } = req.query;
    const gefilterteVeranstaltungen = veranstaltungen.filter(veranstaltung => veranstaltung.name.includes(query) || veranstaltung.ort.includes(query));
    res.json(gefilterteVeranstaltungen);
});

// API-Endpunkt: Veranstaltung löschen
app.delete('/veranstaltungen/:id', (req, res) => {
    const index = veranstaltungen.findIndex(veranstaltung => veranstaltung.id === parseInt(req.params.id));
    if (index === -1) {
        return res.status(404).send('Veranstaltung nicht gefunden');
    }
    veranstaltungen.splice(index, 1);
    res.status(204).send();
});

// API-Endpunkt: Veranstaltung bearbeiten
app.put('/veranstaltungen/:id', (req, res) => {
    const index = veranstaltungen.findIndex(veranstaltung => veranstaltung.id === parseInt(req.params.id));
    if (index === -1) {
        return res.status(404).send('Veranstaltung nicht gefunden');
    }
    const { name, beschreibung, ort, datum, preis } = req.body;
    veranstaltungen[index] = { ...veranstaltungen[index], name, beschreibung, ort, datum, preis };
    res.json(veranstaltungen[index]);
});

// API-Endpunkt: Veranstaltung genehmigen
app.patch('/veranstaltungen/:id/genehmigen', (req, res) => {
    const veranstaltung = veranstaltungen.find(veranstaltung => veranstaltung.id === parseInt(req.params.id));
    if (!veranstaltung) {
        return res.status(404).send('Veranstaltung nicht gefunden');
    }
    else if (veranstaltung.genehmigt) {
        return res.status(400).send('Veranstaltung bereits genehmigt');

    }

    // Genehmigungslogik
    veranstaltung.genehmigt = true;
    // Veranstaltung als genehmigt  markieren und die Änderungen  speichern
    return res.json(veranstaltung); // Sendet die aktualisierte Veranstaltung zurück

});

// API-Endpunkt für die Übermittlung von externen Daten
app.post('/externe-daten', (req, res) => {
    // Logik zur Verarbeitung externer Daten könnte hier implementiert werden
    res.status(200).send('Endpunkt für externe Daten erreicht');
});

// API-Endpunkt zum Erstellen von Testdaten
app.get('/testdaten-generieren', (req, res) => {
    // Beispiel für das Generieren von Testdaten
    veranstaltungen = [
        { id: 1, name: 'Testveranstaltung 1', beschreibung: 'Dies ist eine Testveranstaltung', ort: 'Heidenheim', datum: '2023-10-01', preis: 'Kostenlos', genehmigt: true },
        { id: 2, name: 'Testveranstaltung 2', beschreibung: 'Eine weitere Testveranstaltung', ort: 'Heidenheim', datum: '2023-11-01', preis: '20 EUR', genehmigt: false }
    ];
    res.status(201).send(veranstaltungen);
});

// Server starten
app.listen(port, () => {
    console.log(`Server läuft auf Port ${port}`);
});













