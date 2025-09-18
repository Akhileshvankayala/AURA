# chatbot.py
# This module will handle chatbot logic for the AI Attendance Backend.


from datetime import datetime
from typing import List, Dict
import speech_recognition as sr

class Chatbot:
    def __init__(self):
        self.default_responses = [
            "Hello! How can I help you today?",
            "Thank you for your message. I'll get back to you shortly."
        ]

    def get_greeting(self) -> str:
        return self.default_responses[0]

    def get_auto_response(self) -> str:
        return self.default_responses[1]

    def process_message(self, message: str, sender: str = "student") -> Dict:
        """
        Simulate processing a message and returning a response dict.
        """
        now = datetime.now()
        response = {
            "id": str(int(now.timestamp() * 1000)),
            "text": self.get_auto_response(),
            "sender": "faculty",
            "timestamp": now.isoformat()
        }
        return response

    def chat_history(self) -> List[Dict]:
        """
        Returns a sample chat history.
        """
        now = datetime.now()
        return [
            {
                "id": "1",
                "text": self.get_greeting(),
                "sender": "faculty",
                "timestamp": now.isoformat()
            }
        ]


# Speech recognition function

def recognize_speech():
    import time
    recognizer = sr.Recognizer()
    with sr.Microphone() as source:
        print("Listening... (speak, and pause for 2 seconds to finish)")
        recognizer.adjust_for_ambient_noise(source, duration=1)
        recognizer.pause_threshold = 2  # Set pause threshold before listening
        try:
            # Listen until 2 seconds of silence
            audio = recognizer.listen(source, timeout=None, phrase_time_limit=None)
        except sr.WaitTimeoutError:
            print("No speech detected, try again.")
            return None

    # Wait for 2 seconds after user stops speaking
    time.sleep(2)
    try:
        text = recognizer.recognize_google(audio)
        print(f"You said: {text}")
        return text
    except sr.UnknownValueError:
        print("Could not understand the audio")
        return None
    except sr.RequestError as e:
        print(f"Speech Recognition Error: {e}")
        return None



# Example usage (for testing only)
if __name__ == "__main__":
    while True:
        print("\nSay something or say 'exit' to stop:")
        text = recognize_speech()
        if text:
            if text.lower() == "exit":
                print("Exiting...")
                break
            print(f"Recognized text: {text}")