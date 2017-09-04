# Pré-requis techniques

## Node.js

Téléchargez et installez la version de Node.js correspondant à votre système d'exploitation, en suivant les indications disponibles sur le [site officiel](https://nodejs.org/en/download/).

Vérifiez l'installation en lançant les commandes suivantes dans un terminal :

```
$ node -v
$ npm -v
```

## Graphics magick

Installez Graphics magick pour gérer la comparaison d'image pour le
rafraîchissement de la reconnaissance visuelle.
Sous les systèmes supportant Apt (debian, ubuntu) vous pouvez l'installer avec la commande suivante :
```
$ sudo apt-get install graphicsmagick
```

Vous aurez aussi besoin de imagemagick si celui-ci n'est pas déjà installé :
```
sudo apt-get install imagemagick
```

## Sox

Installez Sox et opus-tools pour gérer la conversion audio pour utiliser Wit
avec le son extrait du navigateur.

Voici les commandes pour Apt :
```
$ sudo apt-get install sox
$ sudo apt-get install opus-tools
```

# Installation

Installez les dépendances npm du projet :

```
$ npm install
```

# Architecture

| Nom  | Description  |
|---|---|
| **config**  | Contient les fichiers de configuration pour l'application  |
| **lib**  |   |
| **logs**  | Contient les logs générés par l'application  |
| **node_modules**  | Contient les dépendances npm  |
| **spec**  | Contient les tests  |
| **src/api**  | Fonctions appellant les différentes APIs utilisées par le projet  |
| **src/audio**  | Contient les fichiers audios temporaires qui seront envoyés à l'API de reconnaissance vocale  |
| **src/dispatcher**  |  |
| **src/domo**  | Contient les appels aux objets domotiques, ceux-ci peuvent se faire via une plateforme domotique regroupant les objets connectés (tel que Jeedom ou Openhab)|
| **src/expressFunctions**  | Les fonctions repondant aux reqûetes http définies dans **src**/index.js |
| **src/img**  | Contient les images temporaires utilisées pour le rafraichissement de la reconaissance visuelle |
| **src/model**  | Contient les fichiers permettant le stockage d'informations  |
| **src/mood**  | Les différents "mood" du robot (accueil, conférence ou Serli) et les actions que le robot peut faire pour chaque "mood" |
| **src/userInteractions**  | Interaction avec l'interface utilisateur (mise à jour graphique, envoie d'audio), les envoies de données vers le client se font par SSE |
| **src/utils**  | Utilitaires (logger ...)  |
| **src**/events.js  | L'objet permettant d'envoyer les évènements et la liste des évenements possibles |
| **src**/index.js  | Les routes http de l'application  |
| **src**/scenario.js  | Les fonctions répondants aux évènements en utilisant les APIs et objets connectés...  |
| package.json | Contient la liste des dépendances npm ainsi que les scripts de build et de test |

# Documentation

## Moods et évènements

Les '**Moods**' sont les différentes configurations du robot, il y en a trois :
- **Serli** : la configuration du quotidien à Serli (le robot salut les serliens le matin, fait des blagues ...)
- **Conférence** : mode de présentation du robot lors des conférences. Une zone pourra être définie dans laquelle le robot pourra se déplacer et interargir avec les visiteurs et la domotique.
- **Accueil** : Un mood sérieux dédié aux visites de l'entreprise. Le robot peut par exemple proposer un café ou démontrer ses capacités à interargir avec la domotique aux visiteurs.

Les actions des moods peuvent être définies en s'abonnant à des évènements définis listés dans le fichier src/event.js. Lors du déclanchement d'un évènement, on peut alors appeler l'un des scénarios défini dans le fichier scenario.js. Ces scénarios sont des fonctions utilisant les objets domotiques et l'interface du robot, ils peuvent aussi déclencher d'autres évènements.

### Utiliser les évènements

De nouveaux évènements peuvent être ajoutés dans le fichier src/event.js.
Pour émettre et recevoir des évènements, il suffit d'inclure le fichier event.js et de récupérer les deux objets de ce fichier :
- eventEmitter : l'objet permettant d'émettre et des s'abonner à des évènements
- events : l'objet contenant les évènements utilisés par le robot, c'est dans cet objet que doivent être ajoutés les nouveaux évènements. C'est aussi cet objet qui doit être référencé lors de l'émission d'un évènement ou lors d'un abonnement.

Pour plus d'information sur les évènements : https://nodejs.org/api/events.html

## Domotique

Les objects connectés sont gérés à l'aide d'une plateforme de domotique, il en existe plusieurs (Jeedom, Domoticz...), nous utilisons ici [openHAB](https://www.openhab.org/) qui peut se configurer avec une interface graphique et qui dispose de tous les plugins pour utiliser les objets connectés que nous possédons.
La plateforme domotique permet de regrouper tous nos objets, de les manipuler avec une interface graphique et de les faire interargir ensemble via des règles. Il est notamment possible d'écouter les changements d'états des objets et de faire des actions en conséquence (comme envoyer une requête au serveur du robot).
La plateforme dispose d'un API permettant de la manipuler grâce à des requêtes http. On peut ainsi effectuer des requêtes sur nos objets définis dans la plateforme et celle-ci se charge de la manipulation physique des objets. 

> **Note!** Les objets connectés peuvent aussi être directement controlés via une API qui leur est propre

## APIs

- [Microsoft Face API](https://azure.microsoft.com/en-us/services/cognitive-services/face/) : utilisé pour enregistrer et reconnaître des personnes
- [Voice RSS](http://www.voicerss.org/) : service TTS (text to speech), produit une url contenant un audio qui peut ensuite être envoyé au client pour être joué
- [Wit](https://wit.ai/) : reconnaissance vocale et interpretation de texte permettant d'obtenir des données structurées au format json

## Server-sent events

Les servent-sent events (SSE) permettent d'envoyer des informations du server vers les clients. Ils servent ici à effectuer des actions sur l'interface utilisateur lors de changement sur le serveur. On s'en sert notamment pour envoyer l'audio à jouer coté interface utilisateur.
Un évènement est prévu pour envoyer des informations via sse. 

Pour plus d'informations : https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events