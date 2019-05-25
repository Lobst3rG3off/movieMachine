const app = {};

app.key = `384043517e4aa58b6327d0789e3e5851`;
app.searchTerm = undefined;

app.random = (min, max) => {
    let num = Math.floor(Math.random() * (max - min)) + min;
    return num;
}

app.showDetails = (sortedMovies) => {
    $('.movieItem').on('click', (e) => {
        let $clickedDiv = $(e.target).closest('.movieItem');
        let clickedDivId = $clickedDiv.data('id');
        sortedMovies.forEach( (movie) => {
            if (clickedDivId === movie.id) {
                $clickedDiv.find('.movieOverview').empty();
                const $movieOverview = $(`<div class="movieOverview">
                <p><span>Synopsis:</span> ${movie.overview}</p>
                <p><span>Release date:</span> ${movie.release_date}</p>
                <p><span>opularity Rating:</span>P ${movie.popularity}</p>
                <p><span>Voter Average:</span> ${movie.vote_average}</p>
                </div>`)
                $movieOverview.hide().fadeIn(1500).appendTo($clickedDiv);

               
                const $movieItemHeight = $('.movieItem').height();
                $('html, body').animate({
                    scrollTop: $($movieOverview).offset().top - ($movieItemHeight / 2)
                }, 1000);
            }
        })
    })
}

app.movieAppend = (sortedMovies) => {
    $('.movieList').empty()
    $('.queryResult').empty()
    $('.queryResult').append(`<h2>You searched for: ${app.searchTerm}</h2>
    <p> Click Poster for More Infomation</p>
    `);
    sortedMovies.forEach( (item) => {

        if (item.poster_path === null) {
            const boilerPlate = `<div class="movieItem" data-id="${item.id}">
            <img src="./assets/no_poster.png" alt="${item.title}" data-id="${item.id}"/>
            <h2>${item.title}</h2>
            </div>`
            $('.movieList').append(boilerPlate);
        } else {
            const boilerPlate = `<div class="movieItem" data-id="${item.id}">
            <img src="https://image.tmdb.org/t/p/w600_and_h900_bestv2${item.poster_path}" alt="${item.title}" data-id="${item.id}"/>
            <h2>${item.title}</h2>
            </div>`
            $('.movieList').append(boilerPlate).hide().fadeIn(500);;
        }
    });
    app.showDetails(sortedMovies);
    $('main').append(`<button>
            <a href="#hero">Back to Top</a>
        </button>`)
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
            $('.movieList').append(`<h2>You searched for: ${app.searchTerm}</h2>`);
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

    // console.log(outputDataLength)
    // console.log(genNumbers)
    sortMovies();
    // console.log(sortedMovies)
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
        const outputDataLength = outputData.results.length;
        app.movieParse(outputData, outputDataLength)
    })
}

app.init = () => {
    $('form').on('submit', function (event) {
        event.preventDefault();
        if ($("#search").val() != '') {
            app.searchTerm = $('#search').val();
            app.getMovies(app.searchTerm);
            $('html, body').animate({
                scrollTop: $(".movieList").offset().top
            }, 2000);
            $("#search").val('');
        } else {
            alert("Please enter a word!");
        }
    });   
}


$(function () {
    app.init()
});