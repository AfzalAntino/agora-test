package com.agora

import android.util.Log
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise



class MyMathModule(reactContext:ReactApplicationContext):ReactContextBaseJavaModule(reactContext) {
    override fun getName():String{
        return  "MyMathModule"
    }
    @ReactMethod
fun add(a:Int, b:Int, promise: Promise){
          val result = a+b
        promise.resolve(result)
}
@ReactMethod
    fun  sub(a:Int, b:Int, promise: Promise){
        val result = a-b
        promise.resolve((result))
    }
}