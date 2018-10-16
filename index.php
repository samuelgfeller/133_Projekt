<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Stundenplan GIBM</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/css/bootstrap.min.css">
    <link rel="stylesheet" href="style.css">
</head>
<body>
<div class="container">
    <header>
        <h1>Stundenplan GIBM</h1>
    </header>
    <form class="form-inline">
        <div class="form-group">
            <label for="berufsgruppe">Berufsgruppe</label><br>
            <select id="berufsgruppe" class="form-control">
            </select><br>
            <br><label for="klassenauswahl">Klassenauswahl</label><br>
            <select id="klassenauswahl" class="form-control">
                <option>Bitte Berufsgruppe auswählen...</option>
            </select>
        </div>
    </form>
    <h3>Ausgabe</h3>
    <nav aria-label="Tafel Navigation" id="paginationNav">
        <ul class="pagination">
            <li class="page-item">
                <a class="page-link" href="#" aria-label="Previous">
                    <span aria-hidden="true">&laquo;</span>
                    <span class="sr-only">Previous</span>
                </a>
            </li>
            <li class="page-item"><a class="page-link" id="weekYear">37-2018</a></li>
            <li class="page-item">
                <a class="page-link" href="#" aria-label="Next">
                    <span aria-hidden="true">&raquo;</span>
                    <span class="sr-only">Next</span>
                </a>
            </li>
        </ul>
    </nav>
    <div id="output"></div>
    <h4 id="noResult">Für diese Woche wurden leider keine Ergebnisse gefunden</h4>
    <script src="https://code.jquery.com/jquery-3.3.1.min.js"
            integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8="
            crossorigin="anonymous"></script>
    <script src="main.js"></script>
</div>
</body>
</html>



