const $tweetStream = $('#tweetStream');
let visitor;

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

    const $user = $(`<div class="user btn btn-link" onclick="loadStream('${tweet.user}')"> @${tweet.user}</div>`);
    $user.appendTo($tweet);

    const timediff = moment.duration(new Date() - tweet.created_at).humanize();
    const $timestamp = $(`<div class="timestamp">${timediff} ago</div>`);
    $timestamp.appendTo($tweet);

    const $message = $(`<div class="message"> "${tweet.message}"</div>`);
    $message.appendTo($tweet);

    $tweet.prependTo($tweetStream);
    index += 1;
  }
}

// function to load tweet stream on page
let tweetStreamProcess;
function loadStream(user = 'home') {
  tweetStreamProcess = (() => {
    // clear existing stream
    $tweetStream.html('');
    $('#showAllBtn').hide();
    $('#tweetForm').show();
    if (tweetStreamProcess) {
      clearInterval(tweetStreamProcess);
    }

    // determine user and set nav button if not home
    let userRef = user;
    if (userRef !== 'home') {
      userRef = `users.${userRef}`;
      $('#showAllBtn').show();
      $('#tweetForm').hide();
    }

    // show existing undisplayed tweets
    const initIndex = resolve(`${userRef}.length`, streams) - 1;
    showTweets(0, initIndex, userRef);

    /* // start process to show new undisplayed tweets
    const refreshTweetRate = 3000;
    let startIndex = initIndex + 1;
    return setInterval(() => {
      const finishIndex = resolve(`${userRef}.length`, streams) - 1;
      showTweets(startIndex, finishIndex, userRef);
      startIndex = finishIndex + 1;
    }, refreshTweetRate); */

    // start process to show new tweets and refresh timestamp on old tweets
    // will get progressively slower but keeps timestamp current
    // ideally refactor
    const refreshTweetRate = 3000;
    const startIndex = 0;
    return setInterval(() => {
      const finishIndex = resolve(`${userRef}.length`, streams) - 1;
      showTweets(startIndex, finishIndex, userRef);
    }, refreshTweetRate);
  })();
}

$(document).ready(() => {
  // load home user tweet stream
  loadStream();
});

function postTweet() {
  visitor = $('#username').val();
  const message = $('#message').val();
  if (!streams.users[visitor]) {
    streams.users[visitor] = [];
  }
  writeTweet(message);
  $('#message').val("");
}
