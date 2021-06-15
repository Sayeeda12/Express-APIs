const request = require('supertest');
const app = require('../public/js/app');
const teamData = require("../public/data/footballTest.json");

/**
 * Tests for GET API
 */
const ArsenalData = [{name: "Arsenal", img: "https://s3-eu-west-1.amazonaws.com/inconbucket/images/entities/original/632.jpg"}];
const teamNotFound = {response: "No such team found"};

test('Get all teams', async () => {
    await request(app).get('/teams')
    .expect('Content-Type', /json/)
    .expect(200)
    .then(response => {
        expect(JSON.parse(response.text)).toStrictEqual(teamData);
    })
});

test('Get Arsenal team', async () => {
    await request(app).get('/teams/Arsenal')
    .expect('Content-Type', /json/)
    .expect(200)
    .then(response => {
        expect(JSON.parse(response.text)).toStrictEqual(ArsenalData);
    })
});

test('Get a team that doesn\'t exist', async () => {
    await request(app).get('/teams/Wrong Team')
    .expect('Content-Type', /json/)
    .expect(404)
    .then(response => {
        expect(JSON.parse(response.text)).toStrictEqual(teamNotFound);
    })
});


/**
 * Tests for POST API
 */
const teamRequestBody = {name: "Team1", img: "https://trial.com"};
const teamWithoutName = {img: "https://trial.com"};
const teamWithoutImg = {name: "Team1"};
const invalidNameError = {response: [{"location": "body", "msg": "Invalid value", "param": "name"}]};
const invalidImgError = {response: [{"location": "body", "msg": "Invalid value", "param": "img"}]};
const teamCreated = {response: "Team 'Team1' created successfully"};
const duplicateNameRequest = {name: "Arsenal", img: "https://google.com"};
const duplicateImageRequest = {name: "Team1", img: "https://s3-eu-west-1.amazonaws.com/inconbucket/images/entities/original/639.jpg"};
const teamExists = {response: "Provide a different name/img. The given name/img already exists"};

test('Create a team without name', async () => {
    await request(app).post('/teams')
    .send(teamWithoutName)
    .expect(400)
    .then(response => {
        expect(JSON.parse(response.text)).toStrictEqual(invalidNameError);
    });
});

test('Create a team without image', async () => {
    await request(app).post('/teams')
    .send(teamWithoutImg)
    .expect(400)
    .then(response => {
        expect(JSON.parse(response.text)).toStrictEqual(invalidImgError);
    });
});

test('Create a team with duplicate name', async () => {
    await request(app).post('/teams')
    .send(duplicateNameRequest)
    .expect(400)
    .then(response => {
        expect(JSON.parse(response.text)).toStrictEqual(teamExists);
    });
});

test('Create a team with duplicate image', async () => {
    await request(app).post('/teams')
    .send(duplicateImageRequest)
    .expect(400)
    .then(response => {
        expect(JSON.parse(response.text)).toStrictEqual(teamExists);
    });
});

test('Create a team successfully', async () => {
    await request(app).post('/teams')
    .send(teamRequestBody)
    .expect(201)
    .then(response => {
        expect(JSON.parse(response.text)).toStrictEqual(teamCreated);
    });
});

/**
 * Tests for PUT function
 */
const updateRequest = {img: "https://google.com"};
const updateRequestWithExistingImage = {img: "https://s3-eu-west-1.amazonaws.com/inconbucket/images/entities/original/631.jpg"};
const updateSuccessResponse = {response: "Team 'Team1' updated successfully"};
const updateError = {response: "Either the given team name doesn't exist or the given image already exists"};

test('Update a team which doesn\'t exist', async () => {
    await request(app).put('/teams/Team2')
    .send(updateRequest)
    .expect(400)
    .then(response => {
        expect(JSON.parse(response.text)).toStrictEqual(updateError);
    });
});

test('Update a team with an existing image', async () => {
    await request(app).put('/teams/Team1')
    .send(updateRequestWithExistingImage)
    .expect(400)
    .then(response => {
        expect(JSON.parse(response.text)).toStrictEqual(updateError);
    });
});

test('Update a team\'s image', async () => {
    await request(app).put('/teams/Team1')
    .send(updateRequest)
    .expect(200)
    .then(response => {
        expect(JSON.parse(response.text)).toStrictEqual(updateSuccessResponse);
    });
});

/**
 * Tests for DELETE function
 */
const deleteSuccessResponse = {response: "Team 'Team1' deleted successfully"};
const deleteFailed = {response :"Team 'Wrong Team' not found"};

test('Delete the team', async () => {
    await request(app).delete('/teams/Team1')
    .expect(200)
    .then(response => {
        expect(JSON.parse(response.text)).toStrictEqual(deleteSuccessResponse);
    });
});

test('Delete a team that doesn\'t exist', async () => {
    await request(app).delete('/teams/Wrong Team')
    .expect(404)
    .then(response => {
        expect(JSON.parse(response.text)).toStrictEqual(deleteFailed);
    });
});