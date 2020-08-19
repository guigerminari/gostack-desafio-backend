const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

// const { v4: uuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.send(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repo = { 'id': uuid(), 'title': title, 'url': url, 'techs': techs, likes: 0 };

  repositories.push(repo);

  return response.status(200).json(repo);

});

app.put("/repositories/:id", (request, response) => {
  const { title, url, techs } = request.body;
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repo => repo.id === id);

  if(repositoryIndex < 0)
    return response.status(400).json({error: "ID not found!"});

  const repo = { 'id': id, 'title': title, 'url': url, 'techs': techs, likes: repositories[repositoryIndex].likes };
  repositories[repositoryIndex] = repo;

  return response.status(200).send(repo);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex(repo => repo.id === id);

  if(repoIndex < 0)
    return response.status(400).json({error: "ID not found!"});

  repositories.splice(repoIndex,1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex(repo => repo.id === id);

  if(repoIndex < 0)
    return response.status(400).json({error: "ID not found!"});

  const repo = {'id': id, 'title': repositories[repoIndex].title, 'url': repositories[repoIndex].url, 'techs': repositories[repoIndex].techs, likes: repositories[repoIndex].likes+1 };
  repositories[repoIndex] = repo;

  return response.status(200).send(repo);
});

module.exports = app;
