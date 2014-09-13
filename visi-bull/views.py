# Python imports.
import datetime
import os

# Flask imports.
from flask import render_template, request


def home():
    """Render the home page."""
    return render_template('home.html')

def prettyPictures(prettyPictureName):
    """Render a page with some sort of visualisation on it."""

    # Check if the page exists before rendering it.
    projectDirectory = os.path.dirname(os.path.realpath(__file__))
    pageRelativePath = prettyPictureName + '.html'
    pageFullPath = projectDirectory + '/templates/' + pageRelativePath
    if not os.path.isfile(pageFullPath):
        return render_template('404.html')
    else:
        return render_template(pageRelativePath)