#!/usr/bin/env python
import cv2
import matplotlib.pyplot as plt
import numpy as np
import onnx
import onnxruntime as ort
import random


class ImageAnalysis():

    def __init__(self):
        GENDER_MODEL = 'weights/deploy_gender.prototxt'
        GENDER_PROTO = 'weights/gender_net.caffemodel'
        self.MODEL_MEAN_VALUES = (78.4263377603, 87.7689143744, 114.895847746)

        # Models
        GENDER_MODEL = 'weights/deploy_gender.prototxt'
        GENDER_PROTO = 'weights/gender_net.caffemodel'
        FACE_PROTO = "weights/deploy.prototxt.txt"
        FACE_MODEL = "weights/res10_300x300_ssd_iter_140000_fp16.caffemodel"
        AGE_PROTO = "weights/deploy_age.prototxt"
        AGE_MODEL = "weights/age_net.caffemodel"
        model_path = 'emotion_ferplus/model.onnx'

        self.frame_width = 1280
        self.frame_height = 720

        # Load Models
        self.face_net = cv2.dnn.readNetFromCaffe(FACE_PROTO, FACE_MODEL)
        self.gender_net = cv2.dnn.readNetFromCaffe(GENDER_MODEL, GENDER_PROTO)
        self.age_net = cv2.dnn.readNetFromCaffe(AGE_PROTO, AGE_MODEL)
        self.emotion_model = onnx.load(model_path)
        self.session = ort.InferenceSession(
            self.emotion_model.SerializeToString())

        # Represent the gender classes
        self.GENDER_LIST = ['Male', 'Female']
        self.AGE_INTERVALS = ['(0, 2)', '(4, 6)', '(8, 12)', '(15, 20)',
                              '(25, 32)', '(38, 43)', '(48, 53)', '(60, 100)']
        self.emotion_table = ['neutral',
                              'happiness',
                              'surprise',
                              'sadness',
                              'anger',
                              'disgust',
                              'fear',
                              'contempt']

    def preprocess_emotion(self, img):
        input_shape = (1, 1, 64, 64)
        img_data = np.array(img)
        img_data = np.resize(img_data, input_shape)
        return img_data

    def softmax(self, x):
        # returns max of each row and keeps same dims
        max = np.max(x, axis=1, keepdims=True)
        e_x = np.exp(x - max)  # subtracts each row with its max value
        # returns sum of each row and keeps same dims
        sum = np.sum(e_x, axis=1, keepdims=True)
        f_x = e_x / sum
        return f_x

    def predict_emotion(self, img):
        img = self.preprocess_emotion(img)
        ort_inputs = {self.session.get_inputs(
        )[0].name: img.astype(np.float32)}
        preds = self.session.run(None, ort_inputs)[0]
        preds = self.softmax(preds)
        preds = np.squeeze(preds)
        a = np.argsort(preds)[::-1]
        #print('class=%s ; probability=%f' % (emotion_table[a[0]], preds[a[0]]))

        emotion = self.emotion_table[a[0]]
        return emotion, preds[a[0]]

    def get_faces(self, frame, confidence_threshold=0.5):
        # convert the frame into a blob to be ready for NN input
        blob = cv2.dnn.blobFromImage(
            frame, 1.0, (300, 300), (104, 177.0, 123.0))

        # set the image as input to the NN
        self.face_net.setInput(blob)

        # perform inference and get predictions
        output = np.squeeze(self.face_net.forward())

        # initialize the result list
        faces = []

        # Loop over the faces detected
        for i in range(output.shape[0]):
            confidence = output[i, 2]
            if confidence > confidence_threshold:
                box = output[i, 3:7] * np.array([frame.shape[1], frame.shape[0],
                                                 frame.shape[1], frame.shape[0]])
                # convert to integers
                start_x, start_y, end_x, end_y = box.astype(int)
                # widen the box a little
                start_x, start_y, end_x, end_y = start_x - \
                    10, start_y - 10, end_x + 10, end_y + 10
                start_x = 0 if start_x < 0 else start_x
                start_y = 0 if start_y < 0 else start_y
                end_x = 0 if end_x < 0 else end_x
                end_y = 0 if end_y < 0 else end_y
                # append to our list
                faces.append((start_x, start_y, end_x, end_y))

        return faces

    def display_img(title, img):
        """Displays an image on screen and maintains the output until the user presses a key"""
        # Display Image on screen
        plt.figure(figsize=(20, 20))
        plt.imshow(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))
        plt.title(title)
        plt.axis("off")

    def get_optimal_font_scale(self, text, width):
        """Determine the optimal font scale based on the hosting frame width"""
        for scale in reversed(range(0, 60, 1)):
            textSize = cv2.getTextSize(
                text, fontFace=cv2.FONT_HERSHEY_DUPLEX, fontScale=scale/10, thickness=1)
            new_width = textSize[0][0]
            if (new_width <= width):
                return scale/10
        return 1

    def image_resize(self, image, width=None, height=None, inter=cv2.INTER_AREA):
        # initialize the dimensions of the image to be resized and
        # grab the image size
        dim = None
        (h, w) = image.shape[:2]
        # if both the width and height are None, then return the
        # original image
        if width is None and height is None:
            return image
        # check to see if the width is None
        if width is None:
            # calculate the ratio of the height and construct the
            # dimensions
            r = height / float(h)
            dim = (int(w * r), height)
        # otherwise, the height is None
        else:
            # calculate the ratio of the width and construct the
            # dimensions
            r = width / float(w)
            dim = (width, int(h * r))
        # resize the image
        return cv2.resize(image, dim, interpolation=inter)

    def predict_age_gender_emotion_utility(self, img):
        # Take a copy of the initial image and resize it
        frame = img.copy()
        if frame.shape[1] > self.frame_width:
            frame = self.image_resize(frame, width=self.frame_width)

        people = []
        # predict the faces
        faces = self.get_faces(frame)

        for i, (start_x, start_y, end_x, end_y) in enumerate(faces):
            face_img = frame[start_y: end_y, start_x: end_x]
            # image        = Input image to preprocess before passing it through our dnn for classification.
            # scale factor = After performing mean substraction we can optionally scale the image by some factor.
            #                (if 1 -> no scaling)
            # size         = The spatial size that the CNN expects. Options are = (224*224, 227*227 or 299*299)
            # mean         = mean substraction values to be substracted from every channel of the image.
            # swapRB       = OpenCV assumes images in BGR whereas the mean is supplied in RGB.
            #                To resolve this we set swapRB to True.
            blob = cv2.dnn.blobFromImage(image=face_img,
                                         scalefactor=1.0,
                                         size=(227, 227),
                                         mean=self.MODEL_MEAN_VALUES,
                                         swapRB=False,
                                         crop=False)

            # Predict Gender ###################
            self.gender_net.setInput(blob)
            gender_preds = self.gender_net.forward()

            i = gender_preds[0].argmax()
            gender = self.GENDER_LIST[i]
            gender_confidence_score = gender_preds[0][i]

            # Predict Age ######################
            self.age_net.setInput(blob)
            age_preds = self.age_net.forward()

            i = age_preds[0].argmax()
            age = self.AGE_INTERVALS[i]
            age_confidence_score = age_preds[0][i]

            # Predict Emotion ##################
            # Emotion model requires 64x64 image
            blob_64x64 = cv2.dnn.blobFromImage(image=face_img,
                                               scalefactor=1.0,
                                               size=(64, 64),
                                               mean=self.MODEL_MEAN_VALUES,
                                               swapRB=False,
                                               crop=False)

            emotion, emotion_probability = self.predict_emotion(blob_64x64)

            ####################################

            people.append({
                'gender': gender,
                'gender_confidence': gender_confidence_score,
                'age': age,
                'age_confidence': age_confidence_score,
                'emotion': emotion,
                'emotion_confidence': emotion_probability
            })

            # Draw the box
            label = "{} - {} - {}".format(gender, age, emotion)

            yPos = start_y - 15
            while yPos < 15:
                yPos += 15

            # get the font scale for this image size
            optimal_font_scale = self.get_optimal_font_scale(label,
                                                             ((end_x-start_x)+25))
            box_color = (255, 0, 0) if gender == "Male" else (147, 20, 255)
            cv2.rectangle(frame, (start_x, start_y),
                          (end_x, end_y), box_color, 2)

            # Label processed image
            cv2.putText(frame, label, (start_x, yPos),
                        cv2.FONT_HERSHEY_SIMPLEX, optimal_font_scale, box_color, 2)

        return frame, people

    def predict_age_gender_emotion(self, input_path: str):
        # Read Input Image
        img = cv2.imread(input_path)
        # resize the image, uncomment if you want to resize the image
        img = cv2.resize(img, (self.frame_width, self.frame_height))

        frame, people = self.predict_age_gender_emotion_utility(img)

        for person in people:
            for key in person:
                print(key, person[key])
            print(self.recommend_category(person))
            print()

    def predict(self, img):
        # resize the image, uncomment if you want to resize the image
        img = cv2.resize(img, (self.frame_width, self.frame_height))

        _, people = self.predict_age_gender_emotion_utility(img)

        categories = []
        for person in people:
            categories.append(self.recommend_category(person))

        return categories

    def recommend_category(self, params):
        categories = {
            '(0, 2)': {
                'Male': ['baby food'],
                'Female': ['baby food']
            },
            '(4, 6)': {
                'Male': ['sports'],
                'Female': ['fruit snacks']
            },
            '(8, 12)': {
                'Male': ['outdoors',
                         'toys',
                         'sports'],
                'Female': ['outdoors',
                           'toys',
                           'sports']
            },
            '(15, 20)': {
                'Male': ['sports',
                         'outdoors',
                         'computers'],
                'Female': ['beauty and health',
                           'sports',
                           'computers']
            },
            '(25, 32)': {
                'Male': ['electronics',
                         'computers',
                         'sports',
                         'automotive',
                         'food and grocery'],
                'Female': ['beauty and health',
                           'computers',
                           'sports',
                           'jewelry',
                           'food and grocery']
            },
            '(38, 43)': {
                'Male': ['electronics',
                         'automotive',
                         'industrial',
                         'food and grocery'],
                'Female': ['beauty and health',
                           'jewelry',
                           'food and grocery']
            },
            '(48, 53)': {
                'Male': ['electronics',
                         'automotive',
                         'food and grocery'],
                'Female': ['beauty and health',
                           'jewelry',
                           'food and grocery']
            },
            '(60, 100)': {
                'Male': ['automotive',
                         'food and grocery'],
                'Female': ['beauty and health',
                           'jewelry',
                           'food and grocery']
            }
        }

        age = params['age']
        gender = params['gender']

        return random.choice(categories[age][gender])


if __name__ == "__main__":

    model = ImageAnalysis()

    model.predict_age_gender_emotion('obama.jpeg')
