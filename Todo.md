## **Introduction**

Te sera livré durant ce test technique une "User story" te décrivant le besoin d'un client.
En fonction de ce besoin tu devras développer une interface frontend et développer le backend adéquat afin de pouvoir persister la donnée par le biais d'une API. La donnée sera persistée au sein d'une base de donnée `sqlite`, le backend est en `Nest` utilisant l'ORM `Prisma` et l'API requise doit suivre le modèle `REST`.
Le frontend quant à lui utilise la version 3 de `vue` et nous préconisons l'utilisation de `composition` API. <br>
Une sensibilité vis à vis de l'organisation, la propreté du code serait appréciée.
Nous laissons libre choix concernant la design de cette fonctionnalité, mais un design propre serait également apprécié.

> **-ETQ = "En tant que"** </br> **-Tu as le droit de t'aider de google** </br> **-Tu retrouveras également des résidus de code au sein du backend te permettant de t'orienter, mais ils te seront d'aucune utilité à propos du développement de la fonctionnalité demandée, ils sont uniquement là pour servir de repère vis à vis de l'organisation de Nest afin que tu t'y retrouves plus facilement.** </br>

> **Commandes Utiles:** </br> **- pnpm run serve : lance un serveur de développement pour le frontend** </br> **- pnpm run start:dev : lance un serveur de développement pour le backend** </br> **- pnpm run prisma:generate : génère un nouveau client prisma** </br> **- pnpm run migrate:dev : Applique une migration afin que la BdD corresponde au schema prisma**

## **Contexte**

> L'app est une solution de gestion de TODOs. La base de données doit être considérée comme vierge et il faudra effectuer une migration (pnpm run migrate:dev) et un seeding ("pnpm run seed") afin de l'initialiser.

## **Rendu minimal obligatoire**

Tu dois nous envoyer le résultat sous la forme d'un repository public github ou gitlab. Les commits doivent être clairs et explicites.

Les User stories sont:

- ETQ user je souhaite m'authentifier sur l'application
- ETQ user je souhaite afficher la liste des TODOs
- ETQ user je souhaite ajouter un nouveau TODO
- ETQ user je souhaite que le formulaire de création de TODO subisse une validation avant envoi à l'API

  - Champs obligatoire : titre (texte de moins de 50 charactères), contenu((texte de moins de 256 charactères)), priorité ("haut","bas","moyen")
  - Champs optionnels : date d'éxécution (exemple: "23/09/2023")

- ETQ développeur je veux avoir à disposition un guide (langue francaise) me permettant de démarrer l'application
- ETQ développeur, au moment de créer la fonctionnalité, l'interface utilisateur doit utiliser la langue francaise mais le code doit être écrit en anglais.

<br> Remarques : <br />

- Concernant l'authentification, <b>toute la partie backend est déjà en place</b>. Nous attendons donc une implementation du frontend (router, page login, redirection). <br />Les identifiants de connexion sont : toto@kresus.eu / test
- Libre à toi d'utiliser une librairie graphique ou un framework CSS
- Nous sommes très attentifs à la qualité du Typescript utilisé.
- <b>Le backend et le frontend tournent sous Node 22.17.1</b>

## **Bonus (si tu as le temps et l'envie)**

- Si tu as une idée / un sujet de prédilection non listé ici et que tu veux nous épater, fais le!
- Mettre en place des tests unitaires simples
- Pagination de la liste des TODOS
- Dockerisation (Docker Compose). N'oublie pas de faire un guide détaillant comment démarrer l'application. L'objectif est que les serveurs frontend et backend soient lancés et opérationnels en une seule commande "docker compose up".
- créer des utilisateurs et les lier aux TODOs dans la propriété "author". (un utilisateur peut avoir plusieurs TODOs, un TODO ne peut avoir qu'un seul utilisateur). Tu peux créer une UI permettant la gestion (ajout/consultation) des utilisateurs mais tu peux aussi te contenter de les créer via le seed de la base de données. L'utilisateur peut avoir une photo de profil, un nom, un prénom.
