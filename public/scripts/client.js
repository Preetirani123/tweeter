/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

const tweetDatabase = [
  {
    "user": {
      "name": "Newton",
      "avatars": "https://i.imgur.com/73hZDYK.png"
      ,
      "handle": "@SirIsaac"
    },
    "content": {
      "text": "If I have seen further it is by standing on the shoulders of giants"
    },
    "created_at": 1614206889473
  },
  {
    "user": {
      "name": "Descartes",
      "avatars": "https://i.imgur.com/nlhLi3I.png",
      "handle": "@rd" },
    "content": {
      "text": "Je pense , donc je suis"
    },
    "created_at": 1604206174750
  }
]

const renderTweets = function(tweets) {
  // loops through tweets
  for (let data in tweets){
    // calls createTweetElement for each tweet
    $tweet = createTweetElement(tweets[data]);

    // takes return value and appends it to the tweets container
    $('#tweets-container').prepend($tweet)
  }
}
// 
const loadtweets = function() {
  $.ajax('/tweets', { method: 'GET' })
  .then((allTweeets)  => {
    renderTweets(allTweeets);
  });
}

const escape =  function(str) {
  let div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

const timePassed = function(dateCreated) {
  let timeElapsedinSeconds = (Date.now() - dateCreated) / 1000;
  if (timeElapsedinSeconds /  31556952 >= 1) {
    return Math.floor(timeElapsedinSeconds /  31556952) + " year ago"
  }
  else if (timeElapsedinSeconds /  2629746 >= 1) {
    return Math.floor(timeElapsedinSeconds /  2629746) + " month ago"
  }
  else if (timeElapsedinSeconds /  86400 >= 1) {
    return Math.floor(timeElapsedinSeconds /  86400) + " day ago"
  }
  else if (timeElapsedinSeconds /  3600 >= 1) {
    return Math.floor(timeElapsedinSeconds /  3600) + " hour ago"
  }
  else if (timeElapsedinSeconds /  60 >= 1) {
    return Math.floor(timeElapsedinSeconds /  60) + " minute ago"
  }
  else {
    return Math.floor(timeElapsedinSeconds) + " second ago"
  }
}

const createTweetElement = function(tweet) {
  const $tweet = (`<article> 
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
                     <span> <p> ${timePassed(tweet.created_at)}</p></span>
                     <span>
                       <i class="fas fa-flag"></i>
                       <i class="fas fa-retweet"></i>
                       <i class="fas fa-heart"></i>
                    </span>
                   </footer>
                </article>`
              )
  
      return $tweet;
}

$(document).ready( function() {

  loadtweets()

  $(".new-tweet-btn").on("click", function(event) {
    $(".new-tweet").slideToggle( "slow" );
    $(".new-tweet").find("#tweet-text").focus();
    
  });

$( "form" ).on( "submit", function( event ) {
  event.preventDefault();

  if (($(this).find("#tweet-text").val().length) === 0) {
    $("#error_1").toggle(true)
  }

  else if (($(this).find("#tweet-text").val().length) > 140) {
    $("#error_2").toggle(true)
  }

  else {
    let generateTweet = $("#tweet-text").serialize();
    $.ajax({
      url: '/tweets', method: 'POST', data: generateTweet
    }).then(loadtweets())
    .then($("#tweet-text").val(''))
    .then($(".counter").text(140))
    .then($("#error_1").toggle(false))
    .then($("#error_2").toggle(false))
  }

});


  $(window).scroll(function(){ 
      if ($(this).scrollTop() > 100) { 
          $('#myBtn').fadeIn(); 
      } else { 
          $('#myBtn').fadeOut(); 
      } 
  }); 
  $('#myBtn').click(function(){ 
      $("html, body").animate({ scrollTop: 0 }, 600); 
      return false; 
  }); 




});

