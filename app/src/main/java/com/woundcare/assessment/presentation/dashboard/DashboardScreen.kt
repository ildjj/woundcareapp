package com.woundcare.assessment.presentation.dashboard

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DashboardScreen(
    onNavigateToPatients: () -> Unit,
    onNavigateToCamera: () -> Unit,
    onNavigateToAssessment: (String, String) -> Unit,
    viewModel: DashboardViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsState()
    
    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Quick Actions Section
        item {
            QuickActionsSection(
                onNavigateToPatients = onNavigateToPatients,
                onNavigateToCamera = onNavigateToCamera
            )
        }
        
        // Statistics Overview
        item {
            StatisticsOverview(statistics = uiState.statistics)
        }
        
        // Urgent Attention Section
        item {
            if (uiState.urgentWounds.isNotEmpty()) {
                UrgentAttentionSection(
                    urgentWounds = uiState.urgentWounds,
                    onWoundClick = onNavigateToAssessment
                )
            }
        }
        
        // Recent Assessments
        item {
            RecentAssessmentsSection(
                recentAssessments = uiState.recentAssessments,
                onAssessmentClick = onNavigateToAssessment
            )
        }
        
        // Due for Assessment
        item {
            if (uiState.woundsDueForAssessment.isNotEmpty()) {
                DueForAssessmentSection(
                    woundsDue = uiState.woundsDueForAssessment,
                    onWoundClick = onNavigateToAssessment
                )
            }
        }
        
        // Healing Progress
        item {
            HealingProgressSection(healingStats = uiState.healingProgress)
        }
    }
}

@Composable
fun QuickActionsSection(
    onNavigateToPatients: () -> Unit,
    onNavigateToCamera: () -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.primaryContainer
        )
    ) {
        Column(
            modifier = Modifier.padding(16.dp)
        ) {
            Text(
                text = "Quick Actions",
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onPrimaryContainer
            )
            
            Spacer(modifier = Modifier.height(12.dp))
            
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceEvenly
            ) {
                QuickActionButton(
                    icon = Icons.Filled.PersonAdd,
                    title = "New Patient",
                    onClick = onNavigateToPatients
                )
                
                QuickActionButton(
                    icon = Icons.Filled.CameraAlt,
                    title = "Take Photo",
                    onClick = onNavigateToCamera
                )
                
                QuickActionButton(
                    icon = Icons.Filled.Assignment,
                    title = "New Assessment",
                    onClick = onNavigateToPatients
                )
                
                QuickActionButton(
                    icon = Icons.Filled.Analytics,
                    title = "View Reports",
                    onClick = { /* Navigate to reports */ }
                )
            }
        }
    }
}

@Composable
fun QuickActionButton(
    icon: ImageVector,
    title: String,
    onClick: () -> Unit
) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier = Modifier.clickable { onClick() }
    ) {
        Surface(
            modifier = Modifier.size(56.dp),
            shape = RoundedCornerShape(16.dp),
            color = MaterialTheme.colorScheme.surface,
            shadowElevation = 4.dp
        ) {
            Box(
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = icon,
                    contentDescription = title,
                    tint = MaterialTheme.colorScheme.primary,
                    modifier = Modifier.size(24.dp)
                )
            }
        }
        
        Spacer(modifier = Modifier.height(8.dp))
        
        Text(
            text = title,
            style = MaterialTheme.typography.bodySmall,
            textAlign = TextAlign.Center,
            color = MaterialTheme.colorScheme.onPrimaryContainer
        )
    }
}

@Composable
fun StatisticsOverview(statistics: DashboardStatistics) {
    Card(
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(
            modifier = Modifier.padding(16.dp)
        ) {
            Text(
                text = "Overview",
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold
            )
            
            Spacer(modifier = Modifier.height(16.dp))
            
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceEvenly
            ) {
                StatisticItem(
                    value = statistics.totalPatients.toString(),
                    label = "Total Patients",
                    color = MaterialTheme.colorScheme.primary
                )
                
                StatisticItem(
                    value = statistics.activeWounds.toString(),
                    label = "Active Wounds",
                    color = MaterialTheme.colorScheme.secondary
                )
                
                StatisticItem(
                    value = statistics.assessmentsThisWeek.toString(),
                    label = "This Week",
                    color = MaterialTheme.colorScheme.tertiary
                )
            }
            
            Spacer(modifier = Modifier.height(12.dp))
            
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceEvenly
            ) {
                StatisticItem(
                    value = "${statistics.healingRate}%",
                    label = "Healing Rate",
                    color = Color(0xFF4CAF50)
                )
                
                StatisticItem(
                    value = statistics.avgHealingTime.toString(),
                    label = "Avg Healing (weeks)",
                    color = Color(0xFFFF9800)
                )
                
                StatisticItem(
                    value = statistics.photosThisMonth.toString(),
                    label = "Photos This Month",
                    color = Color(0xFF9C27B0)
                )
            }
        }
    }
}

