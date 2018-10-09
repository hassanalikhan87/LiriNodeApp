// setting up variables and installing npm packages as per instructions.
var spotify=require('node-spotify-api'); 
var dotenv=require('dotenv').config();
var twitter=require('twitter');
var request = require("request");
var inquirer = require("inquirer");
var secret=require('./keys.js');
var client=new twitter(secret.twitter);
var spotify=new spotify(secret.spotify);
var fs = require('fs');

startApp();
function startApp() {
    inquirer
        .prompt([
            {
                type: 'list',
                message: 'what would you like to do?',
                choices: ['my-tweets', 'spotify', 'omdb', 'random','quit'],
                name: 'selection'
            }
        ]).then(data => {
            var app=data.selection;
    switch (app) {
        case 'my-tweets':
            myTweets();
            break;
        case 'spotify':
           inquirer
           .prompt([{
               type:'input',
               message:'what song would you like to search?',
               name:'songSelection'
           }]).then(data =>{
               if(!data.songSelection)
               {
                   spotifyThis("sajan");
               }
               else{
                   spotifyThis(data.songSelection);
               }
           })
            break;
        case 'omdb':
        inquirer.prompt([
            {
                type: 'input',
                message: 'What movie would you like to search?',
                name:'movieData'
            }
        ]).then(movie =>{
            if(!movie.movieData){
                omdbThis('Mr Nobody');
            }
            else{
                omdbThis(movie.movieData);
            }
        })
           
            break;
        case 'random':
            random();
            break;
            case 'quit':
            console.log('thankyou for using liri app');
            break;
    }
});
}

function omdbThis(value){
    var key='&apikey=f98d3aa7';

    request('http://www.omdbapi.com/?t=' + value + key, function (error, response, body) {
    var data=JSON.parse(body);
        if (!error && response.statusCode == 200) {
            data = JSON.parse(body);
            console.log('Title: ' + data.Title);
            console.log('Year: ' + data.Year);
            console.log('IMDb Rating: ' + data.imdbRating);
            console.log('Country: ' + data.Country);
            console.log('Language: ' + data.Language);
            console.log('Plot: ' + data.Plot);
            console.log('Actors: ' + data.Actors);

        }
    });

}

function myTweets(){

var params={screen_name: 'HassanA63841546',
count:20};
client.get('statuses/user_timeline', params, function(err, tweets)
{
    if(err){
        console.log(err);
    }
        else{
            // console.log(tweets)
            tweets.forEach(tweet =>{
                console.log(tweet.text);
                console.log(tweet.created_at);
            });
        
        

    }
});

}
function spotifyThis(song){
  var params={
      type: 'track',
      query: song
  };
  spotify.search(params, function(err,res){
      if(err){
          console.log(err)
    }
      else{
        console.log("Song Name: "+res.tracks.items[0].name);
        console.log("Artist Name: "+res.tracks.items[0].album.artists[0].name);
        console.log("Album Name: "+res.tracks.items[0].album.name);
        console.log("URL: "+res.tracks.items[0].preview_url);
    }
  });
}

function random(){
fs.readFile("random.txt", "utf8", function(err, data) {
    if (err) {
        return console.log(err);
      } else {
        var dataArr = data.split(',');
        if (dataArr[0] === 'spotify-this-song') {
            spotifyThis(dataArr[1]);
        }}

    });
};

