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

`npm i sequelize express dotenv pg body-parser nodemond amqplib bcryptjs jsonwebtoken cors`   

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

# Struttura del progetto:
Per ogni microservizio abbiamo una cartella con il nome del microservizio (es. user-service) che contiene:
- La **cartella public** per i file html e css, e per i file javascript lato client
- La **cartella src** per i file javascript lato server, in particolare:
    - *microservizio*_repo.js: file che serve per fare le query al database
    - *microservizio*_route.js: file che contiene le rotte del microservizio e le funzioni che gestiscono le richieste HTTP
    - *microservizio*_service.js: file che contiene le funzioni che gestiscono la logica del microservizio e le chiamate al database tramite il file *_repo.js
    - *microservizio*.js: file che contiene la definizione dei modelli del database (le tabelle)
- Nella cartella src c'è una **cartella rabbitmq** che contiene i file per la comunicazione tra i microservizi tramite RabbitMQ:
    - producer.js: file che contiene le funzioni per produrre messaggi su RabbitMQ
    - consumer.js: file che contiene le funzioni per consumare messaggi da RabbitMQ
    - *microservizio-s*.js: file che contiene le funzioni per gestire la comunicazione tra i microservizi tramite RabbitMQ (produce e consume)
- File **package.json** per definire i pacchetti necessari per il microservizio e gli script per avviare il microservizio.
- File **Dockerfile** per definire come costruire l'immagine del microservizio  
- File **index.js** per avviare il server del microservizio in ascolto su una porta specifica.  
- File **config.js** per definire la configurazione di rabbitMQ


Il **docker-compose.yml** contiene la definizione dei servizi (microservizi) e delle loro dipendenze, della rete e del database. Per ogni servizio viene specificato il Dockerfile da usare per costruire l'immagine del servizio, le porte da esporre, le variabili d'ambiente e le dipendenze dai servizi. Inoltre, viene definito un volume per il database in modo che i dati siano persistenti anche dopo la chiusura del container.   
## Microservizi
1. User-service
2. Note-service (student)
3. Course-service(professor)


# RabbitMQ  
### Come avviene il passaggio dei dati tra i microservizi:

Il Client (microservizio che deve richiedere risorse/dati):  

1. Il client invia una richiesta HTTP a /*qualcosa* (es. /getUsername)
2. La richiesta viene gestita nel *microservizio*_route.js del client, il quale chiama la produce 
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
```
const { UserRepo } = require('../user_repo');    
const User = require("../user");    
const userRepo = new UserRepo(User);
```
questo perchè user_service serve solo per estrarre i dati da una richiesta HTTP e chiamare la funzione che fa la query su questi dati. Poi invia la response (aggiungendo status e headers)


# Note 

Nel file consumer.js per risolvere un errore abbiamo dobuto aggiungere 
`const RabbitMQUser = require("./user-s");`  
non all'inizio del file, ma prima di chiamare la funzione produce di RabbitMQUser

-----------------------   

Per sistemare il problema per cui i microservizi partivano prima che RabbitMQ fosse pronto, abbiamo aggiunto un healthcheck per rabbitmq (nel docker-compose.yml) che verifica che il servizio RabbitMQ sia in esecuzione e pronto a ricevere connessioni prima di avviare i microservizi. Le depends_on dei microservizi sono state aggiornate con la condition "service_healthy".  

---------------

Per ora nei cookie abbiamo l'access_token con httpOnly: true (quindi non può essere letto da javascript) e lo user_id con httpOnly: false (quindi può essere letto da javascript).
Per accedere ai cookie:
```javascript
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}
```



# Authentication 

- Per creare l'ACCESS_TOKEN_SECRET nel .env abbiamo usato ` require('crypto').randomBytes(64).toString('hex')` in node. (il .env non viene caricato in git, quindi va creato in locale)

1. Generazione del token:  
    Quando l'utente invia email e password (richiesta POST a /login in access.js), il server (user_route.js che chiama user_service.js) verifica le credenziali (la password viene verificata con bcrypt), e se sono corrette, viene generato un token JWT (JSON Web Token) utilizzando la libreria jsonwebtoken (jwt.sign()). Il token contiene le informazioni dell'utente e viene firmato con una chiave segreta (ACCESS_TOKEN_SECRET). L'access_token viene salvato nei cookie (res.cookie in user_service.js).
2. Autenticazione delle richieste:  
    Quando il client invia una richiesta ad un microservizio (diverso da user-service) (ad esempio quando vuole accedere alla home di student-service), il microservizio estrae l'access_token dai cookie e lo verifica (jwt.verify()). Se il token è valido, il microservizio può accettare la richiesta e procedere con l'operazione richiesta.
    
----------------------------

## User di test
username: test@example.com
password: test@example.com
(role: student)

Microservizi:
1.⁠ ⁠User-service
2.⁠ ⁠Note-service (student)
3.⁠ ⁠Course-service (teacher)



TODO:

- Header del consumer.js di user-service (per gestire più richieste sulla stessa comunicazione con RabbitMQ)
- file .env non viene letto (ci serve per ACCESS_TOKEN_SECRET)
- Gestione Logout (serve refresh token o possiamo eliminare il token salvato nei cookie?)
- Rinominare student-service in note-service
- Student_Home da sistemare 
- Pagina delle Note creata da zero 
- Aggiungere un'altra pagina per importare note di altri studenti
- Pagina da parte degli studenti per cercare corsi a cui iscriversi 
- Pagina da parte dei professori per inserire test e annunci 

Poca priorità 
-Personal area

DECISIONI:
•⁠  ⁠Le note si vedono in una pagian separata rispetto a quella dei corsi (nella home page si possono mostrare alcune note facendo la richiesta a note service con Rabbit)
•⁠  ⁠Il professore quando crea un corso seleziona una categoria a cui associamo un colore e quindi le note con quella categoria saranno visualizzate con quel colore e copertina predefinita
•⁠  ⁠Se la nota viene creata senza un corso di appartenenza allora la categoria viene scelta dallo studente
