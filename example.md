# Presentation title

- Generic detail about the content of the presentation

## Chapter example
- **HTTP methods** are one of the most important features of HTTP

- The most popular **HTTP** *methods* are:
    - GET - requests a piece of information from the server
        - the most popular one
            - done by a browser when it connects to a site
    - POST - requests the creation of a new entry on server side
    - PUT - requests the update of an entry on server side
    - DELETE - requests the removal of an entry on server side

- [All HTTP methods](https://www.w3schools.com/tags/ref_httpmethods.asp)

### Subchapter example
- The HTTP methods are very important for the REST architecture

![Image example](https://miro.medium.com/v2/resize:fit:788/1*m3jEkdc9SKTK6vNPhRHCqg.jpeg)

```js
title:code title example
fetch("http://some-url.com")
    .then(response => console.log(response));


// if the API responds with a JSON, you can directly parse the response body
fetch("http://some-other-url.com")
    .then(response => response.json())
    .then(data => console.log(data));
```

# Closing title

