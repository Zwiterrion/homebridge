
# Serli robot

## Présentation

Ce répertoire contient les deux parties logiciels du robot Serli :
- robotCore : la partie serveur qui contient notamment les appels aux APIs et à
la domotique
- robotHead : la partie client qui contient l'IHM permettant de communiquer avec
les personnes autour du robot

## Pré-requis techniques

### Node.js

Téléchargez et installez la version de Node.js correspondant à votre système d'exploitation, en suivant les indications disponibles sur le [site officiel](https://nodejs.org/en/download/).

Vérifiez l'installation en lançant les commandes suivantes dans un terminal :

```
$ node -v
$ npm -v
```

### Graphics magick

Installez Graphics magick pour gérer la comparaison d'image pour le
rafraîchissement de la reconnaissance visuelle :
```
$ sudo apt-get install graphicsmagick
```

### Sox
Installez Sox et opus-tools pour gérer la conversion audio pour utiliser Wit
avec le son extrait du navigateur :
```
$ sudo apt-get install sox
$ sudo apt-get install opus-tools
```
