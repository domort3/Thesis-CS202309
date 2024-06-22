package com.example.test_capture_tflite_yolov8_quantized

import android.graphics.Bitmap
import android.graphics.RectF

public class predictionVal (
    var labelId : Int,
    var labelName : String,
    var labelScore : Float,
    var cnf : Float,
    var rectF : RectF
)

{
    // GET FUNCTIONS
    public fun getLabelId() : Int {
        return labelId
    }
    public fun getLabelName() : String {
        return labelName
    }
    public fun getLabelScore() : Float {
        return labelScore
    }
    public fun getConfidence() : Float{
        return cnf
    }
    public fun getLocation() : RectF {
        return RectF(rectF)
    }
    // SET FUNCTIONS
    public fun setLabelId(labelId: Int) {
        this.labelId = labelId
    }
    public fun setLabelName(labelName: String) {
        this.labelName = labelName
    }
    public fun setLabelScore(labelScore: Float) {
        this.labelScore = labelScore
    }
    public fun setConfidence(cnf: Float) {
        this.cnf = cnf
    }
    public fun setLocation(rectF: RectF) {
        this.rectF = rectF
    }

}