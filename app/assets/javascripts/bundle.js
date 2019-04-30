/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./frontend/twitter.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./frontend/api_util.js":
/*!******************************!*\
  !*** ./frontend/api_util.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

const APIUtil = {
    followUser: id => APIUtil.changeFollowStatus(id, 'POST'),
    unfollowUser: id => APIUtil.changeFollowStatus(id, 'DELETE'),
    changeFollowStatus: (id, method) => (
        $.ajax({
            method,
            url: `/users/${id}/follow`,
            dataType: 'json',
        })
    ),
    searchUsers: (query) => (
        $.ajax({
            method: 'GET',
            url: `/users/search`,
            data: { query },
            dataType: 'json'
        })
    ),
    createTweet: (data) => (
        $.ajax({
            method: 'POST',
            url: `/tweets`,
            dataType: 'json',
            data
        })
    )
}

module.exports = APIUtil;

/***/ }),

/***/ "./frontend/follow_toggle.js":
/*!***********************************!*\
  !*** ./frontend/follow_toggle.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const APIUtil = __webpack_require__(/*! ./api_util.js */ "./frontend/api_util.js");

class FollowToggle{
    constructor(el, options){
        this.$el = $(el);
        this.userId = this.$el.data('user-id') || options.userId;
        this.followState = this.$el.data('initial-follow-state') || options.followState;
        this.render();
        this.$el.on('click', this.clickHandler.bind(this));
    }    

    render(){
        switch(this.followState){
            case 'unfollowed':
                this.$el.prop('disabled', false)
                this.$el.text(()=>{return "Follow"});
                break;
            case 'followed':
                this.$el.prop('disabled', false)
                this.$el.html('Unfollow');
                break;
            case 'unfollowing':
                this.$el.prop('disabled', true)
                this.$el.html('Unfollowing...');
                break;
            case 'following':
                this.$el.prop('disabled', true)
                this.$el.html('Following...');
            break;
        }
    }

    clickHandler(event){
        event.preventDefault();

        if(this.followState==='unfollowed'){
            this.followState='following';
            this.render();
            APIUtil.followUser(this.userId).then(()=>{
                this.followState = 'followed';
                this.render();
            });
        } else if(this.followState==='followed'){
            this.followState='unfollowing';
            this.render();
            APIUtil.unfollowUser(this.userId).then(()=>{
                this.followState = 'unfollowed';
                this.render();
            });
        }
    }
}

module.exports = FollowToggle;

/***/ }),

/***/ "./frontend/tweet_compose.js":
/*!***********************************!*\
  !*** ./frontend/tweet_compose.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const APIUtil = __webpack_require__(/*! ./api_util.js */ "./frontend/api_util.js")

class TweetCompose {
    constructor(el){
        this.$el = $(el);

        this.$input = this.$el.find('textarea[name=tweet\\[content\\]]');
        this.$input.on('input', this.handleInput.bind(this));

        this.$mentionedUsersDiv = this.$el.find('.mentioned-users');
        this.$el.find('.add-mentioned-user').on(
            'click', this.addMentionedUser.bind(this));
        this.$mentionedUsersDiv.on(
            'click', '.remove-mentioned-user', this.removeMentionedUser.bind(this));
        
        this.$el.on('submit', this.submit.bind(this));
        this.$mentionedUsersDiv.on(
            'change', 'select', this.preventDuplicateMentions.bind(this));

        this.mentionedUsers = [];
    }

    preventDuplicateMentions(event){
        event.preventDefault();
        if(this.mentionedUsers.indexOf( $(event.currentTarget).val()) !== -1){
            $(event.currentTarget).find('option[value=none]').prop('selected', true);
            return;
        }

        this.updateMentionedUsers()
    }

    updateMentionedUsers(){
        this.mentionedUsers = []
        const $selects = this.$mentionedUsersDiv.find('select[name=tweet\\[mentioned_user_ids\\]\\[\\]]')
        for(let i = 0; i < $selects.length; i++){
            this.mentionedUsers.push($($selects[i]).val()); 
        }
    }

    addMentionedUser(event){
        event.preventDefault();
        this.$mentionedUsersDiv.append(this.newUserSelect());

    }

