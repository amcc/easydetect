# easydetect

A collection of machine learning pose detection examples that make pose detection easy to use.

Both ml5js and Google MediaPipe are difficult to implement for new users of JavaScript and p5js.

If you're just getting started with JavaScript and p5js then use ml5. For faster and more accurate detection the MediaPipe is excellent

## ml5

To allow ml5js poseNet to be used in a really simple way that does not require any knowledge about conditionals or loops a file easyPoseNet.js is imported to allow access to all the body parts with x/y values. For instance you can draw a circle on the nose like so:

<pre>
circle(nose.x, nose.y, 10)
</pre>

[ml5js easy posenet](ml5/)

## mediapipe

To vastly simplify Google MediaPipe and make it easy to use with p5js without we have imported the file mediaPipe.js as an inline module. This makes it easy to see what is happening all in the index.html file. A variable called _mediaPipe_ is made global and contains all the necessary stuff to play with in p5js.

Look at the mediaPipe.js file to see how things work. All code is from here:
https://mediapipe-studio.webapps.google.com/

[MediaPipe pose landmark](mediaPipe/poseLandmarks/)  
[MediaPipe hand landmark](mediaPipe/handLandmarks/)  
[MediaPipe face landmark](mediaPipe/faceLandmarks/)

## more examples

The examples folder has different versions of the above. Different methods of adding mediaPipe.js have been used. There are examples with the camera flipped, or not and with lerping added and not with the pose landmarks for example.

[examples](examples/)
