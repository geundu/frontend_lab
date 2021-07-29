const container = document.getElementById('root');

const ajax = new XMLHttpRequest();
const content = document.createElement('div');
const NEWS_URL = 'https://api.hnpwa.com/v0/news/1.json';
const CONTENT_URL = 'https://api.hnpwa.com/v0/item/@id.json';

// getData() 호출할 때마다 주소를 새로 받아와야 한다. - getData() 가 그것을 알 수 없으므로
// 함수를 만들고, 그 함수가 할 일의 코드를 묶어주고 그 코드가 동작하기 위한 입력값을 정의
// 하여 사용해주고 함수의 처리 결과를 return으로 변환해주고 두 군데의 사용처가 있다.

function getData(url) {
  ajax.open('GET', NEWS_URL, false);
  ajax.send();
  return JSON.parse(ajax.response);
}

// 목록처리 코드는 함수로 묶여있지 않으므로 목록 이벤트가 발생했을 때 호출할 수 없다.
// 그러니까 함수로 꺼내줘야 한다.
function newsFeed() {
  const newsFeed = getData(NEWS_URL);
  const newsList = [];
  newsList.push('<ul>');
  for (let i = 0; i < 10; i++) {
    const div = document.createElement('div');
    newsList.push(`
    <li>
      <a href="#${newsFeed[i].id}">
      ${newsFeed[i].title}(${newsFeed[i].comments_count})
      </a>
    </li>
  `);
  }
  newsList.push('</ul>');
  container.innerHTML = newsList.join('');
}

function newsDetail() {
  // localhost:1234/#123456 -> #같은 경우 RESTful에서는 ''로 바뀜
  const id = location.hash.substr(1);
  const newsContent = getData(CONTENT_URL.replace('@id', id));
  // console.log(newsContent);
  const title = document.createElement('h1');

  container.innerHTML = `
  <h1>${newsContent.title}</h1>
  <div>
    <a href="#">목록으로</a>
  </div>
  `;
}

// 라우터에서 화면 전환하는 것을 구현하면 됨
function router() {
  const routePath = location.hash;
  if (routePath === '') {
    newsFeed();
  } else {
    newsDetail();
  }
}
// 라우터를 호출하는 코드를 만들어야 한다.
/*
라우터가 동작하는 방식을 생각해보자.
라우터는 화면이 전환되어야 할 때 라우터가 판단해서 해당하는 화면으로 전환시키면 된다.
그런데 지금 화면 전환되어야 할 때라는 것은 무엇인가?
기존의 hashchange 해시가 바뀌는 것을 화면의 전환을 위한 트리거로 사용하고 있었다.
그런데 방금 전 hashchange에 newsDetail을 걸었다.
즉, hash가 바뀌면 무조건 그것은 글 내용을 보는 것이다. 라는 의미임.
그러나 화면이 여러 개이면 hash가 바뀌었을 경우 글 내용 혹은 목록을 보여줄 수 있고
이렇게 되면 hash의 종류가 많아지므로 페이지의 종류가 많아진다면 흠미....
바로 이 hash를 라우터에게 주면 될 것이다.
바로 이 hashchange가 일어났을 때 동작하는 함수를 기존의 newsDetail이 아니라
라우터에게 주면 라우터가 hash가 바뀔 때마다 동작하게 되고 그럼 그 라우터 안에서 어떤
hash인가에 따라 글 목록을 보여줄 때도 있고 내용을 보여줄 때도 있게 될 것이다.
 */
window.addEventListener('hashchange', router);

router();

// for (let i = 0; i < 10; i++) {
//   const li = document.createElement('li');
//   const a = document.createElement('a');
//   a.href = `#${newsFeed[i].id}`;
//   a.innerHTML = `${newsFeed[i].title}(${newsFeed[i].comments_count})`;
//   a.addEventListener('click', function () {});
//   li.appendChild(a);
//   ul.appendChild(li);
// }
// container.appendChild(ul);
// container.appendChild(content);
