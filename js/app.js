/**
 * Created by Costi on 11/30/2017.
 */
document.addEventListener('DOMContentLoaded', main);
var api = 'https://www.mihaicosti.ro/blog/wp-json/wp/v2';
var posts = [];
var curr_page = 1;
var per_page = 5;


function main() {


    getPosts(curr_page); // first call of the page;



    document.querySelectorAll('.changePage').forEach(function(e) {
        e.addEventListener('click', function() {changePage(e.getAttribute('data-increment'))}, true);
    });
    document.getElementsByClassName('to-top')[0].addEventListener('click', scrollToTop);


}

function Post(id, title, link, image, content, date) {
    this.id = id;
    this.title = title;
    this.link = link;
    this.image = image;
    this.content = content;
    this.date = date;
}


function getJSON(url, callback) {
    var loader = document.getElementsByClassName('loader')[0];
    loader.style.display = 'block';
    var request = new XMLHttpRequest();
    request.open('GET', url, true);

    request.onload = function (e) {
        if (request.readyState === 4) {

            // Check if the get was successful.

            if (request.status === 200) {
                data = JSON.parse(request.responseText);
                loader.style.display = 'none';
                callback(data); // what function to be called when the query is done
            } else {
                console.error(request.statusText);
            }
        }
    };

    request.send();
}

function getPosts(page) {
    getJSON(api + '/posts/?per_page=' + per_page + '&page=' + page, parsePosts);
}





function parsePosts(postsObj) {
    for(i in postsObj) {
        postImage = postsObj[i].better_featured_image == null ? '' : postsObj[i].better_featured_image.source_url;
        var post = new Post(postsObj[i].id, postsObj[i].title.rendered, postsObj[i].link, postImage, postsObj[i].content.rendered, postsObj[i].date);
        posts[post.id] = post;
    }

    createPostsDom();
    document.querySelectorAll('.article-loader').forEach(function(e) {
        e.remove();
    })
}

function createPostsDom() {
    var articlesContainer = document.getElementsByClassName('grid-articles')[0];
    articlesContainer.innerHTML = ''; // empty the container for change pages;
    for(i in posts) {

        // everything here is pretty self-explanatory
        var post = posts[i];
        var
            articleContainer = document.createElement('div'),
            articleTitleContainer = document.createElement('div'),
            articleImageContainer = document.createElement('div'),
            articleContentContainer = document.createElement('div'),
            articleDetailsContainer = document.createElement('div');

        var
            articleTitle = document.createElement('a'),
            articleImage = document.createElement('img'),
            articleDetails = document.createElement('p');


        // Article Title Construction

        articleContainer.setAttribute('id', post.id);
        articleContainer.setAttribute('class', 'article');

        articleTitleContainer.setAttribute('class', 'article-title');
        articleTitle.appendChild(document.createTextNode(decodeEntities(post.title)));
        articleTitle.setAttribute('href', post.link);
        articleTitle.setAttribute('target', '_blank');
        articleTitleContainer.appendChild(articleTitle);


        // Article Image Construction

        articleImageContainer.setAttribute('class', 'article-image');
        articleImage.setAttribute('src', post.image);
        articleImageContainer.appendChild(articleImage);

        // Article Content Construction


        articleContentContainer.setAttribute('class', 'article-content');
        articleContentContainer.innerHTML = post.content;



        // Post details Construction

        articleDetailsContainer.setAttribute('class', 'article-details');
        articleDetails.appendChild(document.createTextNode('Publicat la ' + new Date(post.date)));
        articleDetailsContainer.appendChild(articleDetails);


        // Adding them together

        articleContainer.appendChild(articleTitleContainer);
        articleContainer.appendChild(articleImageContainer);
        articleContainer.appendChild(articleContentContainer);
        articleContainer.appendChild(articleDetailsContainer);


        // Adding the article to the dom
        articlesContainer.insertBefore(articleContainer, articlesContainer.firstChild); // for proper ordering


        unfade(articleContainer); //just animation for fade in
    }

    posts = []; // empty the variable
}


function changePage(increment) {
    increment = parseInt(increment);
    curr_page += increment;
    //TODO store the data so it doesn't make a call every time when going to a previously seen page

    var prevButton = document.getElementsByClassName('prev-page')[0];

    if(curr_page == 1) {
        prevButton.setAttribute('disabled', ''); //making sure that the user doesn't try to access 0 or negative pages
    }
    else {
        prevButton.removeAttribute('disabled');
        //TODO should figure out the number of pages from the API so the next button can be disabled as well
    }
    if(curr_page >= 1) { // in case the user removed the disabled attribute
        getPosts(curr_page);
        document.getElementsByClassName('page')[0].innerHTML = 'Pagina: ' + curr_page;
    }




}






function decodeEntities(encodedString) { //transforming sql stored characters into 'normal' characters
    var textArea = document.createElement('textarea');
    textArea.innerHTML = encodedString;
    return textArea.value;
}

function unfade(element) {
    var op = 0.1;  // initial opacity
    element.style.display = 'grid';
    var timer = setInterval(function () {
        if (op >= 1){
            clearInterval(timer);
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op += op * 0.1;
    }, 10);
}


function scrollToTop() {
    window.scroll({
        behavior: 'smooth',
        left: 0,
        top: 0 //bottom
    });
}


