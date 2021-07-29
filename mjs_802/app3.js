const ajax = new XMLHttpRequest();
const container = document.getElementById('root');
const content = document.createElement('div');
const NEWS_URL = 'https://api.hnpwa.com/v0/news/1.json';
const CONTENT_URL = 'https://api.hnpwa.com/v0/item/@id.json';
/*
실제로 getData()라는 함수를 안 보이게 해놓고 변경된 코드를 보면 굉장히 심플하다.
실제로 네트워크를 통해서 데이터를 가져오고 그것을 JS 객체로 변환하는 코드 자체가
모두 없어지고 getData()에 위임해버렸다.
getData가 동작하는 데에 필요한 url만 넘겨주는 코드로 대체되었기 때문에
사용하는 코드쪽에서는 단순해짐
네트워크 사용이 많아지더라도 부담없이 코드를 늘려려 양이 늘어나도 코드의 복잡도가 늘어나는 일은 없다.
*/

function getData(url) {
  ajax.open('GET', url, false);
  ajax.send();
  return JSON.parse(ajax.response);
}

const newsFeed = getData(NEWS_URL);
const ul = document.createElement('ul');

window.addEventListener('hashchange', function () {
  const id = location.hash.substr(1);
  const newsContent = getData(CONTENT_URL.replace('@id', id));
  const title = document.createElement('h1');
  title.innerHTML = newsContent.title;
  content.appendChild(title);
});

for (let i = 0; i < 10; i++) {
  const div = document.createElement('div');
  div.innerHTML = `
  <li>
    <a href='#${newsFeed[i].id}'>${newsFeed[i].title}(${newsFeed[i].comments_count})</a>
  </li>
  `;
  ul.appendChild(div);
}

container.appendChild(ul);
container.appendChild(content);
