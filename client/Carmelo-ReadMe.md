Week 1: 
In the first week the group had a meeting for defining where we talked about the project and we have defined the tasks of each of the developers. I prepared the lder structure for the project and started making my own component.
I create a basic structure for my component and focused on the implementation of the API end point in back end. 
This component will show data about the situation on the road, incidents, deviation, closed roac etc.. from Trafikverket API.
In order to show the data, the API will need coordinates, data that will come from the user input in the heade component.
The user will enter a location and the GeoLocation API will give back the data that trafikverket API needs.

I set the back end, create a server folder and installed:

expressJs, nodemon, dotenev, cors and axios.

After putting sensitive data in .env file i started creating my the end point fo the api.

GET /fetchDataTrafficSituation
This endpoint retrieves traffic situation data for a specific location. It expects latitude and longitude values in the request body. Here’s how it works:

Request: A POST request is sent to /fetchDataTrafficSituation. The body of the request must contain lat (latitude) and lon (longitude).

Request Handling:
The server receives the latitude and longitude and uses these to create an XML string (xmlDataSituation) that will be sent to the Trafikverket API.
The server sends the XML string via a POST request to the Trafikverket API with the appropriate authenticationkey and Content-Type.

Response: The response from the Trafikverket API is logged and then sent back to the client in JSON format. If there is an error, the server sends a 500 status code and an error message.

Week 2:
I started the week by figuring out how to pass the coordinates to the component. Importing the context into the component didn’t help much, as the component was still unable to access the data. The issue was in the AddressInput component, which didn’t have a specific value assigned for the coordinates. After a few attempts, I was able to fix the problem.
The stakeholder decided to implement Tailwind CSS for styling and Zustand for state management. I proceeded with installing Tailwind, configuring tailwind.config.js with some default values, and styling my component.
Additionally, I started reading the documentation for Zustand to understand how it works.
Plan for Week 3:
I will implement the state management library.