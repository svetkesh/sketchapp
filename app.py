import os
import uuid
import base64
import flask
# from flask import Flask, render_template, url_for, request

import urllib.request
from flask import Flask, flash, request, redirect, url_for, render_template
from werkzeug.utils import secure_filename

ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg', 'gif'])
UPLOAD_FOLDER = 'static/uploads/'
DEFAULT_EXTENSION = '.png'


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


app = flask.Flask(__name__, template_folder='templates')


app.secret_key = "secret key"
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024


@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':

        # if 'file' not in request.files:
        #     flash('No file part')
        #     return redirect(request.url)
        # # file = request.files['file']

        # file = request.form['url']

        # image = base64.b64decode(request.form['url'])

        image_data = request.form['url'][21:]
        f_name = str(uuid.uuid4()) + DEFAULT_EXTENSION
        full_path = os.path.join(app.config['UPLOAD_FOLDER'], f_name)

        # with open(
        #         full_path,
        #         "wb") as fh:
        #     # fh.write(base64.decodebytes(image_data))
        #     # fh.write(base64.decode(image_data))
        #     fh.write(img_data.decode('base64'))

        # from base64 import decodestring

        with open(full_path, "wb") as fh:
            fh.write(base64.decodebytes(image_data.encode()))

        # image.save(os.path.join(app.config['UPLOAD_FOLDER'], f_name))
        # return redirect(request.url)
        return render_template('vanilla_index.html', file_name=f_name)

        # if file.filename == '':
        #     flash('No image selected for uploading')
        #     return redirect(request.url)
        # if file and allowed_file(file.filename):
        #     filename = secure_filename(file.filename)
        #     file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        #     # print('upload_image filename: ' + filename)
        #     flash('Image successfully uploaded and displayed')
        #     return render_template('upload.html', filename=filename)
        # else:
        #     flash('Allowed image types are -> png, jpg, jpeg, gif')
        #     return redirect(request.url)
    return render_template('vanilla_index.html')


@app.route('/display/<filename>')
def display_image(filename):
    # print('display_image filename: ' + filename)
    return redirect(url_for('static', filename='uploads/' + filename), code=301)


# @app.route('/')
# def home():
#     # return render_template('index.html')
#     return render_template('vanilla_index.html')


# @app.route('/get_image', methods=('GET', 'POST'))
# def get_image():
#     return render_template('index.html')


# @app.route('/upload', methods=['GET', 'POST'])
# def upload():
#     if request.method == 'POST':
#         file = request.files['file']
#         extension = os.path.splitext(file.filename)[1]
#         f_name = str(uuid.uuid4()) + extension
#         file.save(os.path.join(app.config['UPLOAD_FOLDER'], f_name))
#     return json.dumps({'filename':f_name})


if __name__ == '__main__':
    pass
    # app.run(debug=True)
