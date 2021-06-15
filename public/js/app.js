const express = require('express');
const {body, validationResult} = require('express-validator');
const Teams = require("./teams");

var app = express();
app.use(express.json());

//Function to handle GET API Call for both teams and teams/{team_name}
app.get(["/teams", "/teams/:team_name"], (request, response) => {
    let data = Teams.get(request.params.team_name);
    response.status(data.status ? data.status : 200).send(data.response ? data.response: data);   
});

app.post("/teams",
        body('name').isString(),
        body('img').isURL(),
        (request, response) => {
             //Validate the input values
            let errors = validationResult(request);
            if(!errors.isEmpty())
                response.status(400).send({response: errors.array()});
            else{
                //Once validation is completed, create the team
                var createStatus = Teams.create(request.body);
                createStatus.then(result => {
                    response.status(result.status).send(result.response);
                });
            }
        }
);

app.put("/teams/:team_name", 
        body('img').isURL(),
        (request, response) => {
            //Validate the input
            let errors = validationResult(request);
            if(!errors.isEmpty())
                response.status(400).send({response: errors.array()});
            else{
                //Once validation is complete, update the image if the team exists
                Teams.update(request.params.team_name, request.body).then(
                    updatedData => {
                        response.status(updatedData.status).send(updatedData.response);
                    }
                );                
            }
        }
);

app.delete("/teams/:team_name", (request, response) => {
    Teams.delete(request.params.team_name).then(
        newTeamData => {
            response.status(newTeamData.status).send(newTeamData.response);
        }
    );
});

module.exports = app;