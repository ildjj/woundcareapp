package com.woundcare.assessment.data.database.converters

import androidx.room.TypeConverter
import org.threeten.bp.LocalDate
import org.threeten.bp.LocalDateTime
import org.threeten.bp.format.DateTimeFormatter

class DateTimeConverters {
    
    companion object {
        private val localDateFormatter = DateTimeFormatter.ISO_LOCAL_DATE
        private val localDateTimeFormatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME
    }
    
    @TypeConverter
    fun fromLocalDate(localDate: LocalDate?): String? {
        return localDate?.format(localDateFormatter)
    }
    
    @TypeConverter
    fun toLocalDate(dateString: String?): LocalDate? {
        return dateString?.let { LocalDate.parse(it, localDateFormatter) }
    }
    
    @TypeConverter
    fun fromLocalDateTime(localDateTime: LocalDateTime?): String? {
        return localDateTime?.format(localDateTimeFormatter)
    }
    
    @TypeConverter
    fun toLocalDateTime(dateTimeString: String?): LocalDateTime? {
        return dateTimeString?.let { LocalDateTime.parse(it, localDateTimeFormatter) }
    }
}