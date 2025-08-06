package com.woundcare.assessment.presentation.assessment

import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Camera
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp

@Composable
fun AssessmentScreen(
    patientId: String,
    woundId: String? = null,
    onNavigateBack: () -> Unit,
    onNavigateToCamera: (String) -> Unit
) {
    Box(
        modifier = Modifier.fillMaxSize(),
        contentAlignment = Alignment.Center
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(
                text = "BWAT Assessment",
                style = MaterialTheme.typography.headlineMedium,
                fontWeight = FontWeight.Bold
            )
            
            Spacer(modifier = Modifier.height(16.dp))
            
            Text(
                text = "Patient ID: $patientId",
                style = MaterialTheme.typography.bodyLarge
            )
            
            if (woundId != null) {
                Text(
                    text = "Wound ID: $woundId",
                    style = MaterialTheme.typography.bodyLarge
                )
            }
            
            Spacer(modifier = Modifier.height(16.dp))
            
            Text(
                text = "BWAT assessment interface will be implemented here",
                style = MaterialTheme.typography.bodyMedium
            )
            
            Spacer(modifier = Modifier.height(24.dp))
            
            Button(
                onClick = { onNavigateToCamera("sample-wound-id") }
            ) {
                Icon(
                    imageVector = Icons.Filled.Camera,
                    contentDescription = "Camera",
                    modifier = Modifier.size(18.dp)
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text("Take Photo")
            }
        }
    }
}