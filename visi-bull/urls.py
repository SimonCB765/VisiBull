from main import app
import views

from flask import render_template


##############
# Page URLs. #
##############
# Home page.
app.add_url_rule('/', 'home', view_func=views.home)

# Admin post upload page.
app.add_url_rule('/admin/post_uploader', 'post_uploader', view_func=views.post_uploader, methods=['POST', 'GET'])

# Pretty picture pages (every non-specific page).
app.add_url_rule('/<string:primaryTag>/<string:prettyPictureName>', 'prettyPictures', view_func=views.prettyPictures)


###################
# Error handlers. #
###################
# Handle 404 errors.
@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404

# Handle 500 errors.
@app.errorhandler(500)
def server_error(e):
    return render_template('500.html'), 500