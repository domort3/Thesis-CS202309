package com.example.cocoscanapp

import android.app.Activity.RESULT_OK
import android.app.Dialog
import android.content.ActivityNotFoundException
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
import androidx.fragment.app.FragmentTransaction

class HomeFragment : Fragment() {

    lateinit var cameraButton: Button
    lateinit var galleryButton: Button
    lateinit var imageView: ImageView
    lateinit var openDialogButton: Button
    val REQUEST_IMAGE_CAPTURE = 100

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        // Inflate the layout for this fragment
        val view = inflater.inflate(R.layout.fragment_home, container, false)

        cameraButton = view.findViewById(R.id.cameraButton)
        imageView = view.findViewById(R.id.imageLogo)
        openDialogButton = view.findViewById(R.id.openDialogButton)


        cameraButton.setOnClickListener {
            fragmentManager?.beginTransaction()?.apply {
                replace(R.id.frame_container, cameraUpdated())
                addToBackStack(null)
                commit()
                Toast.makeText(activity, "DISCLAIMER: Predictions are NOT final and may be inaccurate", Toast.LENGTH_LONG).show()
            }
        }

        openDialogButton.setOnClickListener {
            showDialog()
        }

        return view
    }



    private fun showDialog() {
        val dialog = Dialog(requireContext())
        dialog.setContentView(R.layout.start_dialog)
        dialog.window?.setBackgroundDrawableResource(R.drawable.dialog_background)

        val dialogButton = dialog.findViewById<Button>(R.id.dialogButton)
        dialogButton.setOnClickListener {
            dialog.dismiss()
        }

        dialog.show()
    }
}