package com.woundcare.assessment.presentation.dashboard

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class DashboardViewModel @Inject constructor() : ViewModel() {
    
    private val _uiState = MutableStateFlow(DashboardUiState())
    val uiState: StateFlow<DashboardUiState> = _uiState.asStateFlow()
    
    init {
        loadDashboardData()
    }
    
    private fun loadDashboardData() {
        viewModelScope.launch {
            // Load dashboard data from repositories
            // This would integrate with the actual data layer
            _uiState.value = DashboardUiState(
                statistics = DashboardStatistics(
                    totalPatients = 45,
                    activeWounds = 78,
                    assessmentsThisWeek = 23,
                    healingRate = 82,
                    avgHealingTime = 6,
                    photosThisMonth = 156
                ),
                urgentWounds = listOf(
                    UrgentWoundInfo(
                        patientId = "1",
                        woundId = "w1",
                        patientName = "John Doe",
                        woundNumber = 1,
                        location = "Left heel",
                        urgentReason = "Signs of infection detected"
                    )
                ),
                recentAssessments = listOf(
                    RecentAssessmentInfo(
                        patientId = "2",
                        woundId = "w2",
                        patientName = "Jane Smith",
                        bwatScore = 28,
                        healingStatus = "Regenerating",
                        assessmentDate = "Today, 2:30 PM"
                    )
                ),
                woundsDueForAssessment = listOf(
                    WoundDueInfo(
                        patientId = "3",
                        woundId = "w3",
                        patientName = "Bob Johnson",
                        woundNumber = 2,
                        location = "Sacrum",
                        dueDate = "Tomorrow",
                        isOverdue = false
                    )
                ),
                healingProgress = HealingProgressStats(
                    regenerating = 45,
                    stalled = 18,
                    degenerating = 6
                )
            )
        }
    }
}

data class DashboardUiState(
    val statistics: DashboardStatistics = DashboardStatistics(),
    val urgentWounds: List<UrgentWoundInfo> = emptyList(),
    val recentAssessments: List<RecentAssessmentInfo> = emptyList(),
    val woundsDueForAssessment: List<WoundDueInfo> = emptyList(),
    val healingProgress: HealingProgressStats = HealingProgressStats(),
    val isLoading: Boolean = false,
    val error: String? = null
)