from google.appengine.ext import ndb

class PrettyPicture(ndb.Model):
    """Contains the information about a visualisation page."""

    postName = ndb.StringProperty(required=True)  # The name of the page.
    postDate = ndb.DateTimeProperty(auto_now_add=True)  # The date when the page was posted/created.
    primaryTag = ndb.StringProperty(required=True)  # The primary tag of the post (used to identify the URL for the post).
    isDemo = ndb.BooleanProperty(required=True)  # Whether the page is a demo.
    isInfo = ndb.BooleanProperty(required=True)  # Whether the page is an infographic.
    isTool = ndb.BooleanProperty(required=True)  # Whether the page is a tool.
    isVisu = ndb.BooleanProperty(required=True)  # Whether the page is a visualisation.