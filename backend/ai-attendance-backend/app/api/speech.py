from flask import Blueprint, request, jsonify
import speech_recognition as sr

speech_api = Blueprint('speech_api', __name__)

@speech_api.route('/speech-to-text', methods=['POST'])
def speech_to_text():
    # Expecting audio file from frontend as 'audio' in form-data
    if 'audio' not in request.files:
        return jsonify({'error': 'No audio file provided'}), 400

    audio_file = request.files['audio']
    recognizer = sr.Recognizer()
    try:
        with sr.AudioFile(audio_file) as source:
            audio = recognizer.record(source)
        text = recognizer.recognize_google(audio)
        return jsonify({'text': text})
    except sr.UnknownValueError:
        return jsonify({'error': 'Could not understand the audio'}), 400
    except sr.RequestError as e:
        return jsonify({'error': f'Speech Recognition Error: {e}'}), 500