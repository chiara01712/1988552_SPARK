*Sequelize*: è un ORM per Node.js che supporta i database relazionali come MySQL, PostgreSQL, SQLite e MSSQL. Usa il linguaggio JavaScript e 
permette di definire modelli per le tabelle del database, eseguire query e sincronizzare i dati con il database.  
*Express*: è un framework per Node.js che semplifica lo sviluppo di applicazioni web e API. Fornisce una serie di funzionalità per gestire
le richieste HTTP, definire rotte, gestire i parametri delle richieste e le risposte, e integrare middleware per aggiungere funzionalità.  
*Node.js*: è un ambiente di runtime per eseguire codice JavaScript lato server.  

**Comandi usati**:  

`docker-compose up --build`   
Per creare e avviare i container definiti in docker-compose.yml, con l'opzione build crea anche l'immagine dei servizi specificati nel file docker-compose.yml (build: .) che indica di usare il Dockerfile presente nella cartella corrente.

NOTA: Meglio usare il comando sopra (rispetto ai due sotto) perchè così definiamo tutti i servizi che vogliamo creare e avviare in un unico file, inoltre possiamo definire le dipendenze tra i servizi.  

`docker build -t user-service`   
Per creare un'immagine Docker a partire dal Dockerfile presente nella cartella corrente e assegnarle un tag user-service

`docker run -p 8080:8080 user-service`   
Per eseguire un container a partire dall'immagine user-service e mappare la porta 8080 del container sulla porta 8080 dell'host

*Inizializzazione di un progetto Node.js* (il comando crea un file package.json con le impostazioni di default e lo salva nella cartella corrente):
`npm init -y`

**Pacchetti necessari per il progetto fino ad ora**:   
`npm i sequelize express dotenv pg body-parser nodemond`   

**Connessione con pgAdmin**:
*userdb*:
- Creare un nuovo server:
    - Name: nome a piacere
    vai su Connection:
    - Host name/address: localhost
    - Port: 5432
    - Maintenance database: usersdb
    - Username: user
    - Password: password
