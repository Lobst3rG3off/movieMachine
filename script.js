const app = {};

app.key = `384043517e4aa58b6327d0789e3e5851`;


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
    }).then(function (results) {
        console.log(results)
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