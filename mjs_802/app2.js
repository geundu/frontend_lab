const ajax = new XMLHttpRequest();
const container = document.getElementById('root');
const content = document.createElement('div');
const NEWS_URL = 'https://api.hnpwa.com/v0/news/1.json';
const CONTENT_URL = 'https://api.hnpwa.com/v0/item/@id.json';

ajax.open('GET', NEWS_URL, false);
ajax.send();

const newsFeed = JSON.parse(ajax.response);

const ul = document.createElement('ul');

window.addEventListener('hashchange', function () {
  const id = location.hash.substr(1);
  console.log(`hash가 변경됨 ==> ${id}`);
  ajax.open('GET', CONTENT_URL.replace('@id', id), false);
  ajax.send();

  const newsContent = JSON.parse(ajax.response);
  console.log(newsContent);
  const title = document.createElement('h1');
  title.innerHTML = newsContent.title;
  content.appendChild(title);
});

for (let i = 0; i < 10; i++) {
  const li = document.createElement('li');
  const a = document.createElement('a');
  a.href = `#${newsFeed[i].id}`;
  a.innerHTML = `${newsFeed[i].title}(${newsFeed[i].comments_count})`;
  li.appendChild(a);
  ul.appendChild(li);
}

container.appendChild(ul);
container.appendChild(content);

/*
createElement()로 태그가 이루어져있기 때문에 코드 가독성이 매우 떨어진다.
= 최대한 DOM API를 사용하지 말아야 한다.
*/