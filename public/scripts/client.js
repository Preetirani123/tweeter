/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
*/

// Find out how much time have passed since the tweet was posted
const timePassed = function(dateCreated) {
  let timeElapsedinSeconds = (Date.now() - dateCreated) / 1000;
  if (timeElapsedinSeconds /  (60 * 60 * 24 * 365) >= 1) { //year check
    let time = Math.floor(timeElapsedinSeconds /  (60 * 60 * 24 * 365));
    if (time > 1) {
      return time + " years ago";
    } else {
      return time + " year ago";
    }
  } else if (timeElapsedinSeconds /  (60 * 60 * 24 * 30) >= 1) { //month check
    let time = Math.floor(timeElapsedinSeconds /  (60 * 60 * 24 * 30));
    if (time > 1) {
      return time + " months ago";
    } else {
      return time + " month ago";
    }
  } else if (timeElapsedinSeconds /  (60 * 60 * 24) >= 1) { //day check
    let time = Math.floor(timeElapsedinSeconds /  (60 * 60 * 24));
    if (time > 1) {
      return time + " days ago";
    } else {
      return time + " day ago";
    }
  } else if (timeElapsedinSeconds /  (60 * 60) >= 1) { //hour check
    let time = Math.floor(timeElapsedinSeconds /  (60 * 60));
    if (time > 1) {
      return time + " hours ago";
    } else {
      return time + " hour ago";
    }
  } else if (timeElapsedinSeconds /  60 >= 1) { //minute check
    let time = Math.floor(timeElapsedinSeconds / 60);
    if (time > 1) {
      return time + " minutes ago";
    } else {
      return time + " minute ago";
    }
  } else {// second check
    let time = Math.floor(timeElapsedinSeconds);
    if (time > 1) {
      return time + " seconds ago";
    } else {
      return time + " second ago";
    }
  }
};

//Escape potentially insecure or malicious text or codes entered as a tweet
const escape =  function(str) {
  let div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

//Create the tweet box and add all the elements
const createTweetElement = function(tweet) {
  const $tweet =
    (`<article>
        <header>
          <div class="header-content">
            <img src="${tweet.user.avatars}">
              <p>${tweet.user.name}</p>
          </div>
          <div class="header-user">
            <p>${tweet.user.handle}</p>
          </div >
        </header>
        <div class="content-body">${escape(tweet.content.text)}</div>
        <footer>
          <span><p>${timePassed(tweet.created_at)}</p></span>
          <span>
            <i class="fas fa-flag"></i>
            <i class="fas fa-retweet"></i>
            <i class="fas fa-heart"></i>
          </span>
        </footer>
      </article>`
    );
  return $tweet;
};

//Render all tweets in a loop
const renderTweets = function(tweets) {
  for (let data in tweets) {// loops through tweets
    $tweet = createTweetElement(tweets[data]); // calls createTweetElement for each tweet
    $('#tweets-container').prepend($tweet); // takes return value and add it to the tweets container
  }
};

//Fetching tweets to be printed/loaded
const loadtweets = function() {
  $.ajax('/tweets', { method: 'GET' }) //getting teets from /tweets
    .then((allTweeets)  => {
      renderTweets(allTweeets); //then passing the tweets to the renderTweets function
    });
};

//Create new tweet and add it to the tweet database
$(document).ready(function() {
  loadtweets();

  //Toggle (show) the new tweet textarea by clicking on the "Write a tweet button"
  $(".new-tweet-btn").on("click", function(event) {
    $(".new-tweet").slideToggle("slow");
    $(".new-tweet").find("#tweet-text").focus();
  });

  //Adding new tweet to tweet database after clicking on the "TWEET button"
  $("form").on("submit", function(event) {
    event.preventDefault();
    if (($(this).find("#tweet-text").val().length) === 0) { //if not tweet was written show Error
      $("#error_1").toggle(true);
    } else if (($(this).find("#tweet-text").val().length) > 140) { //if tweet is longer than 140 then show Error
      $("#error_2").toggle(true);
    } else {
      let generateTweet = $("#tweet-text").serialize(); //get the tweet and then add it to the tweet database
      $.ajax({
        url: '/tweets', method: 'POST', data: generateTweet
      }).then(loadtweets()) //load the tweetdatabse again
        .then($("#tweet-text").val('')) //empty the textarea
        .then($(".counter").text(140)) //reset the counter
        .then($("#error_1").toggle(false)) //hide the error
        .then($("#error_2").toggle(false)); //hide the error
    }
  });

  $(window).scroll(function() { //Show the toggle button to move the page up if window gets too longs
    if ($(this).scrollTop() > 100) {
      $('#myBtn').fadeIn();
    } else {
      $('#myBtn').fadeOut();
    }
  });

  $('#myBtn').click(function() { // move the page up if the toggle button is clicked
    $("html, body").animate({scrollTop: 0}, 600);
    return false;
  });
});