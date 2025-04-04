*Sequelize*: è un ORM per Node.js che supporta i database relazionali come MySQL, PostgreSQL, SQLite e MSSQL. Usa il linguaggio JavaScript e 
permette di definire modelli per le tabelle del database, eseguire query e sincronizzare i dati con il database.  
*Express*: è un framework per Node.js che semplifica lo sviluppo di applicazioni web e API. Fornisce una serie di funzionalità per gestire
le richieste HTTP, definire rotte, gestire i parametri delle richieste e le risposte, e integrare middleware per aggiungere funzionalità.  
*Node.js*: è un ambiente di runtime per eseguire codice JavaScript lato server.  

## Comandi usati:  

`docker-compose up --build`   
Per creare e avviare i container definiti in docker-compose.yml, con l'opzione build crea anche l'immagine dei servizi specificati nel file docker-compose.yml (build: .) che indica di usare il Dockerfile presente nella cartella corrente.

NOTA: Meglio usare il comando sopra (rispetto ai due sotto) perchè così definiamo tutti i servizi che vogliamo creare e avviare in un unico file, inoltre possiamo definire le dipendenze tra i servizi.  

`docker build -t user-service`   
Per creare un'immagine Docker a partire dal Dockerfile presente nella cartella corrente e assegnarle un tag user-service

`docker run -p 8080:8080 user-service`   
Per eseguire un container a partire dall'immagine user-service e mappare la porta 8080 del container sulla porta 8080 dell'host

*Inizializzazione di un progetto Node.js* (il comando crea un file package.json con le impostazioni di default e lo salva nella cartella corrente):
`npm init -y`

### Pacchetti necessari per il progetto fino ad ora:   

`npm i sequelize express dotenv pg body-parser nodemond amqplib`   

## Connessione con pgAdmin:  
*userdb*:
- Creare un nuovo server:
    - Name: nome a piacere
    vai su Connection:
    - Host name/address: localhost
    - Port: 5432
    - Maintenance database: usersdb
    - Username: user
    - Password: password

# RabbitMQ  
### Come avviene il passaggio dei dati tra i microservizi:

Il Client (microservizio che deve richiedere risorse/dati):  

1. Il client invia una richiesta HTTP a /qualcosa (es. /operate)
2. La richiesta viene gestita nell'index.js del client, il quale chiama la produce 
3. La produce è definita nel file microservizio-s.js, che chiama produceMessage(data), i data sono i dati della richiesta HTTP
4. La produceMessage(data) è definita nel producer.js, che produce nella rpcQueue i data della richiesta HTTP

L'RPC Server (il microservizio che deve fornire risorse/dati)  

1. Nel consumer.js:
    -  viene definita la funzione consumeMessage che tramite this.channel.consume è sempre in ascolto per consumare nuovi messaggi che arrivano nella rpcQueue.
    - Viene fatta la query al database per ottenere i dati richiesti dal client
    - Viene chiamata la produce 
2. Nel producer.js vengono prodotti i data sulla replyQueue ( che gli era stata passata dal client nella richiesta come canale di risposta) 

Il Client (microservizio che deve richiedere risorse/dati)  

1. Nel consumer.js è definita la funzione consumeMessage che tramite this.channel.consume è sempre in ascolto per consumare nuovi messaggi che arrivano nella replyQueue.

-------------------------------------------
Le funzioni usate per RabbitMQ devono essere chiamate direttamente da user_repo:  
`const { UserRepo } = require('../user_repo');  `  
` const User = require("../user");  `  
` const userRepo = new UserRepo(User);`   
questo perchè user_service serve solo per estrarre i dati da una richiesta HTTP e chiamare la funzione che fa la query su questi dati. Poi invia la response (aggiungendo status e headers)


# Note 

Nel file consumer.js per risolvere un errore abbiamo dobuto aggiungere 
`const RabbitMQUser = require("./user-s");`  
non all'inizio del file, ma prima di chiamare la funzione produce di RabbitMQUser

-----------------------   

Per sistemare il problema per cui i microservizi partivano prima che RabbitMQ fosse pronto, abbiamo aggiunto un healthcheck per rabbitmq (nel docker-compose.yml) che verifica che il servizio RabbitMQ sia in esecuzione e pronto a ricevere connessioni prima di avviare i microservizi. Le depends_on dei microservizi sono state aggiornate con la condition "service_healthy".  

---------------




# Authentication 

- Per creare l'ACCESS_TOKEN_SECRET nel .env abbiamo usato ` require('crypto').randomBytes(64).toString('hex')` in node. (il .env non viene caricato in git, quindi va creato in locale)

1. Generazione del token:  
    Quando l'utente invia email e password (richiesta a /login), il server verifica le credenziali (la password viene verificata con bcrypt), e se sono corrette, viene generato un token JWT (JSON Web Token) utilizzando la libreria jsonwebtoken (jwt.sign()). Il token contiene le informazioni dell'utente e viene firmato con una chiave segreta (ACCESS_TOKEN_SECRET). Il token viene restituito al client che se lo salva nel sessionStorage.
2. Autenticazione delle richieste:  
    Quando il client invia una richiesta ad un microservizio (diverso da user-service) deve includere il token JWT nell'intestazione Authorization della richiesta HTTP. Il Middleware del microservizio estrae il token dall'intestazione e lo verifica (jwt.verify()) utilizzando la stessa chiave segreta. Se il token è valido, il microservizio può accettare la richiesta e procedere con l'operazione richiesta, estraendo anche le info dell'utente.
    
----------------------------




TODO:

- Header del consumer.js di user-service
- Capire come funziona il passaggio tra i microservizi e aggiungere il middleware per l'autenticazione
- file .env
- Refresh token per il logout
- Rinominare student-service in note-service