const showMainPage = async function (request ,response, next) {
    await response.render('index', {layout: './layout/admin_layout'});
}

module.exports = {
    showMainPage
}
