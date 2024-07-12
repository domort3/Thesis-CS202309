package com.example.cocoscanapp

import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.fragment.app.Fragment
import com.example.cocoscanapp.databinding.ActivityMainBinding
import com.google.android.material.bottomnavigation.BottomNavigationView
import com.google.android.material.floatingactionbutton.FloatingActionButton

class MainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMainBinding
    private lateinit var bottomNavigationView: BottomNavigationView
    private lateinit var fabCenter: FloatingActionButton

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        changeStatusBarColor("#C6EDC3")
        bottomNavigationView = findViewById(R.id.bottom_navigation)
        fabCenter = findViewById(R.id.fab_center)

        bottomNavigationView.setOnItemSelectedListener { menuItem ->
            when (menuItem.itemId) {
                R.id.bottom_home -> {
                    replaceFragment(HomeFragment())
                    true
                }
                R.id.bottom_help -> {
                    replaceFragment(HelpFragment())
                    true
                }
                else -> false
            }
        }
        replaceFragment(HomeFragment())

        fabCenter.setOnClickListener {
            supportFragmentManager.beginTransaction().apply {
                replace(R.id.frame_container, cameraUpdated())
                addToBackStack(null)
                commit()
                Toast.makeText(applicationContext, "DISCLAIMER: Predictions are not final and may be inaccurate", Toast.LENGTH_LONG).show()
            }
        }
    }

    private fun replaceFragment(fragment: Fragment) {
        supportFragmentManager.beginTransaction().replace(R.id.frame_container, fragment).commit()
    }

    private fun changeStatusBarColor(color: String) {
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.LOLLIPOP) {
            window.apply {
                addFlags(android.view.WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS)
                statusBarColor = android.graphics.Color.parseColor(color)
            }
        }
    }
}