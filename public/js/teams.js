const fs = require('fs');
const path = require('path');
const utils = require("./utils");
var teamData = require('../data/football.json'); //Not a const because we'll be deleting objects from it too

module.exports = {
    get: function(teamName) {
        //Read the file directly and return the json object based on API Call (all teams or a single team)
        if(teamName !== undefined){
            let result = teamData.filter(team => team.name == teamName);
            return (result.length == 0 ? utils.setResponse("No such team found", 404) : result);
        }
        else
            return teamData;
   },

    create: function(requestBody){
        return new Promise((resolve) => {
            //Check for duplicates - both name and img
            if(teamData.some(value => value.name == requestBody.name || value.img == requestBody.img))
                resolve(utils.setResponse("Provide a different name/img. The given name/img already exists", 400));
            else{
                teamData.push(requestBody);

                fs.writeFile(path.resolve(__dirname, process.env.FILE_PATH), JSON.stringify(teamData), err => {
                    if(err) throw err;
        
                    resolve(utils.setResponse(`Team '${requestBody.name}' created successfully`, 201));
                });
            }
        });
    },

    update: function(teamName, requestBody) {
        return new Promise((resolve) => {
            //Check if the team name exists and if the img is not duplicate
            if(teamData.some(value => value.name == teamName) && !teamData.some(value => value.img == requestBody.img && value.name != teamName)){
                //Find the position of the team in the array and change it's image
                let teamPosition = teamData.findIndex(value => value.name == teamName);
                teamData[teamPosition].img = requestBody.img;

                fs.writeFile(path.resolve(__dirname, process.env.FILE_PATH), JSON.stringify(teamData), err => {
                    if(err) throw err;
        
                    resolve(utils.setResponse(`Team '${teamName}' updated successfully`));
                });
            }
            else{
                resolve(utils.setResponse("Either the given team name doesn't exist or the given image already exists", 400));
            }
        });
    },

    delete: function(teamName) {
        return new Promise((resolve) => {
            //Check if the team name is valid
            let teamDetails = this.get(teamName); //Fetch the team details
            if(teamDetails.response !== undefined)
                resolve(utils.setResponse(`Team '${teamName}' not found`, 404));
            else{
                teamData = teamData.filter(value => value.name != teamName);

                fs.writeFile(path.resolve(__dirname, process.env.FILE_PATH), JSON.stringify(teamData), err => {
                    if(err) throw err;
        
                    resolve(utils.setResponse(`Team '${teamName}' deleted successfully`));
                });
            }
        });
    }
}