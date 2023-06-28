const appDiv = document.getElementById('app');
appDiv.innerHTML = '<h1>Tech News!</h1>';

function getTopStories() {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open(
      'GET',
      'https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty',
      true
    );
    request.onload = function () {
      if (request.status === 200) {
        const data = JSON.parse(request.responseText);
        resolve(data);
      } else {
        reject(new Error('Error:' + request.status));
      }
    };
    request.onerror = function () {
      reject(new Error('Network error'));
    };
    request.send();
  });
}

function getStoryDetails(storyId) {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open(
      'GET',
      'https://hacker-news.firebaseio.com/v0/item/' + storyId + '.json?print=pretty',
      true
    );
    request.onload = function () {
      if (request.status === 200) {
        const data = JSON.parse(request.responseText);
        resolve(data);
      } else {
        reject(new Error('Error:' + request.status));
      }
    };
    request.onerror = function () {
      reject(new Error('Network error'));
    };
    request.send();
  });
}

async function loadStories() {
  try {
    const topStories = await getTopStories();
    const storyIds = topStories.slice(0, 10);
    const storyPromises = storyIds.map((storyId) => getStoryDetails(storyId));
    const stories = await Promise.all(storyPromises);
    renderStories(stories);
  } catch (error) {
    console.error(error);
  }
}

function renderStories(stories) {
  const container = document.getElementById('cont');
  container.innerHTML = '';
  stories.forEach((story) => {
    const article = document.createElement('div');
    article.className = 'contenitoreArticolo';

    const title = document.createElement('h3');
    title.className = 'title';
    title.textContent = story.title;

    const date = document.createElement('h5');
    date.className = 'data';
    const dateObject = new Date(story.time * 1000);
    const dateString = `${dateObject.getFullYear()}/${dateObject.getMonth() + 1}/${dateObject.getDate()}`;
    date.textContent = dateString;

    const url = document.createElement('a');
    url.className = 'url';
    url.textContent = 'link';
    url.href = story.url;

    article.appendChild(date);
    article.appendChild(title);
    article.appendChild(url);
    container.appendChild(article);
  });
}

document.getElementById('button').addEventListener('click', loadStories);
loadStories();
