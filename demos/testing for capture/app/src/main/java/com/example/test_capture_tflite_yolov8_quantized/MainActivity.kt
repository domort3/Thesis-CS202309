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
        // WIP (?)
        boxPaint.setStrokeWidth(5f);
        boxPaint.setStyle(Paint.Style.STROKE);
        boxPaint.setColor(Color.RED);

        textPain.setTextSize(50f);
        textPain.setColor(Color.GREEN);
        textPain.setStyle(Paint.Style.FILL);
        // WIP (?)

        //initialize model
        var modelSetup = YOLOv8Detector(this)
        modelSetup.setup()

        // assign buttons
        button_select = findViewById(R.id.button_select)
        button_predict = findViewById(R.id.button_predict)
        text_predict = findViewById(R.id.text_forPredict)
        imageView = findViewById(R.id.imageView)

        button_select.setOnClickListener {
            val intent = Intent()
            intent.setAction(Intent.ACTION_GET_CONTENT)
            intent.setType("image/*")
            startActivityForResult(intent, 100)

        }

        button_predict.setOnClickListener {
            val outputs = modelSetup.detect(bitmap)
            val mutableBitmap = bitmap.copy(Bitmap.Config.ARGB_8888, true)
            val canvas = Canvas(mutableBitmap)
            if (outputs != null) {
                for (i in outputs){
                    if (i.cnf < 1.0f){
                    var result = i
                    text_predict.text = "label: " + result.labelName + ", confidence: " + result.cnf.toString()
                    //build canvas
                    //canvas.drawRect(result.rectF, boxPaint)
                        break;
                }
                }
                }

            else{
                println("No coconut found")
                text_predict.text = "No coconut detected"
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







}


