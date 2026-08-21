from flask import Flask, render_template, Response
from picamera import PiCamera
import time
from io import BytesIO

app = Flask(__name__)

class CameraStream:
    def __init__(self):
        self.camera = PiCamera()
        self.camera.resolution = (640, 480)
        self.camera.framerate = 30
        self.stream = BytesIO()
        self.streaming = True

    def generate_frames(self):
        for _ in self.camera.capture_continuous(self.stream, format='jpeg', use_video_port=True):
            if not self.streaming:
                break

            self.stream.seek(0)
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + self.stream.read() + b'\r\n')
            self.stream.seek(0)
            self.stream.truncate()

            time.sleep(0.1)

    def end_stream(self):
        self.streaming = False
        self.camera.close()

    def start_stream(self):
        self.camera = PiCamera()
        self.camera.resolution = (640, 480)
        self.camera.framerate = 10
        self.stream = BytesIO()
        self.streaming = True

stream_instance = CameraStream()

@app.route('/')
def index():
    return render_template('index_video.html')

@app.route('/video_feed')
def video_feed():
    return Response(stream_instance.generate_frames(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/end_stream')
def end_stream():
    stream_instance.end_stream()
    return 'Stream ended successfully'

@app.route('/start_stream')
def start_stream():
    stream_instance.start_stream()
    return 'Stream started successfully'

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, threaded=True)