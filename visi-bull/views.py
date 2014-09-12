# Python imports.
import datetime
import os

# Flask imports.
from flask import render_template, request

# App imports.
import models


def home():
    """Render the home page."""

    # Get all pages with visualisations, with the most recent first.
    query = models.PrettyPicture.query().order(-models.PrettyPicture.postDate)
    queryResult = query.fetch()

    # Process the information of interest.
    processedPages = []
    for i in queryResult:
        tags = set([])
        tags.add('Demo' if i.isDemo else '')
        tags.add('Info' if i.isInfo else '')
        tags.add('Tool' if i.isTool else '')
        tags.add('Visu' if i.isVisu else '')
        tags -= set([''])
#        tags = {}
#        tags['Demo'] = True if i.isDemo else False
#        tags['Info'] = True if i.isInfo else False
#        tags['Tool'] = True if i.isTool else False
#        tags['Visu'] = True if i.isVisu else False
        processedPages.append({'postName' : i.postName, 'primaryTag' : i.primaryTag, 'tags' : tags,
            'postDate' : i.postDate.strftime('%B') + ' {0}, {1}'.format(i.postDate.day, i.postDate.year)})

    return render_template('home.html', pageData=processedPages)

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

    # Check if the page exists before rendering it.
    projectDirectory = os.path.dirname(os.path.realpath(__file__))
    pageRelativePath = primaryTag + '/' + prettyPictureName + '.html'
    pageFullPath = projectDirectory + '/templates/' + pageRelativePath
    #return pageFullPath
    if not os.path.isfile(pageFullPath):
        return render_template('404.html')
    else:
        return render_template(pageRelativePath)