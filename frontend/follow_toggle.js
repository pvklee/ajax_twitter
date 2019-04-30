const APIUtil = require('./api_util.js');

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