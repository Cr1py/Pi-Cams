from flask import Flask, render_template
from flask_socketio import SocketIO
from threading import Thread
import cv2
import base64

app = Flask(__name__)
socketio = SocketIO(app)

class MotionDetector:
    def __init__(self, video_file):
        self.cap = cv2.VideoCapture(video_file)
        self.fgbg = cv2.createBackgroundSubtractorMOG2()
        self.room_status = "Empty"

    def process_frame(self):
        ret, frame = self.cap.read()

        if not ret:
            print("End of video file. Press ESC")
            return

        fgmask = self.fgbg.apply(frame)
        _, thresh = cv2.threshold(fgmask, 25, 255, cv2.THRESH_BINARY)
        contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

        self.room_status = "Empty"
        for contour in contours:
            if cv2.contourArea(contour) > 500:
                x, y, w, h = cv2.boundingRect(contour)
                cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)
                self.room_status = "Occupied"

        _, buffer = cv2.imencode('.jpg', frame)
        frame_bytes = base64.b64encode(buffer.tobytes())
        frame_base64 = frame_bytes.decode('utf-8')

        socketio.emit('frame', {'image': frame_base64, 'status': self.room_status})

    def run_motion_detector(self):
        while True:
            self.process_frame()
            key = cv2.waitKey(20)
            if key == 27 or cv2.getWindowProperty('Motion Detection', cv2.WND_PROP_VISIBLE) < 1:
                break
        self.cap.release()
        cv2.destroyAllWindows()

# Create an instance of the MotionDetector class
motion_detector = MotionDetector('video_20231128224927.h264')

# Define a route for the index.html template
@app.route('/')
def index():
    return render_template('index.html')

# Define a SocketIO event handler
@socketio.on('connect')
def handle_connect():
    print('Client connected')

# Define a SocketIO event handler for starting motion detection
@socketio.on('start_motion_detection')
def start_motion_detection():
    motion_detection_thread = Thread(target=motion_detector.run_motion_detector)
    motion_detection_thread.start()

if __name__ == '__main__':
    socketio.run(app, debug=True)