@Composable
fun StatisticItem(
    value: String,
    label: String,
    color: Color
) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(
            text = value,
            style = MaterialTheme.typography.headlineSmall,
            fontWeight = FontWeight.Bold,
            color = color
        )
        
        Text(
            text = label,
            style = MaterialTheme.typography.bodySmall,
            textAlign = TextAlign.Center,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )
    }
}

@Composable
fun UrgentAttentionSection(
    urgentWounds: List<UrgentWoundInfo>,
    onWoundClick: (String, String) -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.errorContainer
        )
    ) {
        Column(
            modifier = Modifier.padding(16.dp)
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(
                    imageVector = Icons.Filled.Warning,
                    contentDescription = "Urgent",
                    tint = MaterialTheme.colorScheme.error
                )
                
                Spacer(modifier = Modifier.width(8.dp))
                
                Text(
                    text = "Requires Urgent Attention (${urgentWounds.size})",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.onErrorContainer
                )
            }
            
            Spacer(modifier = Modifier.height(12.dp))
            
            urgentWounds.take(3).forEach { wound ->
                UrgentWoundItem(
                    woundInfo = wound,
                    onClick = { onWoundClick(wound.patientId, wound.woundId) }
                )
                
                if (wound != urgentWounds.last()) {
                    Spacer(modifier = Modifier.height(8.dp))
                }
            }
            
            if (urgentWounds.size > 3) {
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    text = "and ${urgentWounds.size - 3} more...",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onErrorContainer
                )
            }
        }
    }
}

