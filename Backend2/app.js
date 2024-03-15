/* import express from 'express';
import cors from 'cors';
import logger from './middlewares/logging.middleware.js';
import veranstaltungsRouteController from './controllers/veranstaltungs.controller.js';*/
//import fs from 'fs';
const fs = require("fs");

const express = require("express");
const cors = require("cors");
// const logger = require('./middleware/logging.middleware.js');
// const veranstaltungsRouteController = require("./controller/veranstaltungs.controller.js")

const port = 8080;
const server = express();

// Middleware 
server.use(express.urlencoded({extended: true}));
server.use(express.json());
server.use(cors());
 // server.use(logger);

// Veranstaltungs-Controller einrichten
// server.use('/api/v1/veranstaltungen', veranstaltungsRouteController); // Basispfad für Veranstaltungs-Endpunkte


server.listen(port, () => {
  console.log(`Server läuft auf Port ${port}`);
})


// Datenstruktur für Veranstaltungen initialisieren
let veranstaltungen = require("./veranstaltung.json");
const auditLogPfad = './audit.txt';

// API-Endpunkt: Alle genehmigten Veranstaltungen abfragen, nach Datum sortiert
server.get('/api/v1/veranstaltungen', (req, res) => {
    const genehmigteVeranstaltungen = veranstaltungen.filter(veranstaltung => veranstaltung.genehmigt).sort((a, b) => new Date(b.datum) - new Date(a.datum));
    res.json(genehmigteVeranstaltungen);
});

// API-Endpunkt: Alle nicht genehmigten Veranstaltungen abfragen
server.get('/api/v1/veranstaltungen/ausstehend', (req, res) => {
    const ausstehendeVeranstaltungen = veranstaltungen.filter(veranstaltung => !veranstaltung.genehmigt);
    res.json(ausstehendeVeranstaltungen);
});


// API-Endpunkt: Veranstaltung anhand der ID abfragen
server.get('/api/v1/veranstaltungen/:id', (req, res) => {
    const veranstaltung = veranstaltungen.find(veranstaltung => veranstaltung.id === parseInt(req.params.id));
    if (!veranstaltung) {
        return res.status(404).send('Veranstaltung nicht gefunden');
    }
    res.json(veranstaltung);
});

// API-Endpunkt: Suche nach Veranstaltungen anhand von Titel oder Ort
server.get('/api/v1/veranstaltungen/suche', (req, res) => {
    const { query } = req.query;
    const gefilterteVeranstaltungen = veranstaltungen.filter(veranstaltung => veranstaltung.name.includes(query) || veranstaltung.ort.includes(query));
    res.json(gefilterteVeranstaltungen);
});

// API-Endpunkt: Neue Veranstaltung anlegen
server.post('/api/v1/veranstaltungen', (req, res) => {
    const { name, beschreibung, ort, datum, preis } = req.body;
    if (!name || !beschreibung || !ort || !datum || !preis) { // Überprüfung auf Vollständigkeit
        return res.status(400).send('Bitte alle Pflichtfelder ausfüllen');
    }
    const neueVeranstaltung = { id: veranstaltungen.length + 1, name, beschreibung, ort, datum, preis: preis || 'Kostenlos', genehmigt: false };
   
   // Alle Veranstaltungen aus der veranstaltung.json lesen
    fs.readFile("veranstaltung.json", "utf8", (err, data) => {
        if (err) {
          return res
            .status(500)
            .json({ error: "Fehler beim Lesen der Veranstaltungen" });
        }
    const veranstaltung = JSON.parse(data);
    
    // Veranstaltung in die veranstaltung.json schreiben
    veranstaltungen.push(neueVeranstaltung);
    fs.writeFile("veranstaltung.json", JSON.stringify(veranstaltungen, null, 2), (err) => {
        if (err) {
          return res
            .status(500)
            .json({ error: "Fehler beim Speichern der Veranstaltung" });
        }
  
        res.status(201).json(neueVeranstaltung);
      });
    });
});
  
  

    // Neues Oberevent, um Metadaten in der JSON zu speichern
    /*const newEvent = {
      createdOn: req.hostname,
      createdBy: req.ip,
      softwareVersion: null,
      entry: newEventInfos,
    };*/


// API-Endpunkt: Veranstaltung löschen

server.delete('/api/v1/veranstaltungen/:id', (req, res) => {
    // Alle Veranstaltungen aus der veranstaltung.json lesen
    fs.readFile("veranstaltung.json", "utf8", (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Fehler beim Lesen der Veranstaltungen" });
        }
        const veranstaltungen = JSON.parse(data);

        const index = veranstaltungen.findIndex(veranstaltung => veranstaltung.id === parseInt(req.params.id));
        if (index === -1) {
            return res.status(404).send('Veranstaltung nicht gefunden');
        }

        // Veranstaltung aus dem Array entfernen
        veranstaltungen.splice(index, 1);

        // Aktualisierte Liste in die veranstaltung.json schreiben
        fs.writeFile("veranstaltung.json", JSON.stringify(veranstaltungen, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: "Fehler beim Speichern der Änderungen" });
            }
            res.status(200).send('Veranstaltung wurde gelöscht');
        });
    });
});


