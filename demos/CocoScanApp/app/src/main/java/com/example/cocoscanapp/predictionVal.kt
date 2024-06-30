package com.example.cocoscanapp

import android.graphics.Bitmap
import android.graphics.RectF

data class predictionVal (
    val x1: Float,
    val y1: Float,
    val x2: Float,
    val y2: Float,
    val cx: Float,
    val cy: Float,
    val w: Float,
    val h: Float,
    val cnf: Float,
    val cls: Int,
    val clsName: String
)

{
}