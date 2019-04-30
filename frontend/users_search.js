const APIUtil = require('./api_util.js');
const FollowToggle = require('./follow_toggle.js')

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