const app = {};

app.key = `384043517e4aa58b6327d0789e3e5851`;

app.random = (min, max) => {
    let num = Math.floor(Math.random() * (max - min)) + min;
    return num;
}


app.showDetails = (sortedMovies) => {
    $('.movieItem').on('click', (e) => {
        let $clickedDiv = $(e.target).closest('.movieItem');
        // console.log(clickedDiv.data('id'))
        let clickedDivId = $clickedDiv.data('id');
        // console.log(clickedDiv);
        // console.log(clickedDivId);
        // console.log(sortedMovies)
        sortedMovies.forEach( (movie) => {
            if (clickedDivId === movie.id) {
                $clickedDiv.find('.movieOverview').empty();
                // console.log(movie.overview)
                const movieOverview = $(`<div class="movieOverview">
                <p>Synopsis: ${movie.overview}</p>
                <p>Release date: ${movie.release_date}</p>
                <p>Popularity Rating: ${movie.popularity}</p>
                <p>Voter Average: ${movie.vote_average}</p>
                </div>`)
                // $clickedDiv.append(movieOverview);    
                movieOverview.hide().fadeIn(1500).appendTo($clickedDiv);
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
        </div>`
        $('.movieList').append(boilerPlate);
    });
    app.showDetails(sortedMovies);
}

app.movieParse = (outputData, outputDataLength) => {
    let sortedMovies = [];
    let genNumbers = [];

    let randNum = undefined;

    function sortMovies() {

        if (outputDataLength < 6 && outputDataLength != 0) {
            for (i = 0; i < outputDataLength; i++) {
                sortedMovies.push(outputData.results[i]);
            }
            app.movieAppend(sortedMovies);
        } else if (outputDataLength === 0) {
            $('.movieList').empty()
            $('.movieList').append(`<div class="movieItem">
                <h2>Sorry, we couldn't find a relevant movie :(</h2>
                </div>`)
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

    console.log(outputDataLength)
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