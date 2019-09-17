$(document).ready(() => {
  const $body = $('body');
  $body.html('');
  const initIndex = streams.home.length - 1;

  // function to show undisplayed tweets
  function showTweets(startIndex, finishIndex) {
    let index = startIndex;
    while (index >= finishIndex) {
      const tweet = streams.home[index];
      const $tweet = $('<div class="tweet"></div>');
      /* $tweet.text(`@${tweet.user} (${tweet.created_at}): ${tweet.message}`); */

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

  // function to start process that adds new tweets
  function startShowNewTweetsProcess() {
    const refreshTweetRate = 2000;
    let finishIndex = initIndex + 1;

    return setInterval(() => {
      const startIndex = streams.home.length - 1;
      showTweets(startIndex, finishIndex);
      finishIndex = startIndex + 1;
    }, refreshTweetRate);
  }

  // load tweet stream
  showTweets(initIndex, 0);
  startShowNewTweetsProcess();
});
