import { createServer } from 'http';
import express from 'express';
import cors from 'cors';
import logger from './middlewares/logging.middleware.js';
import veranstaltungsRouteController from './controllers/veranstaltungs.controller.js';
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

server.listen(port, () => {
  console.log(`Server läuft auf Port ${port}`);
})


// Datenstruktur für Veranstaltungen initialisieren
let veranstaltungen = [];
const auditLogPfad = './audit.txt';

// API-Endpunkt: Alle genehmigten Veranstaltungen abfragen, nach Datum sortiert
server.get('/veranstaltungen', (req, res) => {
    const genehmigteVeranstaltungen = veranstaltungen.filter(veranstaltung => veranstaltung.genehmigt).sort((a, b) => new Date(b.datum) - new Date(a.datum));
    res.json(genehmigteVeranstaltungen);
});

// API-Endpunkt: Alle nicht genehmigten Veranstaltungen abfragen
server.get('/veranstaltungen/ausstehend', (req, res) => {
    const ausstehendeVeranstaltungen = veranstaltungen.filter(veranstaltung => !veranstaltung.genehmigt);
    res.json(ausstehendeVeranstaltungen);
});


// API-Endpunkt: Veranstaltung anhand der ID abfragen
server.get('/veranstaltungen/:id', (req, res) => {
    const veranstaltung = veranstaltungen.find(veranstaltung => veranstaltung.id === parseInt(req.params.id));
    if (!veranstaltung) {
        return res.status(404).send('Veranstaltung nicht gefunden');
    }
    res.json(veranstaltung);
});

// API-Endpunkt: Suche nach Veranstaltungen anhand von Titel oder Ort
server.get('/veranstaltungen/suche', (req, res) => {
    const { query } = req.query;
    const gefilterteVeranstaltungen = veranstaltungen.filter(veranstaltung => veranstaltung.name.includes(query) || veranstaltung.ort.includes(query));
    res.json(gefilterteVeranstaltungen);
});

// API-Endpunkt: Neue Veranstaltung anlegen
server.post('/veranstaltungen', (req, res) => {
    const { name, beschreibung, ort, datum, preis } = req.body;
    if (!name || !beschreibung || !ort || !datum || !preis) { // Überprüfung auf Vollständigkeit
        return res.status(400).send('Pflichtfelder nicht ausgefüllt');
    }
    const neueVeranstaltung = { id: veranstaltungen.length + 1, name, beschreibung, ort, datum, preis: preis || 'Kostenlos', genehmigt: false };
    veranstaltungen.push(neueVeranstaltung);
    res.status(201).json(neueVeranstaltung);
});


// API-Endpunkt: Veranstaltung löschen
server.delete('/veranstaltungen/:id', (req, res) => {
    const index = veranstaltungen.findIndex(veranstaltung => veranstaltung.id === parseInt(req.params.id));
    if (index === -1) {
        return res.status(404).send('Veranstaltung nicht gefunden');
    }
    veranstaltungen.splice(index, 1);
    res.status(204).send();
});

// API-Endpunkt: Veranstaltung bearbeiten
server.put('/veranstaltungen/:id', (req, res) => {
    const index = veranstaltungen.findIndex(veranstaltung => veranstaltung.id === parseInt(req.params.id));
    if (index === -1) {
        return res.status(404).send('Veranstaltung nicht gefunden');
    }
    const { name, beschreibung, ort, datum, preis } = req.body;
    veranstaltungen[index] = { ...veranstaltungen[index], name, beschreibung, ort, datum, preis };
    res.json(veranstaltungen[index]);
});

// API-Endpunkt: Veranstaltung genehmigen
server.patch('/veranstaltungen/:id/genehmigen', (req, res) => {
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
server.post('/externe-daten', (req, res) => {
    // Logik zur Verarbeitung externer Daten könnte hier implementiert werden
    res.status(200).send('Externe Daten übermittelt');
});

// API-Endpunkt zum Erstellen von Testdaten
server.get('/testdaten-generieren', (req, res) => {
    // Beispiel für das Generieren von Testdaten
    veranstaltungen = [
        { id: 1, name: 'Testveranstaltung 1', beschreibung: 'Dies ist eine Testveranstaltung', ort: 'Heidenheim', datum: '2023-10-01', preis: 'Kostenlos', genehmigt: true },
        { id: 2, name: 'Testveranstaltung 2', beschreibung: 'Dies ist eine weitere Testveranstaltung', ort: 'Heidenheim', datum: '2023-11-01', preis: '20 EUR', genehmigt: false }
    ];
    res.status(201).send(veranstaltungen);
});

// Genehmigte Veranstaltung im Audit protokollieren
server.patch('/api/v1/veranstaltungen/:id/genehmigen', (req, res) => {
    const { id } = req.params;
    const veranstaltung = veranstaltungen.find(veranstaltung => veranstaltung.id === parseInt(id));

    if (!veranstaltung) {
        return res.status(404).send('Veranstaltung nicht gefunden');
    }

    // Überprüfen, ob die Veranstaltung bereits genehmigt wurde
    if (veranstaltung.genehmigt) {
        return res.status(400).send('Veranstaltung bereits genehmigt');
    }

    // Veranstaltung als genehmigt markieren
    veranstaltung.genehmigt = true;

    // Protokollieren der Genehmigung in die Audit-Datei
    const logNachricht = `Veranstaltung mit ID ${veranstaltung.id} wurde am ${new Date().toISOString()} genehmigt.\n`;
    fs.appendFile(auditLogPfad, logNachricht, err => {
        if (err) {
            console.error('Fehler beim Schreiben in die Audit-Datei:', err);
            return res.status(500).send('Fehler beim Protokollieren der Genehmigung');
        }

        console.log('Genehmigung protokolliert');
        res.json(veranstaltung); // Sendet die aktualisierte Veranstaltung zurück
    });
});


// Server starten
server.listen(port, () => {
    console.log(`Server läuft auf Port ${port}`);
});













