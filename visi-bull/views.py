from flask import render_template


def demos(demoName):
	"""Render a demo page."""
	return render_template('demos/' + demoName + '.html')

def home():
    """Render the home page."""
    return render_template('home.html')