const app = {};

app.key = `384043517e4aa58b6327d0789e3e5851`;

app.random = (min, max) => {
    let num = Math.floor(Math.random() * (max - min)) + min;
    return num;
}


app.showDetails = (sortedMovies) => {
    $('.movieItem').on('click', (e) => {
        let clickedDiv = $(e.target);
        // console.log(clickedDiv.data('id'))
        let clickedDivId = clickedDiv.data('id')
        // console.log(sortedMovies)
        sortedMovies.forEach( (movie) => {
            if (clickedDivId === movie.id) {
                console.log(movie.overview)
                // const modalDiv = `<div class="modal">
                //                     <p>${movie.overview}</p>
                //                  </div>`
                // $('.movieList').append(boilerPlate);    
            }
        })
    })
}

app.movieAppend = (sortedMovies) => {
    $('.movieList').empty()
    sortedMovies.forEach( (item) => {
        const boilerPlate = `<div class="movieItem" data-id="${item.id}">
        <img src="https://image.tmdb.org/t/p/w600_and_h900_bestv2${item.poster_path}" alt="${item.title}" data-id="${item.id}"/>
        <h2>${item.title}</h2>
        <p>${item.overview}</p>
        </div>`
        $('.movieList').append(boilerPlate);
    });
    app.showDetails(sortedMovies);
}

// else if outputDataLength = 0 then throw error

app.movieParse = (outputData, outputDataLength) => {
    let sortedMovies = [];
    let genNumbers = [];
  
    let randNum = undefined;
   
    function sortMovies() {
        if (outputDataLength < 6) {
            for (i = 0; i < outputDataLength; i++) {
                sortedMovies.push(outputData.results[i]);
            } 
            app.movieAppend(sortedMovies);
        } else {
            let randNum = app.random(0, outputDataLength);
            if (genNumbers.includes(randNum)) {
                sortMovies();
            } else if (sortedMovies.length === 6) {
                app.movieAppend(sortedMovies);
                return
            } else {
                genNumbers.push(randNum)
                sortedMovies.push(outputData.results[randNum]);
                sortMovies();
                }
            }
        }
    console.log(genNumbers)
    sortMovies();
    console.log(sortedMovies)
}

app.getMovies = (word) => {
    $.ajax({
        url: `https://api.themoviedb.org/3/search/movie`,
        method: 'GET',
        dataType: 'json',
        data: {
            api_key: app.key,
            language: `en-US`,
            query: word,
            page: 1
        }
    }).then(function (data) {
        const outputData = data;
        // console.log(outputData)
        // console.log(outputData.results.length)
        const outputDataLength = outputData.results.length;
        app.movieParse(outputData, outputDataLength)
    })
}


app.init = () => {
    $('form').on('submit', function (event) {
        event.preventDefault();
        if ($("#search").val() != '') {
            const searchTerm = $('#search').val();
            // $('#search').val('');
            app.getMovies(searchTerm);
        } else {
            alert("Please enter a word!");
        }
    });   
}


$(function () {
    app.init()
});