@Composable
fun UrgentWoundItem(
    woundInfo: UrgentWoundInfo,
    onClick: () -> Unit
) {
    Surface(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onClick() },
        shape = RoundedCornerShape(8.dp),
        color = MaterialTheme.colorScheme.surface
    ) {
        Row(
            modifier = Modifier.padding(12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column(
                modifier = Modifier.weight(1f)
            ) {
                Text(
                    text = woundInfo.patientName,
                    style = MaterialTheme.typography.bodyMedium,
                    fontWeight = FontWeight.Medium
                )
                
                Text(
                    text = "Wound ${woundInfo.woundNumber} - ${woundInfo.location}",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
                
                Text(
                    text = woundInfo.urgentReason,
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.error
                )
            }
            
            Icon(
                imageVector = Icons.Filled.ChevronRight,
                contentDescription = "View details",
                tint = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
    }
}

@Composable
fun RecentAssessmentsSection(
    recentAssessments: List<RecentAssessmentInfo>,
    onAssessmentClick: (String, String) -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(
            modifier = Modifier.padding(16.dp)
        ) {
            Text(
                text = "Recent Assessments",
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold
            )
            
            Spacer(modifier = Modifier.height(12.dp))
            
            if (recentAssessments.isEmpty()) {
                Text(
                    text = "No recent assessments",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    textAlign = TextAlign.Center,
                    modifier = Modifier.fillMaxWidth()
                )
            } else {
                recentAssessments.take(5).forEach { assessment ->
                    RecentAssessmentItem(
                        assessmentInfo = assessment,
                        onClick = { onAssessmentClick(assessment.patientId, assessment.woundId) }
                    )
                    
                    if (assessment != recentAssessments.last()) {
                        Spacer(modifier = Modifier.height(8.dp))
                    }
                }
            }
        }
    }
}

@Composable
fun RecentAssessmentItem(
    assessmentInfo: RecentAssessmentInfo,
    onClick: () -> Unit
) {
    Surface(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onClick() },
        shape = RoundedCornerShape(8.dp),
        color = MaterialTheme.colorScheme.surfaceVariant
    ) {
        Row(
            modifier = Modifier.padding(12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column(
                modifier = Modifier.weight(1f)
            ) {
                Text(
                    text = assessmentInfo.patientName,
                    style = MaterialTheme.typography.bodyMedium,
                    fontWeight = FontWeight.Medium
                )
                
                Text(
                    text = "BWAT Score: ${assessmentInfo.bwatScore} (${assessmentInfo.healingStatus})",
                    style = MaterialTheme.typography.bodySmall,
                    color = when (assessmentInfo.healingStatus) {
                        "Regenerating" -> Color(0xFF4CAF50)
                        "Degenerating" -> Color(0xFFF44336)
                        else -> MaterialTheme.colorScheme.onSurfaceVariant
                    }
                )
                
                Text(
                    text = assessmentInfo.assessmentDate,
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
            
            Icon(
                imageVector = Icons.Filled.ChevronRight,
                contentDescription = "View details",
                tint = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
    }
}

@Composable
fun DueForAssessmentSection(
    woundsDue: List<WoundDueInfo>,
    onWoundClick: (String, String) -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.secondaryContainer
        )
    ) {
        Column(
            modifier = Modifier.padding(16.dp)
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(
                    imageVector = Icons.Filled.Schedule,
                    contentDescription = "Due",
                    tint = MaterialTheme.colorScheme.secondary
                )
                
                Spacer(modifier = Modifier.width(8.dp))
                
                Text(
                    text = "Due for Assessment (${woundsDue.size})",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.onSecondaryContainer
                )
            }
            
            Spacer(modifier = Modifier.height(12.dp))
            
            woundsDue.take(3).forEach { wound ->
                WoundDueItem(
                    woundInfo = wound,
                    onClick = { onWoundClick(wound.patientId, wound.woundId) }
                )
                
                if (wound != woundsDue.last()) {
                    Spacer(modifier = Modifier.height(8.dp))
                }
            }
        }
    }
}

@Composable
fun WoundDueItem(
    woundInfo: WoundDueInfo,
    onClick: () -> Unit
) {
    Surface(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onClick() },
        shape = RoundedCornerShape(8.dp),
        color = MaterialTheme.colorScheme.surface
    ) {
        Row(
            modifier = Modifier.padding(12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column(
                modifier = Modifier.weight(1f)
            ) {
                Text(
                    text = woundInfo.patientName,
                    style = MaterialTheme.typography.bodyMedium,
                    fontWeight = FontWeight.Medium
                )
                
                Text(
                    text = "Wound ${woundInfo.woundNumber} - ${woundInfo.location}",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
                
                Text(
                    text = "Due: ${woundInfo.dueDate}",
                    style = MaterialTheme.typography.bodySmall,
                    color = if (woundInfo.isOverdue) Color(0xFFF44336) else MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
            
            Icon(
                imageVector = Icons.Filled.ChevronRight,
                contentDescription = "View details",
                tint = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
    }
}

@Composable
fun HealingProgressSection(healingStats: HealingProgressStats) {
    Card(
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(
            modifier = Modifier.padding(16.dp)
        ) {
            Text(
                text = "Healing Progress Overview",
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold
            )
            
            Spacer(modifier = Modifier.height(16.dp))
            
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceEvenly
            ) {
                HealingStatItem(
                    count = healingStats.regenerating,
                    label = "Healing",
                    color = Color(0xFF4CAF50)
                )
                
                HealingStatItem(
                    count = healingStats.stalled,
                    label = "Stalled",
                    color = Color(0xFFFF9800)
                )
                
                HealingStatItem(
                    count = healingStats.degenerating,
                    label = "Deteriorating",
                    color = Color(0xFFF44336)
                )
            }
        }
    }
}

@Composable
fun HealingStatItem(
    count: Int,
    label: String,
    color: Color
) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Surface(
            modifier = Modifier.size(48.dp),
            shape = RoundedCornerShape(24.dp),
            color = color.copy(alpha = 0.1f)
        ) {
            Box(
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = count.toString(),
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    color = color
                )
            }
        }
        
        Spacer(modifier = Modifier.height(8.dp))
        
        Text(
            text = label,
            style = MaterialTheme.typography.bodySmall,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )
    }
}

// Data classes for dashboard state
data class DashboardStatistics(
    val totalPatients: Int = 0,
    val activeWounds: Int = 0,
    val assessmentsThisWeek: Int = 0,
    val healingRate: Int = 0,
    val avgHealingTime: Int = 0,
    val photosThisMonth: Int = 0
)

data class UrgentWoundInfo(
    val patientId: String,
    val woundId: String,
    val patientName: String,
    val woundNumber: Int,
    val location: String,
    val urgentReason: String
)

data class RecentAssessmentInfo(
    val patientId: String,
    val woundId: String,
    val patientName: String,
    val bwatScore: Int,
    val healingStatus: String,
    val assessmentDate: String
)

data class WoundDueInfo(
    val patientId: String,
    val woundId: String,
    val patientName: String,
    val woundNumber: Int,
    val location: String,
    val dueDate: String,
    val isOverdue: Boolean
)

data class HealingProgressStats(
    val regenerating: Int = 0,
    val stalled: Int = 0,
    val degenerating: Int = 0
)