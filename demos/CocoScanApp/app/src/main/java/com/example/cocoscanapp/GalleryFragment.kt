package com.example.cocoscanapp

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

        selectBtn.setOnClickListener {
            val intent = Intent()
            intent.action = Intent.ACTION_GET_CONTENT
            intent.type = "image/*"
            startActivityForResult(intent, 100)
        }

        predBtn.setOnClickListener {
            val context = requireContext()
            val model = AutoModel35EpochFloat32.newInstance(context)

            // Creates inputs for reference.
            val image = TensorImage.fromBitmap(bitmap)

            // Runs model inference and gets result.
            val outputs = model.process(image)
            val output = outputs.outputAsCategoryList

            // Releases model resources if no longer used.
            model.close()

            // Display result
            resView.text = output.toString()
        }

        return view
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)

        if (requestCode == 100 && resultCode == android.app.Activity.RESULT_OK) {
            val uri = data?.data
            val contentResolver = context?.contentResolver
            bitmap = MediaStore.Images.Media.getBitmap(contentResolver, uri)
            imageView.setImageBitmap(bitmap)
        }
    }
}