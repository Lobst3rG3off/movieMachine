const app = {};

app.key = `384043517e4aa58b6327d0789e3e5851`;

app.random = (min, max) => {
    let num = Math.floor(Math.random() * (max - min)) + min;
    return num;
}


// pass sortedMovies to new function
// on click of movie div, grab info and append to new div. maybe overlay?

app.movieAppend = (sortedMovies) => {
    $('.movieList').empty()
    sortedMovies.forEach( (item) => {
        const boilerPlate = `<div class = "movieItem">
        <img src="https://image.tmdb.org/t/p/w600_and_h900_bestv2${item.poster_path}" alt="${item.title}"/>
        <h2>${item.title}</h2>
        <p>${item.overview}</p>
        </div>`

        $('.movieList').append(boilerPlate);
    });
    console.log(sortedMovies)
}

app.movieParse = (outputData, outputDataLength) => {
    let sortedMovies = [];
    let genNumbers = [];

    let randNum = undefined;

    function sortMovies() {
        if (outputData.results.length < 5) {
            for (i = 0; i < outputDataLength; i++) {
                sortedMovies.push(outputData.results[i]);
            }
            app.movieAppend(sortedMovies);
        } else {
            let randNum = app.random(0, outputDataLength);
            if (genNumbers.includes(randNum)) {
                sortMovies();
            } else if (sortedMovies.length === 5) {
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

    let movieOutputArray = app.movieParse.sortedMovies.map(item => {
        return outputData.results[item]
    })

    console.log(movieOutputArray)
    app.movieAppend(movieOutputArray);

}


// app.movieParse = (outputData, outputDataLength) => {
    
//     const sortedMoviesIndexes = [];

// let lessThanFive = true;

// while (lessThanFive) {
//     let randNum = app.random(0, outputData.results.length); 
    
//     if (sortedMoviesIndexes.indexOf(randNum) === -1) 
//     { sortedMoviesIndexes.push(randNum) } 

//     if (sortedMoviesIndexes.length === 5) {
//  lessThanFive = false
//     }
    // if (sortedMoviesIndexes.length < 5) {
    //     console.log(sortedMoviesIndexes.length)
    //     return
    // }
// }

    // for (let i = 0; i < 5; i++) {





    //     let randNum = app.random(0, outputData.results.length); 
    //     // console.log(randNum)
    //     // console.log(outputData.results[randNum])
    //     // sortedMovies.push(outputData.results[randNum])
    //     if (sortedMoviesIndexes.indexOf(randNum)=== -1)
    //     { sortedMoviesIndexes.push(randNum)}
    // }


   







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