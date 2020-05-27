import flask
from flask import Flask, render_template, url_for, request

app = flask.Flask(__name__, template_folder='templates')


@app.route('/')
def home():
    # return render_template('index.html')
    return render_template('vanilla_index.html')


@app.route('/get_image', methods=('GET', 'POST'))
def get_image():
    return render_template('index.html')


if __name__ == '__main__':
    pass
    # app.run(debug=True)
