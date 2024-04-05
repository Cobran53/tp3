'use strict';
/* eslint-env browser, es6 */

// Pas besoin d'évenement window.onload puisqu'on utilise l'attribut defer
// lorsque l'on charge notre script

console.log('ah, le chat finit par s\'échapper');

function loadGenres() {
    fetch('http://localhost:3000/genres')
        .then(
            response => {
                if (response.ok) {
                    return response.json();
                }
                else {
                    console.log('Response pas ok pour obtenir les genres');
                }
            }
        )
        .then (
            genres =>  {
                const select = document.querySelector('#main nav form select');
                select.addEventListener('change', evt => {
                    console.log(evt.target.value);
                    loadArtists(genres, evt.target.value);
                });
                genres.forEach(genre => {
                    const option = document.createElement('option');
                    option.value = genre['id'];
                    option.textContent = genre['name'];
                    select.add(option);
                });
                loadArtists(genres, select.firstChild.value);
            }
        )
        .catch(
            e => {
                console.log('Erreur', e);
                return {};
            }
        );
}

async function loadArtists(genres, genre_name) {
    const h2 = document.querySelector('#main h2');
    const genre = genres.find(genre => genre.id === genre_name);
    h2.textContent = `Top ${genre['name']} artists`;
    document.querySelector('#main > p').textContent = genre['description'];

    const artists_raw = await fetch(`http://localhost:3000/genres/${genre_name}/artists`);
    const artists = await artists_raw.json();
    console.log(artists);

    const ul = document.querySelector('#main ul');
    ul.innerHTML = '';
    artists.forEach(artist => {
        console.log(artist);

        const li = document.createElement('li');
        const h3 = document.createElement('h3');
        const a = document.createElement('a');
        const img = document.createElement('img');
        h3.textContent = artist.name;

        img.setAttribute('src', artist.photo);
        ul.appendChild(li);
        li.appendChild(a);
        li.appendChild(img);
        a.appendChild(h3);
    });

}
loadGenres();