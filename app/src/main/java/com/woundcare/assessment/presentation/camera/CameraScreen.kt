package com.woundcare.assessment.presentation.camera

import android.net.Uri
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CameraAlt
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp

@Composable
fun CameraScreen(
    woundId: String? = null,
    onNavigateBack: () -> Unit,
    onPhotoTaken: (Uri) -> Unit
) {
    Box(
        modifier = Modifier.fillMaxSize(),
        contentAlignment = Alignment.Center
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Icon(
                imageVector = Icons.Filled.CameraAlt,
                contentDescription = "Camera",
                modifier = Modifier.size(96.dp),
                tint = MaterialTheme.colorScheme.primary
            )
            
            Spacer(modifier = Modifier.height(24.dp))
            
            Text(
                text = "Camera Interface",
                style = MaterialTheme.typography.headlineMedium,
                fontWeight = FontWeight.Bold
            )
            
            Spacer(modifier = Modifier.height(16.dp))
            
            if (woundId != null) {
                Text(
                    text = "Wound ID: $woundId",
                    style = MaterialTheme.typography.bodyLarge
                )
                
                Spacer(modifier = Modifier.height(16.dp))
            }
            
            Text(
                text = "CameraX integration and AI-powered photo analysis will be implemented here",
                style = MaterialTheme.typography.bodyMedium
            )
            
            Spacer(modifier = Modifier.height(32.dp))
            
            Row(
                horizontalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                OutlinedButton(
                    onClick = onNavigateBack
                ) {
                    Text("Cancel")
                }
                
                Button(
                    onClick = { 
                        // Simulate photo taken
                        onPhotoTaken(Uri.EMPTY)
                    }
                ) {
                    Text("Simulate Photo")
                }
            }
        }
    }
}