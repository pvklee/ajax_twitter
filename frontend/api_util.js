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