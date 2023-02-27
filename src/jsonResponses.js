const characters = {};

// function to respond with a json object
// takes request, response, status code and object to send
const respondJSON = (request, response, status, object) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.write(JSON.stringify(object));
  response.end();
};

// function to respond without json body
// takes request, response and status code
const respondJSONMeta = (request, response, status) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end();
};

// return character object as JSON
const getCharacters = (request, response) => {
  const responseJSON = {
    characters,
  };

  respondJSON(request, response, 200, responseJSON);
};

const getCharactersMeta = (request, response) => {
// return 200 without message, just the meta data
  respondJSONMeta(request, response, 200);
};

// function to add a character from a POST body
const addCharacter = (request, response, body) => {
  // default json message
  const responseJSON = {
    message: 'All fields are required.',
  };

  // check to make sure we have both fields
  // If either are missing, send back an error message as a 400 badRequest
  if (!body.name || !body.age || !body.height || !body.bio || !body.image) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  // default status code to 204 updated
  let responseCode = 204;

  // If the character doesn't exist yet
  if (!characters[body.name]) {
    // Set the status code to 201 (created) and create an empty character
    responseCode = 201;
    characters[body.name] = {};
  }

  // add or update fields for this character name
  characters[body.name].name = body.name;
  characters[body.name].age = body.age;
  characters[body.name].height = body.height;
  characters[body.name].bio = body.bio;
  characters[body.name].image = body.image;

  // if response is created, then set our created message
  // and sent response with a message
  if (responseCode === 201) {
    responseJSON.message = 'Created Successfully';
    return respondJSON(request, response, responseCode, responseJSON);
  }
  // 204 has an empty payload, just a success
  // It cannot have a body, so we just send a 204 without a message
  // 204 will not alter the browser in any way!!!
  return respondJSONMeta(request, response, responseCode);
};

const notFound = (request, response) => {
  const responseJSON = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };

  respondJSON(request, response, 404, responseJSON);
};

const notFoundMeta = (request, response) => {
  // return a 404 without an error message
  respondJSONMeta(request, response, 404);
};

// public exports
module.exports = {
  getCharacters,
  getCharactersMeta,
  addCharacter,
  notFound,
  notFoundMeta,
};
