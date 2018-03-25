# Reuters Dataset

>NoSQL project

- [Introduction](#introduction)
- [Setup](#setup)
- [Description](#description)
- [Structure](#structure)

## Introduction

For our project, we have decides to create an app in Express. With our app we can make queries for the dataset **Reuters** index in Elasticsearch.s

## Setup

First of all, to launch the project we need a device with 'NodeJs' installed. You can install it [here](https://nodejs.org/en/)

Then, we have to install all the packages required for the project. To achieved that use the following commands :

* Install the packages :

```js
npm install
```

* Insert the Dataset :

- We need a device with 'ElasticSearch' installed. You can install it [here](https://www.elastic.co/fr/downloads/elasticsearch)

- Then, launch ElasticSearch on localhost on port 9200.

- When ElasticSearch is running, we have to insert the dataset, to achieve that, open a shell in the directory of the project and use the following command :

```js
curl -XPUT "localhost:9200/_bulk" -H "Content-Type: application/json" --data-binary @reuters.json
```

- When all the previous step are done, you can launch our application using the following command :

```js
node server.js
```

You could see the following message in the shell :

![alt text](/img/app.png "Screen1")

To access to our application, open a browser and go to :

```js
http://localhost:3000/
```
## Description

When the app is launching, in the home page you see a form to achieve queries or aggregations :

![alt text](/img/double_filter.png "Screen2")

When you click on the button **Search** you request is processed and if there are results you'll see that  :

![alt text](/img/overview_result.png "Screen3")

But if nothing is found, you'll see that :

![alt text](/img/error.png "Screen4")

## Structure

For the structure of the project, we have three important parts :

- Connection : For the connection, we have a file **connection.js** that build the connection with ElasticSearch.

- Server : To processes the queries, we have a file **server.js** which links the view and the database.

- View : For the view, we decided to implement a form like a search engine where you can put several filters for a querie.
