# Flask import.
from flask import render_template, request

# App imports.
import models


def home():
    """Render the home page."""
    return render_template('home.html')

def post_uploader():
    """Render the post upload page."""

    if request.method == 'POST':
        # Parse the submitted form.
        postName = request.form['postName']
        primaryTag = request.form['primaryTag']
        postID = primaryTag + '_' + postName
        tags = {}
        tags['demo'] = request.form.get('isDemo', default=False, type=bool)
        tags['info'] = request.form.get('isInfo', default=False, type=bool)
        tags['tool'] = request.form.get('isTool', default=False, type=bool)
        tags['visu'] = request.form.get('isVisu', default=False, type=bool)
        tags[primaryTag] = True

        # Check whether a page with that name has already been created.
        postExists = True if models.PrettyPicture.get_by_id(postID) else False

        if postExists:
            # Return an error message if the page record already exists.
            return 'There is already a post named ' + postName + ' with primary tag ' + primaryTag
        else:
            # Add the record of the page to the datastore if it's new.
            newPost = models.PrettyPicture(id=postID, postName=postName, primaryTag=primaryTag, isDemo=tags['demo'], isInfo=tags['info'], isTool=tags['tool'],
                isVisu=tags['visu'])
            newPost.put()
            return ('Post Name - ' + postName + '<br>Primary Tag - ' + primaryTag + '<br><br>Tags<br>------------<br>' +
                '<br>'.join([i + ' - ' + str(tags[i]) for i in tags]))
    else:
        return render_template('post_uploader.html')

def prettyPictures(primaryTag, prettyPictureName):
    """Render a page with some sort of visualisation on it."""
    return render_template(primaryTag + '/' + prettyPictureName + '.html')