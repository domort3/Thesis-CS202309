package com.example.cocoscanapp

import android.graphics.Bitmap
import android.graphics.RectF

data class predictionVal (
    var labelId : Int,
    var labelName : String,
    var cnf : Float,
    var rectF : RectF
)

{
}