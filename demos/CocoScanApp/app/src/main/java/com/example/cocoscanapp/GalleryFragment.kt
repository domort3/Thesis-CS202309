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
import android.widget.ImageView
import android.widget.Toast
import java.io.ByteArrayOutputStream

class GalleryFragment : Fragment() {

    lateinit var selectBtn: Button
    lateinit var predictBtn: Button
    lateinit var imageView: ImageView
    var bitmap: Bitmap? = null

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        // Inflate the layout for this fragment
        val view = inflater.inflate(R.layout.fragment_gallery, container, false)

        selectBtn = view.findViewById(R.id.selectBtn)
        predictBtn = view.findViewById(R.id.predictBtn)
        imageView = view.findViewById(R.id.imageView)

        selectBtn.setOnClickListener {
            val intent = Intent()
            intent.action = Intent.ACTION_GET_CONTENT
            intent.type = "image/*"
            startActivityForResult(intent, 100)
        }

        predictBtn.setOnClickListener {
            if (bitmap != null) {
                navigateToDisplayFragment(bitmap!!)
            } else {
                Toast.makeText(context, "Please select an image first", Toast.LENGTH_SHORT).show()
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
            // Resize the bitmap
            val resizedImg: Bitmap = Bitmap.createScaledBitmap(bitmap!!, 640, 640, false)
            bitmap = resizedImg
            imageView.setImageBitmap(bitmap)
        }
    }

    private fun navigateToDisplayFragment(bitmap: Bitmap) {
        val displayFragment = DisplayFragment.newInstance(bitmap)
        fragmentManager?.beginTransaction()
            ?.replace(R.id.frame_container, displayFragment)
            ?.addToBackStack(null)
            ?.commit()

        this.bitmap = null
    }
}