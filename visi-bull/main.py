from flask import Flask
import settings

app = Flask(__name__.split('.')[0], template_folder='pages')
app.config.from_object(settings)

import urls