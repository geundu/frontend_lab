const ajax = new XMLHttpRequest();
const content = document.createElement('div');
const NEWS_URL = 'https://api.hnpwa.com/v0/news/1.json';
const CONTENT_URL = 'https://api.hnpwa.com/v0/item/@id.json';

ajax.open('GET', NEWS_URL, false);
ajax.send();

const newsFeed = JSON.parse(ajax.response);

document.getElementById('root').innerHTML = `
  <ul>
   <li>${newsFeed[0].title}</li>
   <li>${newsFeed[1].title}</li>
   <li>${newsFeed[2].title}</li>
  </ul>
`;
/*
const ul = document.createElement('ul');

window.addEventListener('hashchange', function () {
  console.log(location.hash);
  const id = this.location.hash.substr(1);
  ajax.open('GET', CONTENT_URL.replace('@id', id), false);
  ajax.send();
});
*/