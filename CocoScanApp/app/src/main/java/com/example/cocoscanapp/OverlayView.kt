package com.example.cocoscanapp

import android.content.Context
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.Paint
import android.graphics.Rect
import android.graphics.RectF
import android.util.AttributeSet
import android.view.View
import android.widget.Toast
import androidx.core.content.ContextCompat
import com.example.cocoscanapp.BoundingBox
import com.example.cocoscanapp.R
import java.util.LinkedList
import kotlin.math.max
import android.os.Handler
import android.os.Looper

class OverlayView(context: Context?, attrs: AttributeSet?) : View(context, attrs) {

    private val handler = Handler(Looper.getMainLooper())
    private var lastToastTime = 0L
    private val toastDelay = 5000L // 5 seconds in milliseconds
    private var results = listOf<BoundingBox>()
    private var boxPaint = Paint()
    private var textBackgroundPaint = Paint()
    private var textPaint = Paint()

    private var bounds = Rect()

    init {
        initPaints()
    }

    fun clear() {
        textPaint.reset()
        textBackgroundPaint.reset()
        boxPaint.reset()
        invalidate()
        initPaints()
    }

    private fun initPaints() {
        textBackgroundPaint.color = Color.BLACK
        textBackgroundPaint.style = Paint.Style.FILL
        textBackgroundPaint.textSize = 50f

        textPaint.color = Color.WHITE
        textPaint.style = Paint.Style.FILL
        textPaint.textSize = 50f

        boxPaint.color = ContextCompat.getColor(context!!, R.color.lightgreen)
        boxPaint.strokeWidth = 8F
        boxPaint.style = Paint.Style.STROKE
    }

    override fun draw(canvas: Canvas) {
        super.draw(canvas)

        results.forEach {
            val left = it.x1 * width
            val top = it.y1 * height
            val right = it.x2 * width
            val bottom = it.y2 * height

            canvas.drawRect(left, top, right, bottom, boxPaint)
            val cnfResults = it.cnf * 100
            val cnfRounded = "%.2f".format(cnfResults).toDouble()
            val drawableText = "Maturity: "+it.clsName+" - %"+cnfRounded.toString()

            textPaint.textSize = 30f // Change this value to your desired text size

            textBackgroundPaint.getTextBounds(drawableText, 0, drawableText.length, bounds)
            val textWidth = bounds.width()
            val textHeight = bounds.height()

            // Adjust the background size
            val backgroundPadding = 15 // Change this value to adjust padding
            val backgroundLeft = left - backgroundPadding
            val backgroundTop = top - backgroundPadding
            val backgroundRight = left + textWidth + backgroundPadding
            val backgroundBottom = top + textHeight + backgroundPadding

            // Draw the background rectangle with adjusted size
            canvas.drawRect(backgroundLeft, backgroundTop, backgroundRight, backgroundBottom, textBackgroundPaint)
            canvas.drawText(drawableText, left, top + bounds.height(), textPaint)

            if (it.clsName == "Premature" && cnfRounded > 90 && System.currentTimeMillis() - lastToastTime > toastDelay) {
                lastToastTime = System.currentTimeMillis()
                handler.postDelayed({
                    Toast.makeText(context, "Tiny, unripe, green coconut lacking of maturity", Toast.LENGTH_SHORT).show()
                }, toastDelay)
            }

            if (it.clsName == "Mature" && cnfRounded > 90 && System.currentTimeMillis() - lastToastTime > toastDelay) {
                lastToastTime = System.currentTimeMillis()
                handler.postDelayed({
                    Toast.makeText(context, "Edible with firm flesh and sweet water", Toast.LENGTH_SHORT).show()
                }, toastDelay)
            }

            if (it.clsName == "Overmature" && cnfRounded > 90 && System.currentTimeMillis() - lastToastTime > toastDelay) {
                lastToastTime = System.currentTimeMillis()
                handler.postDelayed({
                    Toast.makeText(context, "Aged and dried with tough husk and possibly spoiled", Toast.LENGTH_SHORT).show()
                }, toastDelay)
            }

        }
    }

    fun setResults(boundingBoxes: List<BoundingBox>) {
        results = boundingBoxes
        invalidate()
    }

    companion object {
        private const val BOUNDING_RECT_TEXT_PADDING = 8
    }
}