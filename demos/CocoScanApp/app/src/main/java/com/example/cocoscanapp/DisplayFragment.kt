package com.example.cocoscanapp

import android.app.Activity
import android.content.ActivityNotFoundException
import android.content.Context
import android.content.Intent
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.os.Bundle
import android.provider.MediaStore
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.ImageView
import android.widget.TextView
import android.widget.Toast
import java.io.ByteArrayOutputStream

class DisplayFragment : Fragment() {

    private val REQUEST_IMAGE_CAPTURE = 100
    lateinit var bitmap: Bitmap



    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val view = inflater.inflate(R.layout.fragment_display, container, false)
        val imageView = view.findViewById<ImageView>(R.id.displayImageView)
        val resultView = view.findViewById<TextView>(R.id.resultView)

        // Retrieve the bitmap from arguments
        val byteArray = arguments?.getByteArray("image")
        val bitmap = BitmapFactory.decodeByteArray(byteArray, 0, byteArray!!.size)
        imageView.setImageBitmap(bitmap)

        // Set up buttons
        val takePhotoButton = view.findViewById<Button>(R.id.button)
        val uploadFromGalleryButton = view.findViewById<Button>(R.id.button2)

        //-------------------- Using detector model here --------------------------
        //initialize model
        var modelSetup = YOLOv8Detector(requireContext())
        modelSetup.setup()

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

                    resultView.text = result.labelName
                    // set TextView answer here
                    //Variables from var result
                    //.labelName = name of label identified
                    //.rectF = rectF shape (if Paint() is to be used)
                    //.cnf = confidence of result
                    //text_predict.text = "label: " + result.labelName + ", confidence: " + result.cnf.toString()
                    //build canvas
                    //canvas.drawRect(result.rectF, boxPaint)
                    break;
                }
            }
        }

        //-------------------- Using detector model here --------------------------



        takePhotoButton.setOnClickListener {
            openCamera()
        }

        uploadFromGalleryButton.setOnClickListener {
            navigateToGallery()
        }

        return view
    }

    private fun openCamera() {
        val takePictureIntent = Intent(MediaStore.ACTION_IMAGE_CAPTURE)
        try {
            startActivityForResult(takePictureIntent, REQUEST_IMAGE_CAPTURE)
        } catch (e: ActivityNotFoundException) {
            Toast.makeText(context, "Error: " + e.localizedMessage, Toast.LENGTH_SHORT).show()
        }
    }

    private fun navigateToGallery() {
        val galleryFragment = GalleryFragment()
        fragmentManager?.beginTransaction()
            ?.replace(R.id.frame_container, galleryFragment)
            ?.addToBackStack(null)
            ?.commit()
    }

    companion object {
        // Convert Bitmap to ByteArray
        fun newInstance(bitmap: Bitmap): DisplayFragment {
            val fragment = DisplayFragment()
            val args = Bundle()
            val stream = ByteArrayOutputStream()
            bitmap.compress(Bitmap.CompressFormat.PNG, 100, stream)
            val byteArray = stream.toByteArray()
            args.putByteArray("image", byteArray)
            fragment.arguments = args
            return fragment
        }
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        if (requestCode == REQUEST_IMAGE_CAPTURE && resultCode == Activity.RESULT_OK) {
            val imageBitmap = data?.extras?.get("data") as Bitmap
            // get image bitmap from prev activity, set as bitmap to be processed by model
            var resizedImg : Bitmap = Bitmap.createScaledBitmap(imageBitmap,640,640,false    )
            bitmap = resizedImg
            val displayFragment = newInstance(imageBitmap)
            fragmentManager?.beginTransaction()
                ?.replace(R.id.frame_container, displayFragment)
                ?.addToBackStack(null)
                ?.commit()
        }
    }
}