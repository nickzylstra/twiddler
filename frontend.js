const $main = $('main');

// function to call object properties by string
// https://stackoverflow.com/a/22129960/11478758
function resolve(path, obj, separator = '.') {
  const properties = Array.isArray(path) ? path : path.split(separator);
  return properties.reduce((prev, curr) => prev && prev[curr], obj);
}

// function to show undisplayed tweets
function showTweets(startIndex, finishIndex, userRef) {
  let index = startIndex;

  while (index <= finishIndex) {
    // const tweet = streams[userRef][index];
    const tweet = resolve(`${userRef}.${index}`, streams);
    const $tweet = $('<div class="tweet"></div>');

    const $user = $(`<div class="user" onclick="loadStream('${tweet.user}')"> @${tweet.user}</div>`);
    $user.appendTo($tweet);

    const $timestamp = $(`<div class="timestamp">${tweet.created_at}</div>`);
    $timestamp.appendTo($tweet);

    const $message = $(`<div class="message"> "${tweet.message}"</div>`);
    $message.appendTo($tweet);

    $tweet.prependTo($main);
    index += 1;
  }
}

// function to load tweet stream on page
let tweetStreamProcess;
function loadStream(user = 'home') {
  tweetStreamProcess = (() => {
    $main.html('');
    if (tweetStreamProcess) {
      clearInterval(tweetStreamProcess);
    }

    let userRef = user;
    if (userRef !== 'home') {
      userRef = `users.${userRef}`;
    }

    // show existing undisplayed tweets
    const initIndex = resolve(`${userRef}.length`, streams) - 1;
    showTweets(0, initIndex, userRef);

    // start process to show new undisplayed tweets
    const refreshTweetRate = 3000;
    let startIndex = initIndex + 1;
    return setInterval(() => {
      const finishIndex = resolve(`${userRef}.length`, streams) - 1;
      showTweets(startIndex, finishIndex, userRef);
      startIndex = finishIndex + 1;
    }, refreshTweetRate);
  })();
}

$(document).ready(() => {
  // load home user tweet stream
  loadStream();
});
