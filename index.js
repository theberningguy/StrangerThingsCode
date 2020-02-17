// https://jsonformatter.curiousconcept.com/ for cleaning up json data
// https://www.twilio.com/blog/2017/08/http-requests-in-node-js.html
// https://stackoverflow.com/questions/11508463/javascript-set-object-key-by-variable
// https://stackoverflow.com/questions/26392280/using-momentjs-to-convert-date-to-epoch-then-back-to-date

const moment = require('moment');
const https = require("https");


fetchData().then(function(response) {
    let finalObject = createObj(response)
    console.log(finalObject)
});

// fetch our data 
function fetchData() {

    return new Promise(function(resolve, reject) {
        https.get("https://api.tvmaze.com/singlesearch/shows?q=stranger-things&embed=episodes", (resp) => {
            let data = "";
    
            // A chunk of data has been recieved.
            resp.on("data", (chunk) => {
                data += chunk;
            });
    
            // The whole response has been received. Print out the result.
            resp.on("end", () => {
                const parsedData = JSON.parse(data);
                resolve(parsedData)
            });
    
        }).on("error", (err) => {
            console.log("Error: " + err.message);
        });
    })
}


// print the main object
function createObj(parsedData) {
    const episodes = parsedData._embedded.episodes;

    let newObj = {
        [parsedData.id]: {
            totalDurationSec: getTotalEpisodeDurationSec(episodes),
            averageEpisodesPerSeason: getAverageEpisodesPerSeason(episodes),
            episodes: structureEpisodes(episodes)
        }
    };

    return JSON.stringify(newObj)
}

// get total show duration length in seconds.
function getTotalEpisodeDurationSec(episodes) {
    var sum = 0;
    episodes.map(x => sum += x.runtime); // sum of ep runtime in minutes
    return sum * 60 // return in seconds
}

// gets the average episodes per season, floated with max one decimal
function getAverageEpisodesPerSeason(episodes) {
    let seasons = episodes.map(x => x.season); // list of episodes season numbers
    let numOfSeasons = Math.max(...seasons); // highest number of season available

    var sum = 0;
    for (let i = 1; i < numOfSeasons; i++) {
        let ep = episodes.filter(x => x.season == i);
        sum += ep.length;
    };
    return Math.round((sum / numOfSeasons) * 10) / 10;
}

// create a new obj structured to task requirements
function structureEpisodes(episodes) {
    let structureEpisodes = {}; 
        episodes.map(e => {
            structureEpisodes[e.id] = {
                sequenceNumber: getEpisodeSequenceNum(e),
                shortTitle: getEpisodeTitle(e),
                airstamp: getEpisodeAirstamp(e),
                summary: getEpisodeSummary(e)
            }
        });
    return structureEpisodes;
}

// ********************** helper functions **********************

function getEpisodeSequenceNum(episode) {
    return `s${episode.season}e${episode.number}`
}

// cuts off some of the extra text from an episodes title. Then, returns the string
function getEpisodeTitle(episode) {
    let title = episode.name 
    ? episode.name.substring(episode.name.indexOf(':') + 2)
    : 'N/A';
    return title;
};

function getEpisodeAirstamp(episode) {
    return moment(episode.airstamp).valueOf();
}

function getEpisodeSummary(episode) {
    // not all episodes have summaries (season 4, ep 1)
    let summary = episode.summary 
    ? episode.summary.replace('<p>', '').split('.')[0] 
    : 'N/A';
    return summary;
}


// Exports
module.exports = {
    fetchData: fetchData,
    createObj: createObj,
    structureEpisodes: structureEpisodes,
    getAverageEpisodesPerSeason: getAverageEpisodesPerSeason,
    getTotalEpisodeDurationSec: getTotalEpisodeDurationSec,

    getEpisodeSequenceNum: getEpisodeSequenceNum,
    getEpisodeAirstamp: getEpisodeAirstamp,
    getEpisodeSummary: getEpisodeSummary,
    getEpisodeTitle: getEpisodeTitle
};