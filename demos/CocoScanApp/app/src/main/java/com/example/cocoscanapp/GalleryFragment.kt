package com.example.cocoscanapp

import android.content.Context
import android.content.Intent
import android.graphics.Bitmap
import android.os.Bundle
import android.provider.MediaStore
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.TextView
import android.widget.ImageView
import com.example.cocoscanapp.ml.AutoModel35EpochFloat32
import org.tensorflow.lite.support.image.TensorImage

class GalleryFragment : Fragment() {

    lateinit var selectBtn: Button
    lateinit var predBtn: Button
    lateinit var resView: TextView
    lateinit var imageView: ImageView
    lateinit var bitmap: Bitmap


    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        // Inflate the layout for this fragment
        val view = inflater.inflate(R.layout.fragment_gallery, container, false)

        selectBtn = view.findViewById(R.id.selectBtn)
        predBtn = view.findViewById(R.id.predictBtn)
        resView = view.findViewById(R.id.resView)
        imageView = view.findViewById(R.id.imageView)


        //-------------------- Using detector model here --------------------------
        //initialize model
        var modelSetup = YOLOv8Detector(requireContext())
        modelSetup.setup()



        //-------------------- Using detector model here --------------------------

        selectBtn.setOnClickListener {
            val intent = Intent()
            intent.action = Intent.ACTION_GET_CONTENT
            intent.type = "image/*"
            startActivityForResult(intent, 100)
        }

        predBtn.setOnClickListener {
            //run model
            val outputs = modelSetup.detect(bitmap)
            if (outputs != null) {
                for (i in outputs){
                    if (i.cnf < 1.0f){
                        var result = i
                        if(result.labelName=="mature_coconut"){
                            result.labelName="mature coconut"
                        }
                        else if(result.labelName=="overmature_coconut") {
                            result.labelName="overmature coconut"
                        }
                        else if (result.labelName=="premature_coconut"){
                            result.labelName="premature coconut"
                        }
                        // set TextView answer here
                        //Variables from var result
                        //.labelName = name of label identified
                        //.rectF = rectF shape (if Paint() is to be used)
                        //.cnf = confidence of result
                        //text_predict.text = "label: " + result.labelName + ", confidence: " + result.cnf.toString()
                        //build canvas
                        //canvas.drawRect(result.rectF, boxPaint)
                        resView.text = result.labelName
                        break;
                    }
                }
            }
        }

        return view
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        if (requestCode == 100 && resultCode == android.app.Activity.RESULT_OK) {
            val uri = data?.data
            val contentResolver = context?.contentResolver
            bitmap = MediaStore.Images.Media.getBitmap(contentResolver, uri)
            // get image bitmap from prev activity, set as bitmap to be processed by model
            var resizedImg : Bitmap = Bitmap.createScaledBitmap(bitmap,640,640,false    )
            bitmap = resizedImg
            imageView.setImageBitmap(bitmap)
        }
    }
}