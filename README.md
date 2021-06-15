# Express-APIs

# Requirements - 
Take the following gist in consideration:

https://gist.github.com/joaofs/a6b80ce482de2f3846a00e72c0497a35

This is a list of premier league football teams. This is the dataset to be used during this exercise. No actual database implementation is required, feel free to stub it out.

1 - Create a REST API with the endpoint /teams returning the full dataset. \n
2 - Create another action on /teams/{team_name} where {team_name} is the name of the team. If the team exists, it should return only one record of the dataset. \n
3 - Now, /teams should also be able to receive a payload allowing a team to be created.
4 - On a different action, if a team already exists, /teams should update the image of the team
