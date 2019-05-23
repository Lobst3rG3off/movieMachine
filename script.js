const app = {};

app.key = `384043517e4aa58b6327d0789e3e5851`;

app.random = (min, max) => {
    let num = Math.floor(Math.random() * (max - min)) + min;
    return num;
}



app.sortedMovies = [];

app.movieParse = (outputData, outputDataLength) => {

    for (let i = 0; i < 5; i++) {
        let randNum = app.random(0, outputData.results.length); 
        console.log(randNum)
        app.sortedMovies.push(outputData.results[randNum])
    }

    console.log(app.sortedMovies)

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