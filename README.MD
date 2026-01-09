# Backend Web Project - Een API maken voor Inter Milafrique

## Projectbeschrijving
Ik heb gekozen voor een Inter Milafrique API omdat ik zelf lid ben van deze zaalvoetbalploeg die we vorig jaar hebben opgericht. Deze API biedt toegang tot alle informatie over de ploeg en biedt functies zoals:

## API
Inter Milafrique Database De API maakt verbinding met een MySQL database. Voor lokale ontwikkeling kan de database gevuld worden via de Laravel seeder van het hoofdproject.

## Endpoints
***Nieuws***
* `GET /api/nieuws`  Haalt alle nieuwsartikelen op (SEARCH, LIMIT, OFFSET)
* `GET /api/nieuws/:id`  Haalt één specifiek artikel op
* `POST /api/nieuws`  Voegt een nieuw nieuwsbericht toe
* `PUT /api/nieuws:id`  Wijzigt een bestaand nieuwsbericht
* `DELETE /api/nieuws:id`  Verwijdert een nieuwsbericht

***Spelers***
* `GET /api/spelers`  Haalt alle spelers op (SEARCH, LIMIT, OFFSET)
* `GET /api/spelers:id` Haalt details van één speler op
* `POST /api/spelers` Voegt een nieuwe speler toe
* `DELETE /api/spelers/:id` Verwijdert een speler uit het systeem

## Functionele Vereisten
* **Twee CRUD interfaces (Nieuws & Spelers):** De mogelijkheid om voor deze twee entiteiten:
    * Een lijst van alle huidige entiteiten op te halen: **getAllNieuws** en **getAllSpelers** - src/controllers/
    * De details van een entiteit weer te geven: **getNieuwsByid** en **getSpelerById** - src/controllers/
    * Een nieuwe instantie van de entiteit toe te voegen aan de database: **createNieuws** en **createSpeler** - src/controllers/
    * Een bestaande instantie van de entiteit te updaten: **updateNieuws** en **updateSpeler** - src/controllers/
    * Een bestaande instantie van de entiteit te verwijderen: **deleteNieuws** en **deleteSpeler** - src/controllers/
* **Basisvalidatie:** 
    * Velden mogen standaard niet leeg zijn. (if (!titel || !inhoud) - nieuwsController.js) en (if (!naam || !positie || !rugnummer) - spelersController.js)
    * Numerieke velden: Rugnummer
    * Namen kunnen geen cijfers bevatten.
  
* **Limit & Offset:** GET http://localhost:3000/api/spelers?limit=2&offset=1
* **Zoekfunctionaliteit:** Minstens één endpoint (`/api/spelers`) waarbij entiteiten teruggegeven worden na het zoeken op een waarde van minstens één veld (zoals naam of positie).
* **Documentatie pagina:** *index.html*

## Installatiehandleiding
Deze instructies leggen uit hoe u de API lokaal kunt configureren en draaien.

1. **Clone het project vanaf GitHub.** Open een terminal en voer dit commando uit:
    * `git clone https://github.com/davidrugeroehb/inter-milafrique-api.git`

2. **Navigeer naar de projectmap.**
    * `cd inter-milafrique-api`

3. **Installeer de dependencies.**
    * `npm install`

4. **Configureer de environment variables.** Maak een `.env` bestand aan in de root met de volgende inhoud:
    * `DB_HOST=127.0.0.1`
    * `DB_NAME=inter_milafrique`
    * `DB_USER=root`
    * `DB_PASSWORD=`

**Start de server.**
Voer deze commando uit
* `npm run dev`  
  De API is nu bereikbaar op: **http://localhost:3000**

## Bronnenlijst

## Auteur
* **Naam:** [David Rugero]
* **School:** [Erasmushogeschool Brussel]
* **Docent:** [Bert Heyman]
* **Datum:** [09/01/2026]