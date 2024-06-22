package com.example.test_capture_tflite_yolov8_quantized

import android.content.Context
import android.graphics.Bitmap
import android.graphics.RectF
import android.os.SystemClock
import org.tensorflow.lite.DataType
import org.tensorflow.lite.Interpreter
import org.tensorflow.lite.support.common.FileUtil
import org.tensorflow.lite.support.image.ImageProcessor
import org.tensorflow.lite.support.image.TensorImage
import org.tensorflow.lite.support.image.ops.ResizeOp
import org.tensorflow.lite.support.tensorbuffer.TensorBuffer
import java.io.BufferedReader
import java.io.IOException
import java.io.InputStream
import java.io.InputStreamReader
import java.util.Arrays
import java.util.PriorityQueue


class YOLOv8Detector (private val context: Context) {

    private var inputSize = android.util.Size(640, 640)
    private var outputSize = intArrayOf(1, 7, 8400)

    private val CONFIDENCE_THRESHOLD = 0.75f;
    private val IOU_THRESHOLD = 0.45f
    private val IOU_CLASS_DUPLICATED_THRESHOLD = 0.7f

    private var labelsFile = "coco-labels.txt"
    private var modelFile = "35-epoch_float32.tflite"
    private var labels = mutableListOf<String>()

    private var interpreter : Interpreter? = null
    private var tensorWidth = 0
    private var tensorHeight = 0
    private var numChannel = 0
    private var numElements = 0

    private val imageProcessor = ImageProcessor.Builder()
        .add(ResizeOp(640, 640, ResizeOp.ResizeMethod.BILINEAR))
        .build()

    private fun setup() {

        // read labels.txt
        try {
            val inputStream: InputStream = context.assets.open(labelsFile)
            val reader = BufferedReader(InputStreamReader(inputStream))

            var line: String? = reader.readLine()
            while (line != null && line != "") {
                labels.add(line)
                line = reader.readLine()
            }

            reader.close()
            inputStream.close()

        }catch (e: IOException) {
            e.printStackTrace()
        }

        //setup interpreter
        val modelForInterpreter = FileUtil.loadMappedFile(context, "35-epoch_float32.tflite")
        val options = Interpreter.Options()
        options.setNumThreads(4)
        interpreter = Interpreter(modelForInterpreter, options)

        val inputShape = interpreter?.getInputTensor(0)?.shape() ?: return
        val outputShape = interpreter?.getOutputTensor(0)?.shape() ?: return

        tensorWidth = inputShape[1]
        tensorHeight = inputShape[2]
        numChannel = outputShape[1]
        numElements = outputShape[2]


    }

    fun clear() {
        interpreter?.close()
        interpreter = null
    }

    fun detect(frame : Bitmap){
        // verify values
        interpreter ?: return
        if (tensorWidth == 0) return
        if (tensorHeight == 0) return
        if (numChannel == 0) return
        if (numElements == 0) return

        var inferenceTime = SystemClock.uptimeMillis()

        val resizedBitmap = Bitmap.createScaledBitmap(frame, tensorWidth, tensorHeight, false)

        val tensorImage = TensorImage(DataType.FLOAT32)
        tensorImage.load(resizedBitmap)
        val processedImage = imageProcessor.process(tensorImage)
        val imageBuffer = processedImage.buffer

        val output = TensorBuffer.createFixedSize(intArrayOf(1 , numChannel, numElements), DataType.FLOAT32)
        interpreter?.run(imageBuffer, output.buffer)


        val outputPredictions = bestBox(output.floatArray)
        inferenceTime = SystemClock.uptimeMillis() - inferenceTime




    }

    // POST-PROCESSING

private fun bestBox (array : FloatArray): List<predictionVal>? {

    var allPredictions = mutableListOf<predictionVal>()
    val bitmapHeight = tensorHeight.toFloat()
    val bitmapWidth = tensorWidth.toFloat()

    for (c in 0 until numElements){
        var gridStride = c * outputSize[2]
        var x = array[0 + gridStride] * bitmapWidth
        var y = array[1 + gridStride] * bitmapHeight
        var w = array[2 + gridStride] * bitmapWidth
        var h = array[3 + gridStride] * bitmapHeight
        var xmin = Math.max(0f,x-w/2)
        var ymin = Math.max(0f,y-h/2)
        var xmax = Math.max(bitmapWidth,x+w/2)
        var ymax = Math.max(bitmapHeight,y+h/2)
        var confidence = array[4+gridStride]
        val classScores : FloatArray = Arrays.copyOfRange(
            array,
            7 + gridStride,
            outputSize[2] + gridStride
        )

        var labelId = 0
        var maxLabelScores = 0f

    for (d in 0 until classScores.size){
        if (classScores[d] > maxLabelScores){
            maxLabelScores = classScores[d]
            labelId = d
        }
    }
        allPredictions.add(
            predictionVal(
                labelId,
                "",
                maxLabelScores,
                confidence,
                RectF(xmin,ymin,xmax,ymax)
            )
        )


    }
    if (allPredictions.isEmpty()) return null

    var nmsPredictions = applyNMS(allPredictions)
    return applyClassNMS(nmsPredictions)

}

    private fun applyNMS(predictions: List<predictionVal>):MutableList<predictionVal>{

        var nmsPredictions = mutableListOf<predictionVal>()

        for (c in 0 until outputSize[2]-7){
            val pq: PriorityQueue<predictionVal> = PriorityQueue<predictionVal>(
                8400,
                Comparator<predictionVal> { l, r -> // Intentionally reversed to put high confidence at the head of the queue.
                    r.getConfidence().compareTo(l.getConfidence())
                })
            for (j in 0 until predictions.size) {
                if (predictions.get(j).getLabelId() == c && predictions.get(j)
                        .getConfidence() > CONFIDENCE_THRESHOLD
                ) {
                    pq.add(predictions.get(j))
                }

            }
            while(pq.size > 0){
                val a: Array<predictionVal?> = arrayOfNulls<predictionVal>(pq.size)
                val detections: Array<predictionVal> = pq.toArray(a)
                val max: predictionVal = detections[0]
                nmsPredictions.add(max);
                pq.clear();

                //WIP (ill finish later)

                for (int k = 1; k < detections.length; k++) {
                    Recognition detection = detections[k];
                    if (boxIou(max.getLocation(), detection.getLocation()) < IOU_THRESHOLD) {
                        pq.add(detection);
                    }
            }



                }

        return nmsPredictions

        }

    private fun applyClassNMS(predictions: List<predictionVal>):MutableList<predictionVal>{
        var sortedNMS = mutableListOf<predictionVal>()

        return sortedNMS
    }


}




