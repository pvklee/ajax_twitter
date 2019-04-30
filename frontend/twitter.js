const FollowToggle = require('./follow_toggle.js');
const UserSearch = require('./users_search.js')
const TweetCompose = require('./tweet_compose.js')
$(()=>{
    $('.follow-toggle').each((index, button) => new FollowToggle(button));
    $('.users-search').each((index, searchBar) => new UserSearch(searchBar));
    $('.tweet-compose').each((index, tweetCompose) => new TweetCompose(tweetCompose));
});