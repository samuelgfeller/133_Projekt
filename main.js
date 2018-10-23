// Warten bis alles geladen wurde
$(document).ready(function () {
    $.ajax({
        url: "http://sandbox.gibm.ch/berufe.php",
        async: false
    }).done(function (data) {
        // Standardauswahl setzten und nicht auswählbar machen
        $('#berufsgruppe').append('<option disabled selected>Bitte auswählen...</option>');
        // Klassenauswahl nicht auswählbar machen
        $('#klassenauswahl').prop('disabled', 'disabled');

        // Über alle Resultate gehen
        $.each(data, function (key, value) {
            // Erstes Dropdown füllen
            $('#berufsgruppe').append('<option value=' + value.beruf_id + '>' + value.beruf_name + '</option>');
        }); // end each
        // Schlägt der AJAX-Rquest fehl?
    }).fail(function (jqXHR, textStatus, errorThrown) {
        // Display the error on the screen
        alert('Fehler bei Berufsgruppe: ' + jqXHR.responseText + ', ' + textStatus);
    }); // end getJSON

    if (getCookie('beruf') !== '') {
        $("#berufsgruppe option[value='" + getCookie('beruf') + "']").prop('selected', true);
        setKlassenauswahl(getCookie('beruf'));
    } // End if cookie berufsgruppe is empty
    // Event abfangen wenn Berufsgruppe gewechselt wird.
    $('#berufsgruppe').on('change', function () {
        // Variable Gruppe erstellen und Füllen mit dem ausgewähltem Beruf
        var beruf = $('#berufsgruppe option:selected').val();
        // Ausgewählte Berufsgruppe in ein Cookie schreiben
        setcookie('beruf', beruf);
        // Klassenauswahlcookie löschen
        document.cookie = "klasse=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
        // Element färben
        highlight($('#klassenauswahl'));
        // Klassenauswahl füllen
        setKlassenauswahl(beruf);
    }); // end Berufsgruppe

    // Klickevents abfangen in der Pagination
    $("[aria-label=Previous]").click(function () {
        // Stundenplan langsam ausblenden
        $('#output table').fadeOut(500, function () {
            // Stundenplan generieren mit vorheriger Woche
            generateTafel(getPreviousNextWeekYear('previous'));
        });
    });
    $("[aria-label=Next]").click(function () {
        // Stundenplan langsam ausblenden
        $('#output table').fadeOut(500, function () {
            // Stundenplan generieren mit nächsten Woche
            generateTafel(getPreviousNextWeekYear('next'));
        });
    });

    function setKlassenauswahl(gruppe) {
        // Klassenauswahl auswählbar machen
        $('#klassenauswahl').prop('disabled', false);

        // Zweites Dropdown in variable klassenauswahl setzen
        var klassenauswahl = $('#klassenauswahl');
        // Dropdown und output leeren falls noch Daten vorhanden wären
        klassenauswahl.empty();
        $('#output').empty();
        // Pagination verstecken
        $('#paginationNav').hide();
        // Auswahl auffordern
        klassenauswahl.append('<option disabled selected>Bitte auswählen...</option>');
        // API ansprechen mit dem Parameter
        $.ajax({
            url: 'http://sandbox.gibm.ch/klassen.php?beruf_id=' + gruppe,
            async: false
        }).done(function (data) {
            $('.squares').show();
            // Über Resultate gehen
            $.each(data, function (key, value) {
                // Dropdown füllen mit Klassennamen
                klassenauswahl.append('<option value=' + value.klasse_id + '>' + value.klasse_longname + '</option>');
            }); // end each
            // Schlägt der AJAX-Rquest fehl?
        }).fail(function (jqXHR, textStatus, errorThrown) {
            // Display the error on the screen
            alert('Fehler bei Klassenauswahl: ' + jqXHR.responseText + ', ' + textStatus);
        }); // end getJSON

        if (getCookie('klasse') !== '') {
            $("#klassenauswahl option[value='" + getCookie('klasse') + "']").prop('selected', true);
            generateTafel(getWeekNumber(new Date()));
        }
        // Event wenn die Klassenauswahl ausgeählt wird
        $('#klassenauswahl').on('change', function () {
            // Ausgewählte Klassenauswahl in ein Cookie schreiben
            setcookie('klasse', $('#klassenauswahl').val());
            // Ergebnisse genereiern dafür Funktion generateTafel aufrufen und als Argument die actuelle Wochenanzahl
            generateTafel(getWeekNumber(new Date()));
        }); // end onChange Klassenauswahl

    }

    /**
     * Returns a next or previous week in this format: ww-yyyy
     * @param plusMinus expected string 'next' or 'previous'
     */
    function getPreviousNextWeekYear(plusMinus) {
        // Wert der Pagination nehmen und zwei Teile daraus machen mit Woche und Jahr
        var weekYear = $('#weekYear').text().split('-');
        // Variable Woche und Jahr setzten mit den vorher herausgefundenen Werten
        var week = parseInt(weekYear[0]);
        var year = parseInt(weekYear[1]);
        // Ist der Parameter 'next' ?
        if (plusMinus === 'next') {
            // 1 der Woche hinzufügen
            week += 1;
            // Ist der Parameter 'previous'
        } else if (plusMinus === 'previous') {
            // 1 der Woche nehmen
            week -= 1;
        }
        // Woche und Jahr umstellen
        // Ist die maximale Anzahl Wochen erreicht ?
        if (week > 52) {
            // Es wird ein Jahr hinzugefügt und die Woche ist 1
            year += 1;
            week = 1;
            // Ist die minimale Anzahl Wochen erreicht ?
        } else if (week < 1) {
            // Es wird ein Jahr substrahiert und die Woche ist 52
            year -= 1;
            week = 52;
        }
        // Woche und Jahr zusammenführen mit einem Bindestrich
        return week + '-' + year;
    }

    /**
     * Tabelle mit Stundenplan generieren
     * @param date
     */
    function generateTafel(date) {
        // inhalt von Output div leeren
        $('#output').empty();
        // Die Meldung dass keine Resultate gefunden wurden wird versteckt
        $('#noResult').hide();
        // tabelle erstellen
        $('#output').append('<div class="table-responsive"><table class="table table-striped"></table></div>');
        //Woche angeben in der Pagination
        $('#weekYear').text(date);
        // Tabellen header erstellen
        $('#output table').addClass('table').append('<thead><tr><th>Datum</th><th>Wochentag</th><th>Von</th><th>Bis</th><th>Lehrer</th><th>Fach</th><th>Zimmer</th></tr></thead>' +
            '<tbody id="tableContent">');
        // $('#tableContent').hide();
        $('#output').append('<span class="glyphicon glyphicon glyphicon-repeat glyphicon-animate"></span>');

        // Stundenplan infos abfragen mit als Parameter die ID der Klasse
        $.ajax({
            url: 'http://sandbox.gibm.ch/tafel.php?klasse_id=' + $('#klassenauswahl').val() + '&woche=' + date,
            async: false
        }).done(function (plan) {
            // Pagination zeigen
            $('#paginationNav').show();

            if (!$.isEmptyObject(plan)) {

                $('.glyphicon').hide();

                // Über jedes Resultat / Stundenplan gehen
                $.each(plan, function (key, value) {
                    // Körper der Tebelle erstellen und mit werten füllen
                    $('<tr><td scope="col">' + formatDate(value.tafel_datum) +
                        '</td><td scope="col">' + getDayName(value.tafel_wochentag) +
                        '</td><td scope="col">' + value.tafel_von +
                        '</td><td scope="col">' + value.tafel_bis +
                        '</td><td scope="col">' + value.tafel_lehrer +
                        '</td><td scope="col">' + value.tafel_longfach +
                        '</td><td scope="col">' + value.tafel_raum +
                        // Body zur tabelle hinzufügen
                        '</tr>').appendTo($('#output table'));
                }); // End each
                // Close tbody
                $('#tableContent').addClass('table').append('</tbody>').addClass('tableContentAnimation');
                $('#tableContent').fadeIn(500);


                // Prüfen ob JSON leer ist
            } else {
                $('.glyphicon').hide();

                // Falls das JSON leer ist zeigt es die entsprechende Meldung an
                $('#noResult').show();
            }
            // Schlägt der AJAX-Rquest fehl?
        }).fail(function (jqXHR, textStatus, errorThrown) {
            // Display the error on the screen
            alert('Fehler beim Stundenplan: ' + jqXHR.responseText + ', ' + textStatus);
        }); // end getJSON
    } // End generateTafel

    /**
     * Wochentagname bekommen
     * @param weekday
     * @returns {string}
     */
    function getDayName(weekday) {
        //Array of daynames
        var dayNames = [
            "Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"
        ];
        // Return dayname
        return dayNames[weekday];
    }

    /**
     * Element im DOM für eine Sekunde färben
     * @param element
     */
    function highlight(element) {
        // Originale Farbe nehmen
        var originalColor = element.css("background");
        // Neue Farbe setzen
        element.css("background", "#FFFF33").css('box-shadow', '0px 0px 10px #FFFF33');
        // Original Farbe wiederherstellen nach 1s
        setTimeout(function () {
            // Farbe setzen
            element.css('box-shadow', 'none').css("background", originalColor);
        }, 1000);
    }

    /**
     * Gibt Aktuelle Woche und Jahr zurück mit einem Bindestrich
     * Ich habe die FUnkion ein wenig abgeändert aber sie Stammt von Stackoverflow
     *
     * Source: https://stackoverflow.com/questions/6117814/get-week-of-year-in-javascript-like-in-php
     */
    function getWeekNumber(d) {
        // Copy date so don't modify original
        d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
        // Set to nearest Thursday: current date + 4 - current day number
        // Make Sunday's day number 7
        d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
        // Get first day of year
        var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        // Calculate full weeks to nearest Thursday
        var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1) / 7);
        // Return array of year and week number
        return weekNo + '-' + d.getUTCFullYear();
    }

    /**
     * Formatiert datum und gibt Tag, Monat und Jahr zurück
     * Code stammt von: https://stackoverflow.com/a/23593099/9013718
     * @param date
     * @returns {string}
     */
    function formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [day, month, year].join('.');
    }

    /**
     * Diese Funktion setzt ein Cookie und es lauft nach 14 Tagen ab
     *
     * Der Code stammt von: https://stackoverflow.com/a/32498236/9013718
     *
     * @param cookieName
     * @param cookieValue
     */
    function setcookie(cookieName, cookieValue) {
        var today = new Date();
        var expire = new Date();
        expire.setTime(today.getTime() + 3600000 * 24 * 14);
        document.cookie = cookieName + "=" + escape(cookieValue) + ";expires=" + expire.toGMTString();
    }

    /**
     * Funktion welche die Cookies wiedergibt
     * Der Code stammt von w3schools: https://www.w3schools.com/js/js_cookies.asp
     * @param cname
     * @returns {*}
     */
    function getCookie(cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }
}); //end ready
