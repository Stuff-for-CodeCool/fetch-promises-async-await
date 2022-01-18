//  The HTML elements we will work with
const elements = {
    typeCheckInput: document.querySelector("#typecheck"),
    headerLinks: document.querySelectorAll("header li a"),
    main: document.querySelector("main"),
    aside: document.querySelector("aside pre code"),
};
//  The API url we request from
const baseUrl = "https://ghibliapi.herokuapp.com/";

//  Helper functions
const building = {
    setup: () => {
        //  Event listener for the top links
        elements.headerLinks.forEach((link) =>
            link.addEventListener("click", (e) => {
                e.preventDefault();
                const url = link.href.split("#")[1];

                if (elements.typeCheckInput.checked) {
                    fetching.async(url);
                } else {
                    fetching.promise(url);
                }
            })
        );
    },
    construct: {
        //  Build individual films
        film: (film) => {
            elements.main.innerHTML += `
                <div class="card my-4">
                    ${film.movie_banner && `<img src="${film.movie_banner}" class="card-img-top" alt="${film.title}">`}
                    <div class="card-body">
                        <h5 class="card-title">${film.title}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">${film.original_title} (${film.original_title_romanised})</h6>
                        <p class="card-text">${film.description}</p>
                    </div>
                </div>`;
        },
        //  Build individual vehicle
        vehicle: (vehicle) => {
            elements.main.innerHTML += `
                <div class="card mb-4">
                    <div class="card-body">
                        <h5 class="card-title">${vehicle.name}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">${vehicle.vehicle_class}</h6>
                        <p class="card-text">${vehicle.description}</p>
                    </div>
                </div>`;
        },
        //  Build individual location
        location: (location) => {
            elements.main.innerHTML += `
                <div class="card my-4">
                    <div class="card-body">
                        <h5 class="card-title">${location.name}</h5>
                    </div>
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item"><strong>Climate:</strong> ${location.climate}</li>
                        <li class="list-group-item"><strong>Terrain:</strong> ${location.terrain}</li>
                        <li class="list-group-item"><strong>Water coverage:</strong> ${location.surface_water}%</li>
                    </ul>
                </div>`;
        },
    },
    //  Clear a given element
    //  invoke callback function with given data;
    //  also checks if data is array
    repopulate: (data, element, callback) => {
        elements[element].innerHTML = "";
        if (data.constructor === Array) {
            data.forEach((d) => callback(d));
        } else {
            callback(data);
        }
    },
    //  Display the code of a function
    code: () => {
        elements.aside.innerHTML = elements.typeCheckInput.checked
            ? fetching.async.toString()
            : fetching.promise.toString();
    },
};

const fetching = {
    //  fetch via promise
    promise: (url) => {
        //  fetch from a given url
        fetch(baseUrl + url)
            //  convert received data to JSON
            .then((data) => data.json())
            //  PROCESS DATA HERE
            .then((data) => {
                building.repopulate(
                    data,
                    "main",
                    building.construct[url.slice(0, -1)]
                    );
                    
                    building.repopulate(data, "aside", building.code);
                })
                //  In case of errors, log them
                .catch((error) => {
                    console.log(error);
                });
    },
    
    //  async fetch
    //  notice ASYNC keyword
    async: async (url) => {
        //  fetch from a given URL
        //  notice AWAIT keyword
        const request = await fetch(baseUrl + url);
        
        //  in case of error
        if (!request.ok) {
            console.log(error);
            return;
        }
        
        //  convert received data to JSON
        //  notice AWAIT keyword
        const response = await request.json();

        //  PROCESS DATA HERE
        building.repopulate(
            response,
            "main",
            building.construct[url.slice(0, -1)]
        );

        building.repopulate(response, "aside", building.code);
    },
};

//  Run the script
building.setup();
