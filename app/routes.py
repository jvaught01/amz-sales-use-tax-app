from flask import Blueprint, render_template, request, redirect, url_for, jsonify
from .utils.data_processor import process_data, do_calc, tax_nums
from .utils.error import errors

main = Blueprint('main', __name__)

@main.route('/')
def index():
    return render_template('index.html')



@main.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return redirect(request.url)
    file = request.files['file']
    if file.filename == '':
        return redirect(request.url)
    if not file.filename.endswith('.csv'):
        response = jsonify({"error": "File must be a CSV."})
        response.status_code = 400  # Bad Request
        print(response)
        return response
    if file and file.filename.endswith('.csv'):
        pivot_data = process_data(file)
        data  = do_calc(pivot_data, tax_nums)
        response = jsonify({'success': "200"})
        response.status_code = 200
        print(data)
        return jsonify(data), 200
        
    return errors