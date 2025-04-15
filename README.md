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

`npm i bcryptjs body-parser cookie-parser cors dotenv express jsonwebtoken nodemon path pg sequelize amqplib`   

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
1. User-service (8080)
2. Note-service (student-service) (7070)
3. Course-service(professor) (6060)


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
- Header del consumer.js di user-service (per gestire più richieste sulla stessa comunicazione con RabbitMQ)


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

------------

# Courses
Allora ho creato il dockerfile per i corsi e l'ho aggiunto al dockercompose (se vedete che su pgAmin non vi compare il coursesdb provate a cancellare tutto quello che avete in Volumes nel docker e re-buildate)
Al momento c'è solo una tabella nel db dei corsi (courses) e contiene: Id (id del corso), Titolo, Descrizione, Professor_id, Student_ids (arrey di id inizialmente vuoto pk il prof. può creare un corso a cui non è iscritto nessuno)
In fondo a couse.js c'è anche il codice per un Corso di testper vedere se la fetch funzionava.
Per i moduli npm che ho installato sono praticamente tutti quelli che sono scritti sopra
Manca la tabella per i quiz e la parte dei materiali di un corso (che a questo punto penso aggiungerei sempre come un arrey a courses forse?)
- Le seguenti funzioni sono nuove e non sono state provate:
addStudentToCourse (gestisce l'iscrizione di uno studente a un corso)
getCoursesByStudentId (usata dal consumer per trovare i corsi a cui è iscritto uno studente)

## Rabbit e le code
Vdendo su internet sembra che in config.js quando compare:
queues: {
        rpcQueue: "rpc_queue",
      },
Si possano mettere più code con diciture diverse e quindi avevo provato a creare due code (in student-service) in questo modo:
queues: {
        userRPC: "rpc_user_queue",
        courseRPC: "rpc_course_queue",
      },
(mentre per user-> config.js sarebbe stato rpcQueue: "rpc_user_queue",) idem per course-service (in modo che il codice per consumer e producer non cambiasse).
Dopo di che ho aggiunto la funzione fetchCourses gestita come fetchUsername in student_home.js e getCourses in note_route.js che era getsita allo stesso modo di getUsername ed ho modificato il messaggio che veniva passato al Producer non più req.body ma una variabile così definita:
const message = {
        payload: req.body,
        target: 'getUsername',
}
in modo che il Producer potesse vedere che tipo di richiesta era stata fatta e in base al 'target' decidere su quale coda rpc aggiungerla (producer.js in student-service):
const {target, payload} =data;
let queue={};
if (target.toString()=="getUsername") queue=config.rabbitMQ.queues.userRPC; 
if (target.toString()=="getCourses") queue=config.rabbitMQ.queues.courseRPC; 
this.channel.sendToQueue(
      queue, // 2. Queue to send the message to
      Buffer.from(JSON.stringify(data.payload)),// in modo che il formato del messaggio passato al consumer non cambi
... //stesso codice
)
E fin qui ancora sembrava funzionare perchè il Consumer di user-service riceveva correttamente la richiesta (leggeva lo student id) e ritornava l'username corrispondente ... che però è come se non venisse mai ricevuto da student-service che dai Log non stampa nulla che mostri che la richiesta sia andata a buon fine o meno (ho provato a modificare welcomeMessage.textContent sia nel caso in cui ritorni con successo e student non è NULL sia nel caso in cui è NULL e sia nel caso in cui non ritorni .status==200, però il testo di welcome non è mai modificato)
Quindi ho tolto tutte le modifiche che ho fatto anche basandomi sull'ultima versione del codice presente su Git però ancora non funzionaaaaaaaaa non so perchè ...


## TODO:

- file .env non viene letto (ci serve per ACCESS_TOKEN_SECRET)
- Rinominare student-service in note-service
- Gestione pagine a cui l'utente non ha accesso

**Gestione user e ruoli**:   
- Homepage studente:
    - mostrare le ultime note (da fixare)
    - mostrare alcuni corsi (con richiesta a course-service tramite RabbitMQ)    
(nella sidebar lo studente avra quindi i miei corsi, le mie note, bacheca con tutte le note)
- Homepage professore = reindirizzare alla pagina dei suoi corsi   
(Nella sidebar il professore avrebbe solo "i miei corsi" forse potremmo non metterla)  
- Gestione ruolo studente e professore
- Area personale per studente e professore  

**Note-service**:  
- pagina con tutte le note (è simile a quella delle "mie note" ma comprende anche le note degli altri studenti)
- filtrare le note per corso ecc (dalla pagina di tutte le note) 
- Capire come salvare file pdf/immagini nel db   
La pagina le mie note è gia fatta (dove puoi anche creare una nuova nota), sarebbe quella che ora è la home dello studente ( ma va messa in un'altra pagina) 

**Course-service**:
- visualizzazione singolo corso con tutti i contenuti (per professore e per studente). Creiamo un tab per dividere i contenuti (annunci e documenti) dai test.
- visualizzazione pagina dei "miei corsi" lato studente (con tutti i corsi a cui lo studente è iscritto) e ricerca di un corso per iscriversi. (La richiesta per i corsi dello specifico studente va fatta all'interno dello stesso microservizio, quindi sempre dentro course-service)
- visualizzazione pagina "I miei corsi" lato professore con bottone per creare nuovo corso
- aggiunta contenuto al corso (Per il professore)
- Capire come salvare file pdf/immagini nel db

**Test:**  
- Pagina da parte dei professori per creare un test 
- Professore visualizza riepilogo test
- Pagina studente per svolgere il test 
- Far visualizzare allo studente il risultato del test



## DECISIONI:
•⁠  ⁠Le note si vedono in una pagina separata rispetto a quella dei corsi (nella home page si possono mostrare alcune note facendo la richiesta a note service con Rabbit)  
•⁠  ⁠Il professore quando crea un corso seleziona una categoria a cui associamo un colore e quindi le note con quella categoria saranno visualizzate con quel colore e copertina predefinita  
•⁠  ⁠Se la nota viene creata senza un corso di appartenenza allora la categoria viene scelta dallo studente  
