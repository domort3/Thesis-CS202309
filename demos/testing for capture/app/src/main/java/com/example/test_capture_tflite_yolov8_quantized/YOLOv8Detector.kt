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
    private val IOU_THRESHOLD = 0.65f
    private val IOU_CLASS_DUPLICATED_THRESHOLD = 0.9f

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

    fun setup() {

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

    fun detect(frame : Bitmap) : List<predictionVal>?{
        // verify values
        interpreter ?: return null
        if (tensorWidth == 0) return null
        if (tensorHeight == 0) return null
        if (numChannel == 0) return null
        if (numElements == 0) return null
        val resizedBitmap = Bitmap.createScaledBitmap(frame, tensorWidth, tensorHeight, false)
        val tensorImage = TensorImage(DataType.FLOAT32)
        tensorImage.load(resizedBitmap)
        val processedImage = imageProcessor.process(tensorImage)
        val imageBuffer = processedImage.buffer
        val output = TensorBuffer.createFixedSize(intArrayOf(1 , numChannel, numElements), DataType.FLOAT32)
        interpreter?.run(imageBuffer, output.buffer)
        val outputPredictions = bestBox(output.floatArray)
        return outputPredictions

    }

    // POST-PROCESSING

 fun bestBox (array : FloatArray): List<predictionVal>? {
    var allPredictions = mutableListOf<predictionVal>()
    val bitmapHeight = 640f
    val bitmapWidth = 640f
    for (i in 0 until numElements){

        var gridStride = i * outputSize[1]
        var x = array[0 + gridStride] *bitmapWidth
        var y = array[1 + gridStride] *bitmapHeight
        var w = array[2 + gridStride] *bitmapWidth
        var h = array[3 + gridStride] *bitmapHeight
        var xmin = maxOf(0f,x-w/2)
        var ymin = maxOf(0f,y-h/2)
        var xmax = maxOf(bitmapWidth,x+w/2)
        var ymax = maxOf(bitmapHeight,y+h/2)
        var confidence = array[4+gridStride]
        var maxConf = -1.0f
        var maxIdx = -1
        var j = 4
        var arrayIdx = i + numElements * j
        println("current var: " + gridStride + ", confidence:" + confidence)
        while (j < numChannel){
            if (array[arrayIdx] > maxConf) {
                maxConf = array[arrayIdx]
                maxIdx = j - 4
            }
            j++
            arrayIdx += numElements
        }

            allPredictions.add(
                predictionVal(
                    maxIdx,
                    labels[maxIdx],
                    maxConf,
                    RectF(xmin,ymin,xmax,ymax)
                ))


    }
    if (allPredictions.isEmpty()) return null
    val nmsPredictions = applyNMS(allPredictions)
    return applyClassNMS(nmsPredictions)
}

    private fun applyNMS(predictions: List<predictionVal>):MutableList<predictionVal>{
        var nmsPredictions = mutableListOf<predictionVal>()
        for (c in 0 until outputSize[2]-7){
            val pq: PriorityQueue<predictionVal> = PriorityQueue<predictionVal>(
                8400
            ) { l, r -> // Intentionally reversed to put high confidence at the head of the queue.
                r.cnf.compareTo(l.cnf)
            }
            for (j in 0 until predictions.size) {
                if (predictions.get(j).labelId == c && predictions.get(j)
                        .cnf > CONFIDENCE_THRESHOLD
                ) {
                    pq.add(predictions.get(j))
                }
            }
            while(pq.size > 0){
                val a: Array<predictionVal> = arrayOf<predictionVal>()
                val detections: Array<predictionVal> = pq.toArray(a)
                val max: predictionVal = detections[0]
                nmsPredictions.add(max);
                pq.clear();

                //WIP (ill finish later)
                for (k in 1 until detections.size){
                    var detection : predictionVal = detections[k]
                    if(boxIou(max.rectF,detection.rectF) < IOU_THRESHOLD){
                        pq.add(detection)
                    }
                }
            }
                }
        println(nmsPredictions.size)
        return nmsPredictions
        }
    private fun applyClassNMS(predictions: List<predictionVal>):MutableList<predictionVal>{
        var sortedNMS = mutableListOf<predictionVal>()

        val pq: PriorityQueue<predictionVal> = PriorityQueue<predictionVal>(
            100
        ) { l, r -> // Intentionally reversed to put high confidence at the head of the queue.
            r.cnf.compareTo(l.cnf)
        }
        for (j in 0 until predictions.size) {
            if (predictions.get(j)
                    .cnf > CONFIDENCE_THRESHOLD
            ) {
                pq.add(predictions.get(j))
            }
        }
        while(pq.size > 0){
            val a: Array<predictionVal> = arrayOf<predictionVal>()
            val detections: Array<predictionVal> = pq.toArray(a)
            val max: predictionVal = detections[0]
            sortedNMS.add(max)
            pq.clear()
            for (k in 1 until detections.size){
                var detection : predictionVal = detections[k]
                if(boxIou(max.rectF,detection.rectF) < IOU_CLASS_DUPLICATED_THRESHOLD){
                    pq.add(detection)
                }
            }
        }
        println(sortedNMS.size)
        return sortedNMS
    }
    private fun boxIou (a : RectF, b : RectF) : Float {

        val intersection = boxIntersection(a, b)
        val union = boxUnion(a, b)
        return if (union <= 0) 1.0f else intersection / union

    }
    private fun boxIntersection (a: RectF, b: RectF): Float {
        val maxLeft = if (a.left > b.left) a.left else b.left
        val maxTop = if (a.top > b.top) a.top else b.top
        val minRight = if (a.right < b.right) a.right else b.right
        val minBottom = if (a.bottom < b.bottom) a.bottom else b.bottom
        val w = minRight - maxLeft
        val h = minBottom - maxTop
        return if (w < 0 || h < 0) 0f else w * h

    }
    private fun boxUnion(a: RectF, b: RectF): Float {
        val i = boxIntersection(a, b)
        return (a.right - a.left) * (a.bottom - a.top) + (b.right - b.left) * (b.bottom - b.top) - i
    }

}






