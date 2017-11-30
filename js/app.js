/**
 * Created by Costi on 11/30/2017.
 */
document.addEventListener('DOMContentLoaded', main);
var api = 'https://www.mihaicosti.ro/blog/wp-json/wp/v2';
var posts = [];
var postsDom = [];


function main() {


    getPosts(1);
    setTimeout(function() {
        createPostsDom();
    }, 1000); // poor man's async



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
    var request = new XMLHttpRequest();
    request.open('GET', url, true);

    request.onload = function (e) {
        if (request.readyState === 4) {

            // Check if the get was successful.

            if (request.status === 200) {
                data = JSON.parse(request.responseText);
                callback(data);
            } else {
                console.error(request.statusText);
            }
        }
    };

    request.send();
}

function getPosts(page) {
    getJSON(api + '/posts/?orderby=date', parsePosts);
}





function parsePosts(postsObj) {
    for(i in postsObj) {
        postImage = postsObj[i].better_featured_image == null ? '' : postsObj[i].better_featured_image.source_url;
        var post = new Post(postsObj[i].id, postsObj[i].title.rendered, postsObj[i].link, postImage, postsObj[i].content.rendered, postsObj[i].date);
        posts[post.id] = post;
    }
}

function createPostsDom() {
    for(i in posts) {
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


        articleContentContainer.setAttribute('class', 'article-content')
        articleContentContainer.innerHTML = post.content;



        // Post details Construction

        articleDetailsContainer.setAttribute('class', 'article-details');
        articleDetails.appendChild(document.createTextNode('Publicat la ' + new Date(post.date)))
        articleDetailsContainer.appendChild(articleDetails);


        // Adding them together

        articleContainer.appendChild(articleTitleContainer);
        articleContainer.appendChild(articleImageContainer);
        articleContainer.appendChild(articleContentContainer);
        articleContainer.appendChild(articleDetailsContainer);


        // Adding the article to the dom

        document.getElementsByClassName('grid-articles')[0].appendChild(articleContainer);




    }
}


function decodeEntities(encodedString) {
    var textArea = document.createElement('textarea');
    textArea.innerHTML = encodedString;
    return textArea.value;
}


