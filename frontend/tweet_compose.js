const APIUtil = require('./api_util.js')

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