package com.example.cocoscanapp

import android.view.LayoutInflater
import androidx.recyclerview.widget.RecyclerView
import android.view.View
import android.widget.TextView
import android.widget.ImageView
import android.view.ViewGroup

data class Model(val title : String, val desc : String, val imageResId: Int)
class MyPagerAdapter(private val items: List<Model>) : RecyclerView.Adapter<MyPagerAdapter.PagerViewHolder> () {

    inner class PagerViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView)

    override fun onCreateViewHolder(
        parent: ViewGroup,
        viewType: Int
    ): PagerViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_page, parent, false)
        return PagerViewHolder(view)
    }

    override fun onBindViewHolder(holder: PagerViewHolder, position: Int) {
        val item = items[position]

        val imageView= holder.itemView.findViewById<ImageView>(R.id.imageView)


        imageView.setImageResource(item.imageResId)
    }

    override fun getItemCount(): Int {
        return items.size
    }
}