//API-Endpunkt: Veranstaltung bearbeiten
server.put('/api/v1/veranstaltungen/:id', (req, res) => {
    fs.readFile("veranstaltung.json", "utf8", (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Fehler beim Lesen der Veranstaltungen" });
        }

        const veranstaltungen = JSON.parse(data);
        const index = veranstaltungen.findIndex(veranstaltung => veranstaltung.id === parseInt(req.params.id));

        if (index === -1) {
            return res.status(404).send('Veranstaltung nicht gefunden');
        }

        const updatedEvent = { ...veranstaltungen[index], ...req.body };
        veranstaltungen[index] = updatedEvent;

        fs.writeFile("veranstaltung.json", JSON.stringify(veranstaltungen, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: "Fehler beim Speichern der Veranstaltung" });
            }

            res.json(updatedEvent);
        });
    });
});


// API-Endpunkt für die Übermittlung von externen Daten
server.post('/api/v1/veranstaltungen/externe-daten', (req, res) => {
    // Logik zur Verarbeitung externer Daten könnte hier implementiert werden
    res.status(200).send('Externe Daten übermittelt');
});


// API-Endpunkt zum Erstellen von Testdaten//funktioniert aus unerklärlichen Gründen nicht 
server.get('/api/v1/veranstaltungen/testdaten-generieren', (req, res) => {
    // Existierende Daten lesen
    fs.readFile("veranstaltung.json", "utf8", (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Fehler beim Lesen der vorhandenen Veranstaltungen" });
        }

        const existierendeVeranstaltungen = JSON.parse(data);
        let maxId = existierendeVeranstaltungen.reduce((max, veranstaltung) => Math.max(max, veranstaltung.id), 0);
        console.log(maxId)

        // Testdaten mit eindeutigen IDs hinzufügen
        const testVeranstaltungen = [
            { id: ++maxId, name: 'Testveranstaltung 1', beschreibung: 'Dies ist eine Testveranstaltung', ort: 'Heidenheim', datum: '2023-10-01', preis: 'Kostenlos', genehmigt: true },
            { id: ++maxId, name: 'Testveranstaltung 2', beschreibung: 'Dies ist eine weitere Testveranstaltung', ort: 'Heidenheim', datum: '2023-11-01', preis: '20 EUR', genehmigt: false }
        ];

        // Kombiniere existierende und Testdaten
        const aktualisierteVeranstaltungen = [...existierendeVeranstaltungen, ...testVeranstaltungen];

        // Kombinierte Daten in die veranstaltung.json schreiben
        fs.writeFile("veranstaltung.json", JSON.stringify(aktualisierteVeranstaltungen, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: "Fehler beim Speichern der aktualisierten Veranstaltungen" });
            }

            // Testdaten als Antwort zurückgeben
            res.status(201).json(testVeranstaltungen);
        });
    });
});

//API-Endpunkt: Veranstaltungen genehmigen und protokollieren 
server.patch('/api/v1/veranstaltungen/:id/genehmigen', (req, res) => {
    fs.readFile("veranstaltung.json", "utf8", (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Fehler beim Lesen der Veranstaltungen" });
        }

        const veranstaltungen = JSON.parse(data);
        const index = veranstaltungen.findIndex(veranstaltung => veranstaltung.id === parseInt(req.params.id));

        if (index === -1) {
            return res.status(404).send('Veranstaltung nicht gefunden');
        }

        const veranstaltung = veranstaltungen[index];

        if (veranstaltung.genehmigt) {
            return res.status(400).send('Veranstaltung bereits genehmigt');
        }

        // Genehmigungslogik
        veranstaltung.genehmigt = true;

        // Protokollieren der Genehmigung in die Audit-Datei
        const logNachricht = `Veranstaltung mit ID ${veranstaltung.id} wurde am ${new Date().toISOString()} genehmigt.\n`;
        fs.appendFile(auditLogPfad, logNachricht, err => {
            if (err) {
                console.error('Fehler beim Schreiben in die Audit-Datei:', err);
                return res.status(500).send('Fehler beim Protokollieren der Genehmigung');
            }
            console.log('Genehmigung protokolliert');

            // Speichere die aktualisierten Daten zurück in die Datei, nachdem die Genehmigung protokolliert wurde
            fs.writeFile("veranstaltung.json", JSON.stringify(veranstaltungen, null, 2), (err) => {
                if (err) {
                    return res.status(500).json({ error: "Fehler beim Speichern der Veranstaltung" });
                }

                res.json(veranstaltung); // Sendet die aktualisierte Veranstaltung zurück
            });
        });
    });
});