    removeMentionedUser(event){
        event.preventDefault();
        $(event.currentTarget).parent('div').remove();
        this.updateMentionedUsers();
    }

    newUserSelect() {
        let userOptions = window.users
          .map(user =>
            `<option value='${user.id}'>${user.username}</option>`)
          .join('');

        userOptions = `<option value="none" disabled selected>Select a username</options>` + userOptions;

        const html = `
          <div>
            <select name='tweet[mentioned_user_ids][]'>
              ${userOptions}
            </select>
    
            <button class='remove-mentioned-user'>Remove</button>
          </div>`;
    
        return $(html); 
      }

    handleInput(){
        const length = this.$input.val().length;
        if (length === 0){
            this.$el.find('.chars-left').text(``);
            return;
        } 
        this.$el.find('.chars-left').text(`${140-length} chars remaining`);
    }

    submit(event){
        event.preventDefault();
        const data = this.$el.serializeJSON();
        this.$el.find(':input').prop('disabled', true);
        APIUtil.createTweet(data).then(tweet => this.handleSuccess(tweet)).fail(tweet => this.handleFailure(tweet));
    }

    clearInput(){
        this.$el.find(':input').not(':button, :submit, :reset, :hidden, :checkbox, :radio').val('');
        this.$el.find(':checkbox, :radio').prop('checked', false);
        this.$el.find('.mentioned-users').empty();
        this.$el.find(':input').prop('disabled', false);
    }

    handleFailure(data){
        this.clearInput();
        this.$input.attr('placeholder', 'try again');
    }

    handleSuccess(data){
        const $tweetsUl = $(this.$el.data('tweets-ul'));
        const $li = $('<li></li>')
        $li.append(data.content);
        $tweetsUl.prepend($li);

        this.clearInput();
    }
}

module.exports = TweetCompose;

/***/ }),

/***/ "./frontend/twitter.js":
/*!*****************************!*\
  !*** ./frontend/twitter.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const FollowToggle = __webpack_require__(/*! ./follow_toggle.js */ "./frontend/follow_toggle.js");
const UserSearch = __webpack_require__(/*! ./users_search.js */ "./frontend/users_search.js")
const TweetCompose = __webpack_require__(/*! ./tweet_compose.js */ "./frontend/tweet_compose.js")
$(()=>{
    $('.follow-toggle').each((index, button) => new FollowToggle(button));
    $('.users-search').each((index, searchBar) => new UserSearch(searchBar));
    $('.tweet-compose').each((index, tweetCompose) => new TweetCompose(tweetCompose));
});

/***/ }),

/***/ "./frontend/users_search.js":
/*!**********************************!*\
  !*** ./frontend/users_search.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const APIUtil = __webpack_require__(/*! ./api_util.js */ "./frontend/api_util.js");
const FollowToggle = __webpack_require__(/*! ./follow_toggle.js */ "./frontend/follow_toggle.js")

class UsersSearch{
    constructor(el){
        this.$el = $(el);
        this.$ul = this.$el.find('ul');
        this.$input = this.$el.find('input[name=username]');
        this.$input.on('input', this.handleInput.bind(this));
    }

    handleInput(event){
        const usersSearch = this;
        if(this.$input.val() === ''){
            this.renderResults([]);
            return;
        }

        APIUtil.searchUsers(this.$input.val())
            .then(users => {
                users;
                usersSearch.renderResults(users);
            });
    }

    renderResults(users){
        this.$ul.empty();
        for(let i = 0; i < users.length; i++){
            const user = users[i];

            const $a = $('<a></a>')
            $a.text(`@${user.username}`);
            $a.attr('href', `/users/${user.id}`);

            const $followToggle = $('<button></button>');
            new FollowToggle($followToggle, {
                userId: user.id,
                followState: (user.followed ? 'followed' : 'unfollowed')
            })

            const $li = $(document.createElement('li'));
            $li.append($a);
            $li.append($followToggle);

            this.$ul.append($li);
        }
    }
}

module.exports = UsersSearch;

/***/ })

/******/ });
//# sourceMappingURL=bundle.js.map