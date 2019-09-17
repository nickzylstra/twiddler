$(document).ready(() => {
  const $body = $('body');
  $body.html('');

  // function to call object properties by string
  // https://stackoverflow.com/a/22129960/11478758
  function resolve(path, obj, separator = '.') {
    const properties = Array.isArray(path) ? path : path.split(separator);
    return properties.reduce((prev, curr) => prev && prev[curr], obj);
  }

  // function to show undisplayed tweets
  function showTweets(startIndex, finishIndex, userRef = 'home') {
    let index = startIndex;
    if (userRef !== 'home') {
      userRef = `users.${userRef}`;
    }

    while (index >= finishIndex) {
      /* const tweet = streams.home[index]; */
      const tweet = resolve(`${userRef}.${index}`, streams);
      const $tweet = $('<div class="tweet"></div>');

      const $user = $(`<div class="user"> @${tweet.user}</div>`);
      $user.appendTo($tweet);

      const $timestamp = $(`<div class="timestamp">${tweet.created_at}</div>`);
      $timestamp.appendTo($tweet);

      const $message = $(`<div class="message"> "${tweet.message}"</div>`);
      $message.appendTo($tweet);

      $tweet.prependTo($body);
      index -= 1;
    }
  }

  // function to start process that shows new tweets
  function startShowNewTweetsProcess(userRef = 'home') {
    const refreshTweetRate = 3000;
    let finishIndex = initIndex + 1;

    return setInterval(() => {
      const startIndex = streams.home.length - 1;
      showTweets(startIndex, finishIndex, userRef);
      finishIndex = startIndex + 1;
    }, refreshTweetRate);
  }

  // load home tweet stream
  const initIndex = streams.home.length - 1;
  showTweets(initIndex, 0);
  startShowNewTweetsProcess();
});
