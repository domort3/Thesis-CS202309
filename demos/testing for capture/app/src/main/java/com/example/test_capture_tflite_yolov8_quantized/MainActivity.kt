package com.example.test_capture_tflite_yolov8_quantized

import android.content.Intent
import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.Paint
import android.graphics.RectF
import android.os.Bundle
import android.provider.MediaStore
import android.widget.Button
import android.widget.ImageView
import android.widget.TextView
import android.widget.Toast
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import org.tensorflow.lite.Interpreter
import org.tensorflow.lite.support.image.ImageProcessor
import org.tensorflow.lite.support.image.ops.ResizeOp


class MainActivity : AppCompatActivity() {

    lateinit var button_select: Button
    lateinit var button_predict: Button
    lateinit var text_predict: TextView
    lateinit var imageView: ImageView
    lateinit var bitmap: Bitmap
    private var interpreter : Interpreter? = null
    var boxPaint: Paint = Paint()
    var textPain: Paint = Paint()



    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_main)
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }
        boxPaint.setStrokeWidth(5f);
        boxPaint.setStyle(Paint.Style.STROKE);
        boxPaint.setColor(Color.RED);

        textPain.setTextSize(50f);
        textPain.setColor(Color.GREEN);
        textPain.setStyle(Paint.Style.FILL);

        var modelSetup = YOLOv8Detector(this)
        modelSetup.setup()



        // assign buttons
        button_select = findViewById(R.id.button_select)
        button_predict = findViewById(R.id.button_predict)
        text_predict = findViewById(R.id.text_forPredict)
        imageView = findViewById(R.id.imageView)

        // old code -----
        var imageProcessor = ImageProcessor.Builder()
            .add(ResizeOp(640, 640, ResizeOp.ResizeMethod.BILINEAR))
            .build()
        // old code -----


        button_select.setOnClickListener {
            val intent = Intent()
            intent.setAction(Intent.ACTION_GET_CONTENT)
            intent.setType("image/*")
            startActivityForResult(intent, 100)

        }

        button_predict.setOnClickListener {
            val outputs = modelSetup.detect(bitmap)
            val mutableBitmap = bitmap.copy(Bitmap.Config.ARGB_8888, true)
            //val canvas = Canvas(mutableBitmap)



            if (outputs != null) {
                println(outputs.size)
                for (recognition in outputs) {
                    println(recognition.cnf)
                    println(recognition.labelName)
                    text_predict.text = recognition.labelName
                    }
                }
            else{
                println("No coconut found")
            }
            imageView.setImageBitmap(mutableBitmap)
            }

        }





    @Deprecated("Deprecated in Java")
    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)

        if (requestCode == 100) {
            var uri = data?.data;
            bitmap = MediaStore.Images.Media.getBitmap(this.contentResolver, uri)
            var resizedImg : Bitmap = Bitmap.createScaledBitmap(bitmap,640,640,false    )
            imageView.setImageBitmap(resizedImg)
            val toast = Toast.makeText(this, "Image Selected", Toast.LENGTH_SHORT)
            toast.show()
        }

    }

// since this is a test app, put all funcs meant for detection model here

    // on processing output
     fun processOutput(array: FloatArray, numElements : Int, numChannel : Int, predictedImg : Bitmap ): finalDetails {
         val CONFIDENCE_THRESHOLD = 0.75f
         val IOU_THRESHOLD = 0.5f
         var labelString : String
         var labels = application.assets.open("coco-labels.txt").bufferedReader().readLines()
         labelString = ""
         println(numChannel.toString())
         println(numElements.toString())

        //section to find the best bounding box in detections
        val boundingBoxes = mutableListOf<BoundingBox>()

        for (c in 0 until numElements) {
            var maxConf = -1.0f
            var maxIdx = -1
            var j = 4
            var arrayIdx = c + numElements * j
            while (j < numChannel){
                if (array[arrayIdx] > maxConf) {
                    maxConf = array[arrayIdx]
                    maxIdx = j - 4
                }
                j++
                arrayIdx += numElements
            }

            // bounding boxes with a detection added to list

            if (maxConf > CONFIDENCE_THRESHOLD) {
                val clsName = labels[maxIdx]
                val cx = array[c] // 0
                val cy = array[c + numElements] // 1
                val w = array[c + numElements * 2]
                val h = array[c + numElements * 3]
                val x1 = cx - (w/2F)
                val y1 = cy - (h/2F)
                val x2 = cx + (w/2F)
                val y2 = cy + (h/2F)
                if (x1 < 0F || x1 > 1F) continue
                if (y1 < 0F || y1 > 1F) continue
                if (x2 < 0F || x2 > 1F) continue
                if (y2 < 0F || y2 > 1F) continue

                boundingBoxes.add(
                    BoundingBox(
                        x1 = x1, y1 = y1, x2 = x2, y2 = y2,
                        cx = cx, cy = cy, w = w, h = h,
                        cnf = maxConf, cls = maxIdx, clsName = clsName
                    )
                )
            }
        }
        // adjust bitmap size for captured image
        //TO DO: add a cropped section for coconut(?)
        //default value
        var finalImg = Bitmap.createScaledBitmap(predictedImg,640,640,false    )
        var details = finalDetails(labelString, finalImg)


        // return if nothing was detected
        if (boundingBoxes.isEmpty()){
            details.label = "unable to detect anything"
            return details
        }



        println("boundbox initial amount:" + boundingBoxes.count())

        var bestBox = applyNMS(boundingBoxes,IOU_THRESHOLD)
        details.label=bestBox[0].clsName

        // as of 06/15/2024 - NMS  method not working properly, some cnf vals in boundbox end up at 1.0f
        //need methods to erase false positives
        // change return here to redirecting to other funcs beforehand
         return details
     }
    // function to apply Non-Maximum Suppression
    private fun applyNMS(boxes: List<BoundingBox>, IOU_THRESHOLD : Float ): MutableList<BoundingBox> {
        val sortedBoxes = boxes.sortedByDescending { it.cnf }.toMutableList()
        val selectedBoxes = mutableListOf<BoundingBox>()
        while(sortedBoxes.isNotEmpty()) {
            val first = sortedBoxes.first()
            selectedBoxes.add(first)
            sortedBoxes.remove(first)

            val iterator = sortedBoxes.iterator()
            while (iterator.hasNext()) {
                val nextBox = iterator.next()
                val iou = calculateIoU(first, nextBox)
                if (iou >= IOU_THRESHOLD) {
                    iterator.remove()
                }
            }
        }

        return selectedBoxes

    }

    // function to calculate IoU

    private fun calculateIoU(box1: BoundingBox, box2: BoundingBox): Float {
        val x1 = maxOf(box1.x1, box2.x1)
        val y1 = maxOf(box1.y1, box2.y1)
        val x2 = minOf(box1.x2, box2.x2)
        val y2 = minOf(box1.y2, box2.y2)
        val intersectionArea = maxOf(0F, x2 - x1) * maxOf(0F, y2 - y1)
        val box1Area = box1.w * box1.h
        val box2Area = box2.w * box2.h
        return intersectionArea / (box1Area + box2Area - intersectionArea)
    }






}


