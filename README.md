# d3_weather_obs_viewer

This project was started by The COMET Program, makers of MetEd (www.meted.ucar.edu), to find better ways to visualize case studies and current weather observations for within our lessons.  This is just one piece of many possible future instances.  

## Running webpage on localhost
To run this observation station viewer, start a localhost instance at the origin of this project.  We typically use:
python -m http.server 8000

Open the "Obs_Viewer.html" file from a webpage with: localhost:8000/Obs_Viewer.html

## Getting the latest data
The initial data that is found in the "data" folder is meant to be a starting point.  To get the latest observations, run the bash script in the data folder:
bash get_latest.bash

This bash script replaces those already in the data folder with the latest observations from api.weather.gov (from the National Weather Service).

In some instances, you will need to remove some of the json files that are downloaded but contain no data or "File Not Found" errors.  To do this from a linux/mac terminal window, I usually use:
find . -name "*.json" -type 'f' -size -1k -delete
