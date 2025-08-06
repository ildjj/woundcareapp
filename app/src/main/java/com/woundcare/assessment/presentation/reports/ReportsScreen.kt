package com.woundcare.assessment.presentation.reports

import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Analytics
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp

@Composable
fun ReportsScreen(
    onNavigateBack: () -> Unit
) {
    Box(
        modifier = Modifier.fillMaxSize(),
        contentAlignment = Alignment.Center
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Icon(
                imageVector = Icons.Filled.Analytics,
                contentDescription = "Reports",
                modifier = Modifier.size(96.dp),
                tint = MaterialTheme.colorScheme.secondary
            )
            
            Spacer(modifier = Modifier.height(24.dp))
            
            Text(
                text = "Reports & Analytics",
                style = MaterialTheme.typography.headlineMedium,
                fontWeight = FontWeight.Bold
            )
            
            Spacer(modifier = Modifier.height(16.dp))
            
            Text(
                text = "Comprehensive reporting and analytics dashboard will be implemented here",
                style = MaterialTheme.typography.bodyMedium
            )
            
            Spacer(modifier = Modifier.height(16.dp))
            
            Text(
                text = "Features will include:",
                style = MaterialTheme.typography.bodyMedium,
                fontWeight = FontWeight.Medium
            )
            
            Spacer(modifier = Modifier.height(8.dp))
            
            Column {
                Text("• Patient outcome reports")
                Text("• Healing progress charts")
                Text("• BWAT score trends")
                Text("• Treatment effectiveness analysis")
                Text("• Photo comparison timelines")
                Text("• Export capabilities for research")
            }
        }
    }
}