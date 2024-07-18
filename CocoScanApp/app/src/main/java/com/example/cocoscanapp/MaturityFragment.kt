package com.example.cocoscanapp

import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.ImageView
import android.widget.LinearLayout
import androidx.viewpager2.widget.ViewPager2

class MaturityFragment : Fragment() {

    private lateinit var viewPager: ViewPager2
    private lateinit var dotIndictor: LinearLayout

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        // Inflate the layout for this fragment
        val view = inflater.inflate(R.layout.fragment_maturity, container, false)

        viewPager = view.findViewById(R.id.viewPagerMaturity)
        dotIndictor = view.findViewById(R.id.dotIndictorMaturity)

        val items = listOf(
            Model("Image 1", "Description 1", R.drawable.premature),
            Model("Image 2", "Description 2", R.drawable.mature),
            Model("Image 3", "Description 3", R.drawable.overmature),
        )
        val adapter = MyPagerAdapter(items)
        viewPager.adapter = adapter

        createDotIndictor(items.size)

        viewPager.registerOnPageChangeCallback(object : ViewPager2.OnPageChangeCallback() {
            override fun onPageSelected(position: Int) {
                super.onPageSelected(position)
                updateDotIndictor(position)
            }
        })

        // Set up the button to navigate to TutorialFragment
        val tutorialButton: Button = view.findViewById(R.id.helpButton)
        tutorialButton.setOnClickListener {
            fragmentManager?.beginTransaction()?.apply {
                replace(R.id.frame_container, HelpFragment())
                addToBackStack(null)
                commit()
            }
        }

        return view
    }

    private fun createDotIndictor(count: Int) {
        for (i in 0 until count) {
            val dot = ImageView(requireContext())
            dot.setImageResource(R.drawable.dot_selector)
            dotIndictor.addView(dot)
        }
    }

    private fun updateDotIndictor(position: Int) {
        for (i in 0 until dotIndictor.childCount) {
            val dot = dotIndictor.getChildAt(i) as ImageView
            dot.isSelected = i == position
        }
    }
}