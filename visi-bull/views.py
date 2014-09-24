# Python imports.
import datetime
import os

# Flask imports.
from flask import render_template, request


def home():
    """Render the home page."""
    githubURL = 'https://github.com/SimonCB765/VisiBull/tree/master/visi-bull/pages'
    return render_template('home.html', githubURL=githubURL)

def prettyPictures(prettyPictureName):
    """Render a page with some sort of visualisation on it."""

    # Check if the page exists before rendering it.
    projectDirectory = os.path.dirname(os.path.realpath(__file__))
    pageRelativePath = prettyPictureName + '/' + prettyPictureName + '.html'
    pageFullPath = projectDirectory + '/pages/' + pageRelativePath
    if not os.path.isfile(pageFullPath):
        return render_template('404.html')
    else:
        githubURL = 'https://github.com/SimonCB765/VisiBull/tree/master/visi-bull/pages/' + prettyPictureName
        return render_template(pageRelativePath, githubURL=githubURL)