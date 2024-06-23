package com.example.cocoscanapp

import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import java.io.ByteArrayOutputStream

class DisplayFragment : Fragment() {

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

        return view
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
}