package com.woundcare.tracker.viewmodels

import androidx.lifecycle.*
import com.woundcare.tracker.database.WoundCareDatabase
import com.woundcare.tracker.models.Assessment
import com.woundcare.tracker.models.Wound
import kotlinx.coroutines.launch
import java.util.*

class MainViewModel(private val database: WoundCareDatabase) : ViewModel() {
    
    private val _totalPatients = MutableLiveData<Int>()
    val totalPatients: LiveData<Int> = _totalPatients
    
    val activeWounds: LiveData<List<Wound>> = database.woundDao().getActiveWounds()
    
    private val _todayAssessments = MutableLiveData<Int>()
    val todayAssessments: LiveData<Int> = _todayAssessments
    
    private val _pendingReviews = MutableLiveData<Int>()
    val pendingReviews: LiveData<Int> = _pendingReviews
    
    init {
        loadDashboardData()
    }
    
    private fun loadDashboardData() {
        viewModelScope.launch {
            // Load total patients
            _totalPatients.value = database.patientDao().getPatientCount()
            
            // Load today's assessments
            val today = Calendar.getInstance().apply {
                set(Calendar.HOUR_OF_DAY, 0)
                set(Calendar.MINUTE, 0)
                set(Calendar.SECOND, 0)
                set(Calendar.MILLISECOND, 0)
            }.time
            
            val tomorrow = Calendar.getInstance().apply {
                time = today
                add(Calendar.DAY_OF_MONTH, 1)
            }.time
            
            val todayAssessmentsList = database.assessmentDao()
                .getAssessmentsByDateRange(today, tomorrow)
            _todayAssessments.value = todayAssessmentsList.size
            
            // Calculate pending reviews (assessments older than 7 days without follow-up)
            val sevenDaysAgo = Calendar.getInstance().apply {
                add(Calendar.DAY_OF_MONTH, -7)
            }.time
            
            val allActiveWounds = database.woundDao().getActiveWounds().value ?: emptyList()
            var pendingCount = 0
            
            for (wound in allActiveWounds) {
                val latestAssessment = database.assessmentDao().getLatestAssessment(wound.id)
                if (latestAssessment == null || latestAssessment.assessmentDate < sevenDaysAgo) {
                    pendingCount++
                }
            }
            
            _pendingReviews.value = pendingCount
        }
    }
    
    fun refreshData() {
        loadDashboardData()
    }
}

class MainViewModelFactory(private val database: WoundCareDatabase) : ViewModelProvider.Factory {
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        if (modelClass.isAssignableFrom(MainViewModel::class.java)) {
            @Suppress("UNCHECKED_CAST")
            return MainViewModel(database) as T
        }
        throw IllegalArgumentException("Unknown ViewModel class")
    }
}