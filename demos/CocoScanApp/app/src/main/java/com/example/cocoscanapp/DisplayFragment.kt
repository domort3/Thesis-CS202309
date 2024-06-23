package com.example.cocoscanapp

import android.app.Activity
import android.content.ActivityNotFoundException
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
import android.widget.Toast
import java.io.ByteArrayOutputStream

class DisplayFragment : Fragment() {

    private val REQUEST_IMAGE_CAPTURE = 100

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val view = inflater.inflate(R.layout.fragment_display, container, false)
        val imageView = view.findViewById<ImageView>(R.id.displayImageView)

        // Retrieve the bitmap from arguments
        val byteArray = arguments?.getByteArray("image")
        val bitmap = BitmapFactory.decodeByteArray(byteArray, 0, byteArray!!.size)
        imageView.setImageBitmap(bitmap)

        // Set up buttons
        val takePhotoButton = view.findViewById<Button>(R.id.button)
        val uploadFromGalleryButton = view.findViewById<Button>(R.id.button2)

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
            val displayFragment = newInstance(imageBitmap)
            fragmentManager?.beginTransaction()
                ?.replace(R.id.frame_container, displayFragment)
                ?.addToBackStack(null)
                ?.commit()
        }
    }
}