const ajax = new XMLHttpRequest();
const container = document.getElementById('root');
const content = document.createElement('div');
const NEWS_URL = 'https://api.hnpwa.com/v0/news/1.json';
const CONTENT_URL = 'https://api.hnpwa.com/v0/item/@id.json';

function getData(url) {
  ajax.open('GET', url, false);
  ajax.send();
  return JSON.parse(ajax.response);
}

function newsFeed() {
  const newsFeed = getData(NEWS_URL);
  const newsList = [];

  newsList.push('<ul>');
  for (let i = 0; i < 10; i++) {
    const div = document.createElement('div');
    newsList.push(
      `
      <li>
      <a href='#${newsFeed[i].id}'>${newsFeed[i].title}(${newsFeed[i].comments_count})</a>
    </li>
    `
    );
  }
  newsList.push('</ul>');
  container.innerHTML = newsList.join('');
}

/*
또 한 가지는 라우터에서 글 내용 화면도 호출해야 하고
글 내용은 함수로 되어있기는 하지만 이벤트 핸들러에게 묶여있어
이렇게 익명함수로 되어있음녀 다른 한쪽에서 이 함수를 부를 방법이 없다.
그래서 함수로 빼야 한다.
*/

function newsDetail() {
  const id = location.hash.substr(1);
  const newsContent = getData(CONTENT_URL.replace('@id', id));
  const title = document.createElement('h1');
  container.innerHTML = `
  <h1>${newsContent.title}</h1>
  <div>
  <a href='#'>목록으로</a>
  </div>
  `;
} // end of newsDetail()

function router() {
  const routePath = location.hash;
  if (routePath === '') {
    newsFeed();
  } else {
    newsDetail();
  }
} // end of router()

window.addEventListener('hashchange', router);
router();

/*
이 상태로 실행하면 아무것도 안보인다.
이제 함수를 호출하는 라우터 코드를 만들어보자.
라우터를 동작하는 방식을 생각해보면 라우터는 화면이 전환되어야 할 때 라우터가 판단해서 해당하는 화면으로
전환시키면 된다. 그런데 화면이 전환되어야 할 때라는 건 무엇인가?
기존의 hashchange 해시가 바뀌는 걸 화면의 전환을 위한 트리거로써 사용하고 있었다.
그런데 지금 hashchange에 뭐가 걸려있냐면 newDetail이 걸려있다.
즉, 해시가 바뀌면 무조건 글 내용을 보는 것이다. 이렇게 되어있는 거다.
그러다 화면이 여러 개 있으면 해시가 바뀌면 글 내용을 보여줄 수도 있고 목록을 보여줄 수도 있고,
이렇게 되면 해시의 종류가 많아진다. 페이지의 종류가 늘어날테니까 바로 이 해시를 router에게 주면 된다.
바로 hashchange가 일어났을 때 동작하는 함수를 기존의 enwsDetail이 아니라 라우터한테 주면 라우터가
해시가 바뀔 때마다 동작하게 되고 그럼 그 라우터 안에서 어떤 해시냐에 따라 글목록을
보여줄 수도 있고 내용을 보여줄 수도 있게 될 것이다.
*/

// for (let i = 0; i < 10; i++) {
//   const div = document.createElement('div');
//   /*
//   이 부분에 는 구조가 거의 개발자 도구에서 보는 것과 비슷하다.
//   내가 만들고있던 마크업의 구조가 이런 것이구나 알 수 있다.
//   월씬 더 개선된 구조라고 할 수 있다.
//   <li> 하위의 UI가 복잡해지면 마크업 구조가 복잡해질 것이고,
//   여러 가지가 들고갈텐데 그럼에도 문제가 될 건 없다.
//   양이 늘어날뿐 복잡도는 거의 그대로이기때문.
//   이렇게 DOM API를 최소한으로만 사용하고 문자열을 이용해서
//   마크업구조를 선명하게 드러내보일 수 있다.
//   */
//   div.innerHTML = `
//   <li>
//     <a href='#${newsFeed[i].id}'>${newsFeed[i].title}(${newsFeed[i].comments_count})</a>
//   </li>
//   `;
//   ul.appendChild(div.firstElementChild);
// }

// container.appendChild(ul);
// container.appendChild(content);

// /*
// DOM API를 이용해서 UI 구조가 자 ㄹ드러나지 않는 문제접을
// 해결하는 방법은 DAOM API 자체를 최대한 사용하지 않는 것이다

// */
